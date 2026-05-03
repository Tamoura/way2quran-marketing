import { NextRequest, NextResponse } from 'next/server'
import { removeFromAudience, verifyUnsubscribeToken } from '@/lib/email'

export async function POST(request: NextRequest) {
  let body: unknown
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  const { email, token, audienceId } = body as Record<string, string>

  if (!email || !token) {
    return NextResponse.json({ error: 'email and token are required' }, { status: 400 })
  }

  if (!verifyUnsubscribeToken(email, token)) {
    return NextResponse.json({ error: 'Invalid or expired unsubscribe token' }, { status: 403 })
  }

  try {
    await removeFromAudience(email, audienceId)
  } catch (err) {
    console.error('[unsubscribe] failed', err)
    return NextResponse.json({ error: 'Unsubscribe failed' }, { status: 502 })
  }

  return NextResponse.json({ success: true })
}
