// n8n Code: thống kê qualified vs reject

const data = $getWorkflowStaticData('global');
if (!data.sl_stats) {
  data.sl_stats = { sheet_ok: 0, sheet_fail: 0, qualified: 0, apify_empty: 0, not_qualified: 0 };
}

for (const item of $input.all()) {
  const j = item.json;
  if (j.ok && j.claude?.verdict === 'qualified') {
    data.sl_stats.qualified += 1;
  } else if (j.ok) {
    data.sl_stats.not_qualified += 1;
  }
}

return $input.all();
