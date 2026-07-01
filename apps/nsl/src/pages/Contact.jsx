import { ContactSection } from '@shared/sections'
import MailingList from '../components/MailingList.jsx'
import { CONTACT_EMAIL } from '../data'

export default function Contact() {
  return (
    <>
      <header className="nsl-intro">
        <div className="nsl-intro__inner">
          <p className="nsl-eyebrow">Contact</p>
          <h1 className="nsl-intro__title">Get in touch</h1>
          <p className="nsl-intro__lead">Questions, collaborations, or want to join? Reach out — we'd love to hear from you.</p>
        </div>
      </header>

      <ContactSection
        eyebrow="Reach the lab"
        headline="Send us a message"
        subtext="Whether you're a prospective member, a collaborator, or press — drop us a line and we'll get back to you."
        email={CONTACT_EMAIL}
        variant="default"
      />

      <section className="nsl-block nsl-block--alt" id="mailing">
        <div className="nsl-block__inner">
          <p className="nsl-eyebrow">Mailing list</p>
          <h2 className="nsl-h2">Join our mailing list</h2>
          <p className="nsl-sub">For NU and NSL community members — meeting times, launch news, and opportunities to get involved.</p>
          <MailingList />
        </div>
      </section>
    </>
  )
}
