import { getResendClient, DEFAULT_FROM } from './client'

interface TransactionalEmailOptions {
  to: string | string[]
  subject: string
  html: string
  from?: string
  replyTo?: string
}

export async function sendTransactional(opts: TransactionalEmailOptions) {
  const resend = getResendClient()
  const { data, error } = await resend.emails.send({
    from: opts.from ?? DEFAULT_FROM,
    to: Array.isArray(opts.to) ? opts.to : [opts.to],
    subject: opts.subject,
    html: opts.html,
    reply_to: opts.replyTo,
  })
  if (error) throw new Error(`Resend send error: ${error.message}`)
  return data
}
