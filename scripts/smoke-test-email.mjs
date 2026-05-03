#!/usr/bin/env node
/**
 * Smoke test: sends 100 emails and checks delivery rate via Resend API.
 *
 * Usage:
 *   RESEND_API_KEY=re_xxx SMOKE_TO=you@example.com node scripts/smoke-test-email.mjs
 *
 * The test uses + aliases: you+smoke0@example.com … you+smoke99@example.com
 * so all 100 land in the same inbox without needing 100 real addresses.
 *
 * Requirements: Node 22+, RESEND_API_KEY set, verified sending domain.
 */

const RESEND_API_KEY = process.env.RESEND_API_KEY
const SMOKE_TO = process.env.SMOKE_TO
const FROM = process.env.SMOKE_FROM ?? 'Way2Quran Smoke Test <smoke@way2quran.com>'
const BATCH = 100
const WAIT_SECONDS = 60
const TARGET_RATE = 0.95

if (!RESEND_API_KEY) {
  console.error('❌  RESEND_API_KEY is not set')
  process.exit(1)
}
if (!SMOKE_TO) {
  console.error('❌  SMOKE_TO is not set (e.g. you@example.com)')
  process.exit(1)
}

const [localPart, domain] = SMOKE_TO.split('@')
const sentIds = []

console.log(`Sending ${BATCH} smoke emails from ${FROM}...`)

for (let i = 0; i < BATCH; i++) {
  const to = `${localPart}+smoke${i}@${domain}`
  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${RESEND_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: FROM,
      to: [to],
      subject: `[Smoke ${i}] Way2Quran delivery test`,
      html: `<p>Smoke test email #${i}. Sent at ${new Date().toISOString()}</p>`,
    }),
  })

  const data = await res.json()
  if (!res.ok || !data.id) {
    console.error(`  ⚠️  Email ${i} failed:`, data)
  } else {
    sentIds.push(data.id)
    if (i % 10 === 0) process.stdout.write(`  Sent ${i + 1}/${BATCH}\r`)
  }

  // Resend rate limit: 10 req/s on free tier — add a small delay
  await new Promise((r) => setTimeout(r, 120))
}

console.log(`\n✅ Sent ${sentIds.length}/${BATCH} emails. Waiting ${WAIT_SECONDS}s for delivery events...`)
await new Promise((r) => setTimeout(r, WAIT_SECONDS * 1000))

console.log('Checking delivery status...')
let delivered = 0

for (const id of sentIds) {
  const res = await fetch(`https://api.resend.com/emails/${id}`, {
    headers: { Authorization: `Bearer ${RESEND_API_KEY}` },
  })
  const data = await res.json()
  if (['delivered', 'opened', 'clicked'].includes(data.last_event)) {
    delivered++
  }
  await new Promise((r) => setTimeout(r, 50))
}

const rate = delivered / sentIds.length
console.log(`\nDelivery rate: ${delivered}/${sentIds.length} = ${(rate * 100).toFixed(1)}%`)

if (rate >= TARGET_RATE) {
  console.log(`✅ PASS — delivery rate ${(rate * 100).toFixed(1)}% >= ${TARGET_RATE * 100}%`)
  process.exit(0)
} else {
  console.error(`❌ FAIL — delivery rate ${(rate * 100).toFixed(1)}% < ${TARGET_RATE * 100}%`)
  process.exit(1)
}
