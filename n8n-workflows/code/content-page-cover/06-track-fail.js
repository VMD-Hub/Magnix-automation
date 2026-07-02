// n8n Code: thống kê lỗi cover

const data = $getWorkflowStaticData('global');
if (!data.cpc_stats) data.cpc_stats = {};
const item = $input.first().json;
if (item.cover_ok) {
  data.cpc_stats.cover_ok = (data.cpc_stats.cover_ok || 0) + 1;
} else if (item.generate_ok === false) {
  data.cpc_stats.generate_fail = (data.cpc_stats.generate_fail || 0) + 1;
} else if (item.drive_ok === false) {
  data.cpc_stats.drive_fail = (data.cpc_stats.drive_fail || 0) + 1;
} else {
  data.cpc_stats.other_fail = (data.cpc_stats.other_fail || 0) + 1;
}
return $input.all();
