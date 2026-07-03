// Gửi email qua Resend API. Không log nội dung đầy đủ.

const item = $input.first().json;
const enabled = String($env.NOXH_NURTURE_EMAIL_ENABLED || 'true').toLowerCase() === 'true';
const resendKey = $env.RESEND_API_KEY || '';
const from = $env.EMAIL_FROM || 'House X <noreply@timnhaxahoi.com>';

if (!enabled) {
  return [{
    json: {
      ...item,
      email_sent: false,
      email_skip: 'NOXH_NURTURE_EMAIL_ENABLED=false',
    },
  }];
}

if (!resendKey) {
  return [{
    json: {
      ...item,
      email_sent: false,
      email_skip: 'MISSING_RESEND_API_KEY',
    },
  }];
}

let res;
try {
  res = await this.helpers.httpRequest({
    method: 'POST',
    url: 'https://api.resend.com/emails',
    headers: {
      authorization: `Bearer ${resendKey}`,
      'content-type': 'application/json',
    },
    body: {
      from,
      to: [item.contact_email],
      subject: item.email_subject,
      html: item.email_html,
      text: item.email_text,
      tags: [{ name: 'noxh_nurture', value: item.tier }],
    },
    json: true,
    timeout: 20000,
  });
} catch (e) {
  return [{
    json: {
      ...item,
      email_sent: false,
      email_error: (e.message || String(e)).slice(0, 200),
    },
  }];
}

return [{
  json: {
    ...item,
    email_sent: !!res?.id,
    email_provider_id: res?.id || null,
  },
}];
