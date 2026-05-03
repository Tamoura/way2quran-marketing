function esc(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;')
}

export function contactConfirmationHtml(name: string, message: string): string {
  return `<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"><title>We received your message</title></head>
<body style="font-family:sans-serif;max-width:600px;margin:0 auto;padding:20px;color:#111827">
  <h1 style="color:#065f46">Thank you, ${esc(name)}!</h1>
  <p>We&rsquo;ve received your message and will be in touch within 1&ndash;2 business days.</p>
  <blockquote style="border-left:4px solid #6ee7b7;padding-left:16px;color:#374151;margin:16px 0">
    ${esc(message)}
  </blockquote>
  <p style="color:#6b7280;font-size:13px;margin-top:32px">
    Way2Quran Marketing Agency &bull;
    <a href="{{UNSUBSCRIBE_URL}}" style="color:#6b7280">Unsubscribe</a>
  </p>
</body>
</html>`
}

export function internalContactAlertHtml(
  name: string,
  email: string,
  message: string,
  submittedAt: string,
): string {
  return `<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"><title>New contact submission</title></head>
<body style="font-family:sans-serif;max-width:600px;margin:0 auto;padding:20px">
  <h2>New contact form submission</h2>
  <table style="border-collapse:collapse;width:100%">
    <tr><td style="padding:4px 8px;font-weight:bold">Name</td><td style="padding:4px 8px">${esc(name)}</td></tr>
    <tr><td style="padding:4px 8px;font-weight:bold">Email</td><td style="padding:4px 8px">${esc(email)}</td></tr>
    <tr><td style="padding:4px 8px;font-weight:bold">Submitted</td><td style="padding:4px 8px">${esc(submittedAt)}</td></tr>
  </table>
  <h3>Message</h3>
  <p style="white-space:pre-wrap">${esc(message)}</p>
</body>
</html>`
}
