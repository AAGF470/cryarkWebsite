import { useState } from 'react'
import './ContactSection.css'
import { SectionIcon } from './SectionIcons'

// ---------------------------------------------------------------------------
// ContactSection
// Two-column: contact info on the left, contact form on the right.
// Falls back to mailto: if no onSubmit handler is provided.
//
// Props:
//   eyebrow   string
//   headline  string
//   subtext   string
//   email     string
//   phone     string (optional)
//   showForm  boolean  (default: true)
//   onSubmit  function({ name, contact, message })  — custom submit handler
//   variant   "default"|"alt"
// ---------------------------------------------------------------------------

export default function ContactSection({
  eyebrow,
  headline,
  subtext,
  email,
  phone,
  showForm = true,
  onSubmit,
  variant = 'default',
}) {
  const [form, setForm] = useState({ name: '', contact: '', message: '' })

  function handleChange(e) {
    const { name, value } = e.target
    setForm(f => ({ ...f, [name]: value }))
  }

  function handleSubmit(e) {
    e.preventDefault()
    if (onSubmit) {
      onSubmit(form)
    } else if (email) {
      const subject = encodeURIComponent('Inquiry from website')
      const body = encodeURIComponent(
        `Name: ${form.name}\nContact: ${form.contact}\n\n${form.message}`
      )
      window.location.href = `mailto:${email}?subject=${subject}&body=${body}`
    }
  }

  return (
    <section className={`section section--${variant}`}>
      <div className="section-container">
        <div className="contact-section__inner">
          <div className="contact-section__info">
            {eyebrow  && <p className="section-eyebrow">{eyebrow}</p>}
            {headline && <h2 className="section-title">{headline}</h2>}
            {subtext  && <p className="section-sub" style={{ marginBottom: '32px' }}>{subtext}</p>}
            <ul className="contact-section__detail-list">
              {email && (
                <li className="contact-section__detail">
                  <div className="contact-section__detail-icon">
                    <SectionIcon name="mail" />
                  </div>
                  <a href={`mailto:${email}`} className="contact-section__detail-value">
                    {email}
                  </a>
                </li>
              )}
              {phone && (
                <li className="contact-section__detail">
                  <div className="contact-section__detail-icon">
                    <SectionIcon name="phone" />
                  </div>
                  <a href={`tel:${phone}`} className="contact-section__detail-value">
                    {phone}
                  </a>
                </li>
              )}
            </ul>
          </div>

          {showForm && (
            <form className="contact-section__form" onSubmit={handleSubmit} noValidate>
              <div className="contact-form__group">
                <label className="contact-form__label" htmlFor="cs-name">Name</label>
                <input
                  id="cs-name"
                  name="name"
                  type="text"
                  className="contact-form__input"
                  placeholder="Your name"
                  value={form.name}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="contact-form__group">
                <label className="contact-form__label" htmlFor="cs-contact">Email or Phone</label>
                <input
                  id="cs-contact"
                  name="contact"
                  type="text"
                  className="contact-form__input"
                  placeholder="How to reach you"
                  value={form.contact}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="contact-form__group">
                <label className="contact-form__label" htmlFor="cs-msg">Message</label>
                <textarea
                  id="cs-msg"
                  name="message"
                  className="contact-form__textarea"
                  placeholder="Tell us about your business..."
                  value={form.message}
                  onChange={handleChange}
                  required
                />
              </div>
              <button type="submit" className="contact-form__submit">
                Send Message
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  )
}
