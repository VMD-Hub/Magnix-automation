const item = $input.first().json;
const sent = item.email_sent === true;
const data = $getWorkflowStaticData('global');
if (!data.nxn_stats) data.nxn_stats = { sent: 0, failed: 0, skipped: 0 };
if (sent) data.nxn_stats.sent += 1;
else if (item.email_skip) data.nxn_stats.skipped += 1;
else data.nxn_stats.failed += 1;

return [{
  json: {
    ...item,
    sheet_updated: sent && !!item.put_url,
  },
}];
