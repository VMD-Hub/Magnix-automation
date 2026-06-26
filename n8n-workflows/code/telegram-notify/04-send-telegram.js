// n8n Code: send Telegram message via Bot API

const item = $input.first().json;
if (item.duplicate || item.skipped) {
  return [{ json: { ...item, telegram_sent: false, telegram_skip: item.reason || 'duplicate' } }];
}

if (!item.telegram_enabled) {
  return [{ json: { ...item, telegram_sent: false, telegram_skip: 'TELEGRAM_APPROVAL_ENABLED' } }];
}

const token = $env.TELEGRAM_BOT_TOKEN || '';
const chatId = item.chat_id || '';
if (!token || !chatId) {
  return [{
    json: {
      ...item,
      telegram_sent: false,
      telegram_skip: 'MISSING_BOT_TOKEN_OR_CHAT_ID',
      sheet_status: 'failed',
    },
  }];
}

let tgRes;
try {
  tgRes = await this.helpers.httpRequest({
    method: 'POST',
    url: `https://api.telegram.org/bot${token}/sendMessage`,
    body: {
      chat_id: chatId,
      text: item.message,
      disable_web_page_preview: false,
    },
    json: true,
    timeout: 15000,
  });
} catch (e) {
  return [{
    json: {
      ...item,
      telegram_sent: false,
      telegram_error: e.message || 'TELEGRAM_HTTP_FAIL',
      sheet_status: 'failed',
    },
  }];
}

const messageId = tgRes?.result?.message_id ? String(tgRes.result.message_id) : '';
const chatIdOut = tgRes?.result?.chat?.id ? String(tgRes.result.chat.id) : chatId;

return [{
  json: {
    ...item,
    telegram_sent: Boolean(tgRes?.ok),
    telegram_message_id: messageId,
    telegram_chat_id: chatIdOut,
    sheet_status: tgRes?.ok ? 'sent' : 'failed',
  },
}];
