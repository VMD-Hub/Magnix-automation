import { NextRequest } from "next/server";
import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { created, fail, handleApiError, ok } from "@/lib/api/http";
import {
  projectCreateSchema,
  projectListQuerySchema,
} from "@/lib/validation/project";
import { assertNoxhSaleGate } from "@/lib/rules/project-noxh-gate";
import { INTERNAL_DEMO_PROJECT_SLUGS } from "@/lib/deploy/internal-demo-content";

// NOTE: Auth/role enforcement (chỉ Developer/Admin được tạo dự án) nằm ngoài
// phạm vi module này — sẽ do User/Auth service riêng đảm nhiệm.

export async function GET(req: NextRequest) {
  try {
    const query = projectListQuerySchema.parse(
      Object.fromEntries(req.nextUrl.searchParams),
    );

    const where: Prisma.ProjectWhereInput = {
      ...(query.province ? { province: query.province } : {}),
      ...(query.district ? { district: query.district } : {}),
      ...(query.projectType ? { projectType: query.projectType } : {}),
      ...(query.status ? { status: query.status } : {}),
      deletedAt: null,
      slug: { notIn: [...INTERNAL_DEMO_PROJECT_SLUGS] },
    };

    const [items, total] = await Promise.all([
      prisma.project.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip: (query.page - 1) * query.pageSize,
        take: query.pageSize,
        include: {
          developer: { select: { id: true, name: true, verified: true } },
          _count: { select: { unitTypes: true, listings: true } },
        },
      }),
      prisma.project.count({ where }),
    ]);

    return ok({
      items,
      pagination: {
        page: query.page,
        pageSize: query.pageSize,
        total,
        totalPages: Math.ceil(total / query.pageSize),
      },
    });
  } catch (err) {
    return handleApiError(err);
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = projectCreateSchema.parse(await req.json());
    const { unitTypes, legalDocs, status, ...projectData } = body;

    const project = await prisma.$transaction(async (tx) => {
      const createdProject = await tx.project.create({
        data: {
          ...projectData,
          ...(status ? { status } : {}),
          overviewData: projectData.overviewData
            ? (projectData.overviewData as Prisma.InputJsonValue)
            : undefined,
          unitTypes: unitTypes?.length
            ? { create: unitTypes }
            : undefined,
          legalDocs: legalDocs?.length
            ? { create: legalDocs }
            : undefined,
        },
        include: { unitTypes: true, legalDocs: true, developer: true },
      });

      // Rule #6: if creating directly as DANG_BAN for a NOXH project, the legal
      // gate must also hold. Throwing here rolls back the whole transaction.
      const gate = await assertNoxhSaleGate(tx, {
        projectId: createdProject.id,
        projectType: createdProject.projectType,
        targetStatus: createdProject.status,
      });
      if (!gate.ok) {
        throw new NoxhGateError(gate.message);
      }

      return createdProject;
    });

    return created(project);
  } catch (err) {
    if (err instanceof NoxhGateError) {
      return fail(409, "NOXH_MISSING_LEGAL_DOC", err.message);
    }
    return handleApiError(err);
  }
}

class NoxhGateError extends Error {}
