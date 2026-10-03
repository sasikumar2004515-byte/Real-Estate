import LegalPage from './LegalPage'
import { site } from '../data/site'

function Terms() {
  return (
    <LegalPage
      path="/terms"
      title="Terms of Use"
      updated="October 2026"
      intro={`By using the ${site.brand} website you agree to these terms. Please review and adapt this text with your legal advisor before launch.`}
      sections={[
        {
          heading: 'Information accuracy',
          body: [
            'Project details, images, floor plans, prices and availability are indicative and may change without notice. Images are artistic impressions and may differ from the final product.'
          ]
        },
        {
          heading: 'Not an offer',
          body: [
            'Content on this website is for information only and does not form a legal offer or contract. Bookings are confirmed only through our official documentation.'
          ]
        },
        {
          heading: 'Intellectual property',
          body: [
            `Text, images, logos and design on this website belong to ${site.brand} or its licensors and may not be copied or reused without written permission.`
          ]
        },
        {
          heading: 'Enquiries and communication',
          body: [
            'By submitting an enquiry you agree that our team may contact you by phone, email or WhatsApp regarding your request.'
          ]
        },
        {
          heading: 'External links',
          body: ['We are not responsible for the content of third-party websites linked from this site.']
        },
        {
          heading: 'Contact',
          body: [`Questions about these terms: ${site.email}.`]
        }
      ]}
    />
  )
}

export default Terms
