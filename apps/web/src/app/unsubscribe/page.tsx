'use client'

import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'

export default function UnsubscribePage() {
  const params = useSearchParams()
  const [status, setStatus] = useState<'pending' | 'success' | 'error'>('pending')
  const [message, setMessage] = useState('')

  useEffect(() => {
    const email = params.get('email')
    const token = params.get('token')
    const audienceId = params.get('audienceId') ?? undefined

    if (!email || !token) {
      setStatus('error')
      setMessage('Invalid unsubscribe link.')
      return
    }

    fetch('/api/unsubscribe', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, token, audienceId }),
    })
      .then(async (res) => {
        if (res.ok) {
          setStatus('success')
          setMessage(`${email} has been unsubscribed from all marketing emails.`)
        } else {
          const data = await res.json().catch(() => ({}))
          setStatus('error')
          setMessage((data as { error?: string }).error ?? 'Could not process unsubscribe request.')
        }
      })
      .catch(() => {
        setStatus('error')
        setMessage('Network error. Please try again.')
      })
  }, [params])

  return (
    <main className="min-h-screen flex items-center justify-center bg-emerald-50 px-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow p-8 text-center">
        <h1 className="text-2xl font-bold text-emerald-800 mb-4">
          {status === 'pending' && 'Processing...'}
          {status === 'success' && 'Unsubscribed'}
          {status === 'error' && 'Something went wrong'}
        </h1>
        <p className="text-gray-600">{message}</p>
        {status === 'success' && (
          <p className="text-sm text-gray-400 mt-6">
            You will no longer receive marketing emails from Way2Quran Marketing.
            Transactional emails (receipts, confirmations) may still be sent.
          </p>
        )}
      </div>
    </main>
  )
}
