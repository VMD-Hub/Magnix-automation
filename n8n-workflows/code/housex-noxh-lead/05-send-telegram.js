// Gửi Telegram (HOT/WARM). COLD/OUT bỏ qua.

const item = $input.first().json;
if (!item.telegram_enabled) {
  return [{
    json: {
      ...item,
      telegram_sent: false,
      telegram_skip: item.telegram_skip || 'TELEGRAM_DISABLED',
    },
  }];
}

const token = $env.TELEGRAM_BOT_TOKEN || '';
const chatId = item.telegram_chat_id || '';

let tgRes;
try {
  tgRes = await this.helpers.httpRequest({
    method: 'POST',
    url: `https://api.telegram.org/bot${token}/sendMessage`,
    body: {
      chat_id: chatId,
      text: item.telegram_message,
      disable_web_page_preview: true,
    },
    json: true,
    timeout: 15000,
  });
} catch (e) {
  return [{
    json: {
      ...item,
      telegram_sent: false,
      telegram_error: (e.message || String(e)).slice(0, 200),
    },
  }];
}

return [{
  json: {
    ...item,
    telegram_sent: tgRes?.ok === true,
    telegram_message_id: tgRes?.result?.message_id || null,
  },
}];
