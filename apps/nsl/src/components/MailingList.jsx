import { useState } from 'react'
import { CONTACT_EMAIL } from '../data'

// ---------------------------------------------------------------------------
// MailingList — email signup. With no backend wired up yet, it composes a
// pre-filled mailto to the club inbox so no submissions are lost.
// ---------------------------------------------------------------------------

export default function MailingList() {
  const [email, setEmail] = useState('')
  const [done, setDone] = useState(false)

  function handleSubmit(e) {
    e.preventDefault()
    if (!email.trim()) return
    const body = encodeURIComponent(`Please add me to the NSL mailing list: ${email.trim()}`)
    window.location.href = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent('Mailing list signup')}&body=${body}`
    setDone(true)
  }

  return (
    <>
      <form className="nsl-mailing" onSubmit={handleSubmit} noValidate>
        <input
          type="email" placeholder="your.email@northeastern.edu"
          value={email} onChange={e => setEmail(e.target.value)} aria-label="Email address"
        />
        <button type="submit">Join the list</button>
      </form>
      {done && <p className="nsl-mailing__done">Thanks! Your email app should open to confirm.</p>}
    </>
  )
}
