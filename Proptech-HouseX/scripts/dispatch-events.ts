/**
 * Worker xử lý outbox (P2). Chạy 1 lần:
 *   npm run events:dispatch
 * Hoặc loop liên tục (non-serverless): npm run events:dispatch -- --loop
 */
import { prisma } from "@/lib/prisma";
import { dispatchOutbox } from "@/lib/events/dispatcher";

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

async function main() {
  const loop = process.argv.includes("--loop");
  do {
    const r = await dispatchOutbox({ limit: 50 });
    if (r.claimed > 0) {
      console.log(
        `[outbox] claimed=${r.claimed} done=${r.done} retry=${r.retry} dead=${r.dead}`,
      );
    }
    if (loop) await sleep(5000);
  } while (loop);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
