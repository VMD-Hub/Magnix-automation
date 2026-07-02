import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { created, handleApiError } from "@/lib/api/http";
import { brokerCreateSchema } from "@/lib/validation/listing";

// POST /api/brokers — tạo broker.
// NOTE: Onboarding/định danh broker thật thuộc User/Auth service (ngoài phạm vi).
// Endpoint này phục vụ tạo broker để các flow Listing/Referral hoạt động.
export async function POST(req: NextRequest) {
  try {
    const body = brokerCreateSchema.parse(await req.json());
    const broker = await prisma.broker.create({ data: body });
    return created(broker);
  } catch (err) {
    return handleApiError(err);
  }
}
