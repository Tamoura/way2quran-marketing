import { getResendClient } from './client'

function getAudienceId(override?: string): string {
  const id = override ?? process.env.RESEND_AUDIENCE_ID
  if (!id) throw new Error('audienceId or RESEND_AUDIENCE_ID env var required')
  return id
}

export async function addToAudience(
  email: string,
  opts?: { firstName?: string; lastName?: string; audienceId?: string },
) {
  const resend = getResendClient()
  const audienceId = getAudienceId(opts?.audienceId)
  const { data, error } = await resend.contacts.create({
    audienceId,
    email,
    firstName: opts?.firstName,
    lastName: opts?.lastName,
    unsubscribed: false,
  })
  if (error) throw new Error(`Resend audience error: ${error.message}`)
  return data
}

export async function removeFromAudience(email: string, audienceId?: string) {
  const resend = getResendClient()
  const id = getAudienceId(audienceId)
  const { data, error } = await resend.contacts.update({
    audienceId: id,
    email,
    unsubscribed: true,
  })
  if (error) throw new Error(`Resend unsubscribe error: ${error.message}`)
  return data
}
