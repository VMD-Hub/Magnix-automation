/**
 * Reseed CHỈ dự án ID Town Long Thành vào Postgres.
 *
 * Usage: npm run db:reseed:id-town
 */
import { PrismaClient } from "@prisma/client";
import { seedIdTown } from "../lib/seed/id-town";
import { ID_TOWN_SLUG } from "../lib/content/id-town-landing";
import { parseProjectOverview } from "../lib/content/project-landing";

const prisma = new PrismaClient();

async function main() {
  const { project } = await seedIdTown(prisma);
  const landing = parseProjectOverview(project.overviewData).landing;

  console.log(`✔ Reseed ID Town vào Postgres (slug: ${ID_TOWN_SLUG}).`);
  console.log(`  Hero: ${landing?.heroImage?.url ?? "(none)"}`);
  console.log(
    `  Highlights: ${landing?.highlights.length ?? 0} · Gallery: ${landing?.gallery.length ?? 0}`,
  );
  console.log(`  Public: /du-an/${ID_TOWN_SLUG}`);
  console.log(`  Hub: /du-an/nha-o-xa-hoi/dong-nai`);
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
