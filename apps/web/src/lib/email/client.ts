import { Resend } from 'resend'

let _client: Resend | null = null

export function getResendClient(): Resend {
  if (!_client) {
    const apiKey = process.env.RESEND_API_KEY
    if (!apiKey) throw new Error('RESEND_API_KEY env var is not set')
    _client = new Resend(apiKey)
  }
  return _client
}

export const DEFAULT_FROM =
  process.env.RESEND_FROM_EMAIL ?? 'Way2Quran Marketing <noreply@way2quran.com>'
