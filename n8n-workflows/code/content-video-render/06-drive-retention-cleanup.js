// n8n Code: xóa MP4 cũ trong ready_for_review (retention) — Agent 7

const RETENTION_DAYS = __VIDEO_DRIVE_RETENTION_DAYS__;
const folderId =
  $env.DRIVE_VIDEO_FOLDER_READY ||
  '__DRIVE_VIDEO_FOLDER_READY__';

if (!folderId || folderId.startsWith('__') || RETENTION_DAYS <= 0) {
  return [{
    json: {
      ok: true,
      cleanup_skip: true,
      reason: 'retention disabled or missing folder',
    },
  }];
}

const cutoff = Date.now() - RETENTION_DAYS * 24 * 60 * 60 * 1000;
const deleted = [];
const errors = [];

try {
  let pageToken = '';
  do {
    const q = encodeURIComponent(
      `'${folderId}' in parents and mimeType='video/mp4' and trashed=false`
    );
    const listUrl = `https://www.googleapis.com/drive/v3/files?q=${q}&fields=nextPageToken,files(id,name,createdTime)&pageSize=100&supportsAllDrives=true&includeItemsFromAllDrives=true${pageToken ? `&pageToken=${pageToken}` : ''}`;

    const listRes = await this.helpers.httpRequestWithAuthentication.call(this, 'googleApi', {
      method: 'GET',
      url: listUrl,
      json: true,
    });

    for (const f of listRes.files || []) {
      const created = new Date(f.createdTime).getTime();
      if (Number.isNaN(created) || created >= cutoff) continue;
      try {
        await this.helpers.httpRequestWithAuthentication.call(this, 'googleApi', {
          method: 'DELETE',
          url: `https://www.googleapis.com/drive/v3/files/${f.id}?supportsAllDrives=true`,
          json: true,
        });
        deleted.push({ id: f.id, name: f.name, createdTime: f.createdTime });
      } catch (e) {
        errors.push({ id: f.id, name: f.name, error: String(e.message || e) });
      }
    }
    pageToken = listRes.nextPageToken || '';
  } while (pageToken);

  const data = $getWorkflowStaticData('global');
  if (!data.a7_stats) data.a7_stats = {};
  data.a7_stats.drive_purged = (data.a7_stats.drive_purged || 0) + deleted.length;

  return [{
    json: {
      ok: true,
      cleanup_done: true,
      retention_days: RETENTION_DAYS,
      deleted_count: deleted.length,
      deleted: deleted.slice(0, 20),
      errors: errors.slice(0, 5),
    },
  }];
} catch (e) {
  return [{
    json: {
      ok: false,
      cleanup_error: String(e.message || e),
    },
  }];
}
