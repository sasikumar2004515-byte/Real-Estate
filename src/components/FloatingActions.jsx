import { site } from '../data/site'

const digits = site.phone.replace(/\D/g, '')

// Call and WhatsApp, fixed at the bottom right of every page.
function FloatingActions() {
  return (
    <div className="fab" aria-label="Quick contact">
      <a className="fab-btn fab-wa" href={`https://wa.me/${digits}`} target="_blank" rel="noreferrer" aria-label="Chat on WhatsApp">
        <span className="fab-tip">WhatsApp</span>
        <svg viewBox="0 0 32 32" width="28" height="28" aria-hidden="true" fill="currentColor">
          <path d="M16.04 3C9.4 3 4 8.38 4 15.01c0 2.12.55 4.19 1.6 6.02L4 29l8.14-1.56a12.03 12.03 0 0 0 3.9.65h.01C22.68 28.09 28 22.7 28 16.07 28 9.39 22.68 3 16.04 3Zm0 22.06h-.01c-1.2 0-2.38-.32-3.4-.93l-.24-.15-4.83.93.96-4.7-.16-.25a9.9 9.9 0 0 1-1.52-5.23c0-5.46 4.46-9.9 9.95-9.9 5.45 0 9.8 4.5 9.8 9.9 0 5.46-4.44 10.33-10.55 10.33Zm5.43-7.4c-.3-.15-1.76-.87-2.03-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.94 1.17-.17.2-.35.22-.65.07-.3-.15-1.26-.46-2.4-1.48-.89-.79-1.49-1.77-1.66-2.07-.17-.3-.02-.46.13-.61.14-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.08-.15-.67-1.62-.92-2.22-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.8.37-.27.3-1.04 1.02-1.04 2.48 0 1.46 1.06 2.87 1.21 3.07.15.2 2.09 3.2 5.06 4.48.71.31 1.26.49 1.69.63.71.23 1.36.2 1.87.12.57-.08 1.76-.72 2-1.41.25-.7.25-1.29.17-1.41-.07-.13-.27-.2-.57-.35Z" />
        </svg>
      </a>
      <a className="fab-btn fab-call" href={`tel:${site.phone.replace(/[^\d+]/g, '')}`} aria-label={`Call ${site.phone}`}>
        <span className="fab-tip">Call us</span>
        <svg viewBox="0 0 24 24" width="26" height="26" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M22 16.9v3a2 2 0 0 1-2.18 2 19.8 19.8 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.12 4.18 2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92Z" />
        </svg>
      </a>
    </div>
  )
}

export default FloatingActions
