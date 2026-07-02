// n8n Code: track carousel draft OK

const data = $getWorkflowStaticData('global');
if (!data.a3b_stats) data.a3b_stats = { carousel_ok: 0, carousel_fail: 0 };
data.a3b_stats.carousel_ok += 1;
return $input.all();
