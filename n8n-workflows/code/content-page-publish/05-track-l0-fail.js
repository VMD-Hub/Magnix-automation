// n8n Code: track L0 fail (forbidden trước khi gọi Graph API)

const data = $getWorkflowStaticData('global');
if (!data.cpp_stats) data.cpp_stats = {};
data.cpp_stats.l0_fail = (data.cpp_stats.l0_fail || 0) + 1;
data.cpp_stats.publish_fail = (data.cpp_stats.publish_fail || 0) + 1;
return $input.all();
