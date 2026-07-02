import './NewsletterSignup.css'

// ---------------------------------------------------------------------------
// NewsletterSignup
// An email-capture band that posts straight to the client's newsletter vendor
// (Brevo, MailerLite, Buttondown… — any provider that accepts a form POST).
// The vendor account lives in the CLIENT's name; this component is just the
// on-site door to it. No JavaScript required to submit.
//
// Props:
//   eyebrow     string
//   headline    string
//   subtext     string
//   action      string  — the vendor's form-POST URL (required to actually work)
//   emailField  string  — input name the vendor expects (default "email";
//                         Brevo uses "EMAIL", MailerLite "fields[email]")
//   placeholder string  — input placeholder (default "you@example.com")
//   buttonLabel string  — submit label (default "Subscribe")
//   disclaimer  string  — small print under the form (unsubscribe note etc.)
//   variant     "default"|"alt"|"accent"  — section background
// ---------------------------------------------------------------------------

export default function NewsletterSignup({
  eyebrow,
  headline,
  subtext,
  action,
  emailField = 'email',
  placeholder = 'you@example.com',
  buttonLabel = 'Subscribe',
  disclaimer,
  variant = 'alt',
}) {
  return (
    <section className={`section newsletter section--${variant}`}>
      <div className="section-container">
        <div className="newsletter__inner">
          {eyebrow && <p className="section-eyebrow">{eyebrow}</p>}
          {headline && <h2 className="section-title">{headline}</h2>}
          {subtext && <p className="section-sub">{subtext}</p>}
          <form className="newsletter__form" action={action} method="post" target="_blank" rel="noopener">
            <label className="newsletter__label" htmlFor="newsletter-email">Email address</label>
            <div className="newsletter__row">
              <input
                id="newsletter-email"
                className="newsletter__input"
                type="email"
                name={emailField}
                placeholder={placeholder}
                required
                autoComplete="email"
              />
              <button className="newsletter__btn" type="submit">{buttonLabel}</button>
            </div>
          </form>
          {disclaimer && <p className="newsletter__disclaimer">{disclaimer}</p>}
        </div>
      </div>
    </section>
  )
}
