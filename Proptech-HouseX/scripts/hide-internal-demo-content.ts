import { PrismaClient } from "@prisma/client";
import { hideInternalDemoContent } from "../lib/seed/hide-internal-demo-content";

const prisma = new PrismaClient();

async function main() {
  const result = await hideInternalDemoContent(prisma);
  console.log("Đã ẩn nội dung demo nội bộ khỏi web:");
  console.log(`  Dự án: ${result.projectsHidden} (${result.slugs.join(", ") || "—"})`);
  console.log(`  Tin đăng: ${result.listingsHidden}`);
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
