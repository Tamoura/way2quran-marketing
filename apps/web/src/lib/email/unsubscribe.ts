import { createHmac, timingSafeEqual } from 'crypto'

function getSecret(): string {
  const secret = process.env.UNSUBSCRIBE_SECRET
  if (!secret) throw new Error('UNSUBSCRIBE_SECRET env var is not set')
  return secret
}

export function generateUnsubscribeToken(email: string): string {
  return createHmac('sha256', getSecret()).update(email).digest('hex')
}

export function verifyUnsubscribeToken(email: string, token: string): boolean {
  try {
    const expected = Buffer.from(generateUnsubscribeToken(email))
    const actual = Buffer.from(token)
    if (expected.length !== actual.length) return false
    return timingSafeEqual(expected, actual)
  } catch {
    return false
  }
}

export function buildUnsubscribeUrl(baseUrl: string, email: string): string {
  const token = generateUnsubscribeToken(email)
  const params = new URLSearchParams({ email, token })
  return `${baseUrl}/unsubscribe?${params.toString()}`
}
