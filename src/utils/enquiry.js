import { site } from '../data/site'

const COOLDOWN_MS = 30000
const KEY = 'nivora-last-enquiry'

/** Validate enquiry fields. Returns { field: 'message' } (empty object = valid). */
export function validateEnquiry(form) {
  const errors = {}

  if (!form.name.trim() || form.name.trim().length < 2) {
    errors.name = 'Please enter your full name.'
  }

  const digits = form.phone.replace(/\D/g, '')
  const local = digits.startsWith('91') && digits.length === 12 ? digits.slice(2) : digits
  if (!/^[6-9]\d{9}$/.test(local)) {
    errors.phone = 'Enter a valid 10-digit mobile number.'
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(form.email.trim())) {
    errors.email = 'Enter a valid email address.'
  }

  if (form.message.length > 1000) {
    errors.message = 'Message is too long (max 1000 characters).'
  }

  if (!form.consent) {
    errors.consent = 'Please agree to be contacted about your enquiry.'
  }

  return errors
}

/** Simple client-side rate limit (real protection must also exist on the server). */
export function secondsUntilNextEnquiry() {
  try {
    const last = Number(localStorage.getItem(KEY) || 0)
    const left = COOLDOWN_MS - (Date.now() - last)
    return left > 0 ? Math.ceil(left / 1000) : 0
  } catch {
    return 0
  }
}

/**
 * Send the enquiry. With site.formEndpoint set (Formspree, Netlify, own API)
 * it POSTs JSON. Without it, runs in demo mode (resolves successfully).
 */
export async function submitEnquiry(payload) {
  if (site.formEndpoint) {
    const response = await fetch(site.formEndpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify(payload)
    })

    if (!response.ok) throw new Error('Request failed')
  } else {
    await new Promise((resolve) => setTimeout(resolve, 700))
  }

  try {
    localStorage.setItem(KEY, String(Date.now()))
  } catch {
    /* ignore */
  }
}
