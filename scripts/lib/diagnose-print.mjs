/** Pretty-print diagnostic counters for agent candidate scripts. */

export function printDiagnostic(title, reasons, extras = {}) {
  console.log(`=== ${title} ===`);
  console.log(`Sheet rows (non-empty): ${reasons.total ?? 0}`);
  console.log(`Eligible now: ${reasons.eligible ?? 0}`);
  console.log('\n--- Loại bởi filter ---');
  for (const [k, v] of Object.entries(reasons)) {
    if (k === 'total' || k === 'eligible') continue;
    console.log(`  ${k}: ${v}`);
  }
  for (const [label, obj] of Object.entries(extras)) {
    if (!obj || typeof obj !== 'object') continue;
    const entries = Object.entries(obj).sort((a, b) => b[1] - a[1]).slice(0, 8);
    if (!entries.length) continue;
    console.log(`\n--- ${label} ---`);
    console.log(entries.map(([k, v]) => `  ${k}: ${v}`).join('\n'));
  }
}
