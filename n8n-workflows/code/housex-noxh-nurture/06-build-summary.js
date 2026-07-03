const data = $getWorkflowStaticData('global');
const stats = data.nxn_stats || { sent: 0, failed: 0, skipped: 0 };
let hint = null;
if (stats.sent === 0 && stats.failed === 0) {
  hint = 'Không candidate — tier COLD/OUT, có email, chưa nurture_sent_at, đủ tuổi 24h';
} else if (stats.failed > 0) {
  hint = 'Một số email fail — kiểm tra RESEND_API_KEY và EMAIL_FROM';
}
return [{
  json: {
    ok: true,
    workflow: 'housex-noxh-nurture',
    stats,
    hint,
    finished_at: new Date().toISOString(),
  },
}];
