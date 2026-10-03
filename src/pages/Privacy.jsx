import LegalPage from './LegalPage'
import { site } from '../data/site'

function Privacy() {
  return (
    <LegalPage
      path="/privacy"
      title="Privacy Policy"
      updated="October 2026"
      intro={`${site.brand} respects your privacy. This page explains what information we collect through this website and how we use it. Please review and adapt this text with your legal advisor before launch.`}
      sections={[
        {
          heading: 'Information we collect',
          body: [
            'When you submit the enquiry form we collect the details you provide: name, phone number, email address, interested project and your message.',
            'If you accept cookies we may collect anonymous usage data such as pages visited and device type to improve the website.'
          ]
        },
        {
          heading: 'How we use your information',
          body: [
            'We use your details only to respond to your enquiry, arrange site visits and share project information you requested.',
            'We do not sell your personal information to third parties.'
          ]
        },
        {
          heading: 'Cookies and analytics',
          body: [
            'Essential cookies keep the website working. Analytics cookies are loaded only after you choose Accept in the cookie notice. You can decline at any time.'
          ]
        },
        {
          heading: 'Third-party services',
          body: [
            'This website embeds maps from OpenStreetMap and may link to social media platforms. These services have their own privacy policies.'
          ]
        },
        {
          heading: 'Data security and retention',
          body: [
            'The website is served over HTTPS and enquiry details are retained only as long as needed to handle your request.'
          ]
        },
        {
          heading: 'Contact us',
          body: [`For privacy questions, write to ${site.email} or call ${site.phone}.`]
        }
      ]}
    />
  )
}

export default Privacy
