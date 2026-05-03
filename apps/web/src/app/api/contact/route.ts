import { NextRequest, NextResponse } from 'next/server'
import { sendTransactional, addToAudience, contactConfirmationHtml, internalContactAlertHtml, buildUnsubscribeUrl } from '@/lib/email'

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export async function POST(request: NextRequest) {
  let body: unknown
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  const { name, email, message } = body as Record<string, string>

  if (!name?.trim() || !email?.trim() || !message?.trim()) {
    return NextResponse.json({ error: 'name, email, and message are required' }, { status: 400 })
  }
  if (!EMAIL_REGEX.test(email)) {
    return NextResponse.json({ error: 'Invalid email address' }, { status: 400 })
  }

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? `https://${request.headers.get('host')}`
  const unsubscribeUrl = buildUnsubscribeUrl(baseUrl, email)
  const html = contactConfirmationHtml(name, message).replace('{{UNSUBSCRIBE_URL}}', unsubscribeUrl)

  try {
    await sendTransactional({
      to: email,
      subject: 'We received your message — Way2Quran Marketing',
      html,
    })

    const internalEmail = process.env.INTERNAL_EMAIL
    if (internalEmail) {
      await sendTransactional({
        to: internalEmail,
        subject: `New contact from ${name}`,
        html: internalContactAlertHtml(name, email, message, new Date().toISOString()),
      })
    }

    if (process.env.RESEND_AUDIENCE_ID) {
      await addToAudience(email, { firstName: name.split(' ')[0], lastName: name.split(' ').slice(1).join(' ') || undefined })
    }
  } catch (err) {
    console.error('[contact] email send failed', err)
    return NextResponse.json({ error: 'Failed to send email' }, { status: 502 })
  }

  return NextResponse.json({ success: true })
}
