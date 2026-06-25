// n8n Code: thống kê parse fail

const data = $getWorkflowStaticData('global');
if (!data.a2_stats) data.a2_stats = { sheet_ok: 0, sheet_fail: 0, llm: 0, regex: 0, parse_fail: 0 };
data.a2_stats.parse_fail += 1;

return [{ json: { ok: false, dead_letter: true, ...$input.first().json } }];
