// n8n Code: thống kê Apify empty vs có post (workflow staticData)

const data = $getWorkflowStaticData('global');
if (!data.sl_stats) {
  data.sl_stats = { sheet_ok: 0, sheet_fail: 0, qualified: 0, apify_empty: 0, not_qualified: 0 };
}

for (const item of $input.all()) {
  const j = item.json;
  if (j.error === 'APIFY_EMPTY' || j.error === 'APIFY_NO_RESULTS') {
    data.sl_stats.apify_empty += 1;
  }
}

return $input.all();
