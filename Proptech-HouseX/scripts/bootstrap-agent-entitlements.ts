/**
 * Bootstrap Agent entitlements cho mọi CTV đã duyệt (idempotent).
 * Chạy sau migrate + seed-agent-services trên VPS / local.
 *
 * Usage: npm run db:bootstrap:agent-entitlements
 */
import { prisma } from "../lib/prisma";
import { ensureBrokerEntitlements } from "../lib/data/agent-services";

async function main() {
  const services = await prisma.agentService.count({ where: { active: true } });
  if (services === 0) {
    console.error(
      "Chưa có agent_services — chạy trước: npm run db:seed:agent-services",
    );
    process.exit(1);
  }

  const brokers = await prisma.broker.findMany({
    where: { brokerType: "CTV" },
    select: { id: true, ctvCode: true },
  });

  console.log(`Bootstrap entitlements cho ${brokers.length} CTV…`);
  for (const b of brokers) {
    await ensureBrokerEntitlements(b.id);
    console.log(`  OK ${b.ctvCode ?? b.id.slice(0, 8)}`);
  }
  console.log("Done.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
