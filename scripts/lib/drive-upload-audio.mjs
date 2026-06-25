/**
 * Upload MP3 to Google Drive → public download URL (Creatomate fetch được)
 */
import { getAccessToken } from './sheet-client.mjs';

export async function uploadMp3PublicUrl(fileName, mp3Buffer, folderId) {
  const token = await getAccessToken('https://www.googleapis.com/auth/drive');
  const boundary = `magnix_${Date.now()}`;
  const metadata = JSON.stringify({
    name: fileName,
    parents: [folderId],
    mimeType: 'audio/mpeg',
  });
  const buf = Buffer.isBuffer(mp3Buffer) ? mp3Buffer : Buffer.from(mp3Buffer);
  const body = Buffer.concat([
    Buffer.from(`--${boundary}\r\nContent-Type: application/json; charset=UTF-8\r\n\r\n${metadata}\r\n`),
    Buffer.from(`--${boundary}\r\nContent-Type: audio/mpeg\r\n\r\n`),
    buf,
    Buffer.from(`\r\n--${boundary}--`),
  ]);

  const uploaded = await fetch(
    'https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart&fields=id,name&supportsAllDrives=true',
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': `multipart/related; boundary=${boundary}`,
      },
      body,
    }
  ).then((r) => r.json());

  if (uploaded.error) throw new Error(uploaded.error.message || JSON.stringify(uploaded.error));

  await fetch(`https://www.googleapis.com/drive/v3/files/${uploaded.id}/permissions?supportsAllDrives=true`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ type: 'anyone', role: 'reader' }),
  });

  return {
    file_id: uploaded.id,
    audio_url: `https://drive.google.com/uc?export=download&id=${uploaded.id}`,
  };
}
