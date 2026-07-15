/**
 * Gỡ liên kết zaloUserId khỏi tài khoản theo SĐT — chỉ dùng cho số TEST.
 *
 * Usage:
 *   npm run ops:unbind-zalo-phone -- --yes 0915779711 0826600800
 *   npm run ops:unbind-zalo-phone -- --yes +84915779711
 *   npm run ops:unbind-zalo-phone -- 0915779711          # dry-run (mặc định)
 *
 * An toàn:
 * - Chỉ cho phép số trong allowlist (mặc định + env OPS_TEST_PHONES).
 * - Không log PII đầy đủ — chỉ suffix số + id ngắn.
 * - Mặc định dry-run; cần --yes để ghi DB.
 */
import { PrismaClient } from "@prisma/client";
import { isValidVnPhone, normalizeVnPhone } from "../lib/phone";

const prisma = new PrismaClient();

/** SĐT test mặc định — mở rộng qua OPS_TEST_PHONES="+84...,+84..." */
const DEFAULT_ALLOWLIST = [
  "+84915779711",
  "+84826600800",
  "+84825500800",
];

function phoneSuffix(normalized: string): string {
  return `…${normalized.slice(-4)}`;
}

function loadAllowlist(): Set<string> {
  const fromEnv = (process.env.OPS_TEST_PHONES ?? "")
    .split(/[,;\s]+/)
    .map((s) => s.trim())
    .filter(Boolean)
    .map(normalizeVnPhone);
  return new Set([...DEFAULT_ALLOWLIST, ...fromEnv]);
}

function parseArgs(argv: string[]) {
  const yes = argv.includes("--yes") || argv.includes("-y");
  const phones = argv.filter((a) => !a.startsWith("-"));
  return { yes, phones };
}

async function main() {
  const { yes, phones } = parseArgs(process.argv.slice(2));
  if (phones.length === 0) {
    console.error(
      "Usage: npm run ops:unbind-zalo-phone -- [--yes] <phone> [phone...]",
    );
    process.exit(1);
  }

  const allow = loadAllowlist();
  const targets: string[] = [];

  for (const raw of phones) {
    const n = normalizeVnPhone(raw);
    if (!isValidVnPhone(n)) {
      console.error(`Skip invalid phone input (${phoneSuffix(n || raw)})`);
      continue;
    }
    if (!allow.has(n)) {
      console.error(
        `BLOCKED ${phoneSuffix(n)} — không nằm allowlist test. Thêm vào OPS_TEST_PHONES nếu cần.`,
      );
      continue;
    }
    targets.push(n);
  }

  if (targets.length === 0) {
    console.error("Không có SĐT hợp lệ trong allowlist.");
    process.exit(1);
  }

  const rows = await prisma.userAccount.findMany({
    where: { normalizedPhone: { in: targets } },
    select: {
      id: true,
      role: true,
      normalizedPhone: true,
      zaloUserId: true,
    },
  });

  console.log(`Found ${rows.length} account(s) for ${targets.length} phone(s).`);
  for (const r of rows) {
    const z =
      r.zaloUserId && r.zaloUserId.length > 4
        ? `zalo…${r.zaloUserId.slice(-4)}`
        : r.zaloUserId
          ? "zalo…"
          : "(none)";
    console.log(
      `  id…${r.id.slice(-6)} role=${r.role} phone=${phoneSuffix(r.normalizedPhone)} ${z}`,
    );
  }

  const bound = rows.filter((r) => r.zaloUserId);
  if (bound.length === 0) {
    console.log("Không có zaloUserId nào cần gỡ.");
    return;
  }

  if (!yes) {
    console.log(
      `Dry-run: sẽ gỡ zaloUserId trên ${bound.length} account(s). Thêm --yes để ghi.`,
    );
    return;
  }

  const result = await prisma.userAccount.updateMany({
    where: {
      id: { in: bound.map((r) => r.id) },
      zaloUserId: { not: null },
    },
    data: { zaloUserId: null },
  });

  console.log(`OK — cleared zaloUserId on ${result.count} account(s).`);
}

main()
  .catch((err) => {
    console.error(err instanceof Error ? err.message : err);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
