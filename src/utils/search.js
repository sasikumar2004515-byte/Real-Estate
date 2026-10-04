import { faqs, locations, navigation, projects } from '../data/site'

/**
 * Site search index - built once from the same data the pages use,
 * so search results are always in sync with the website content.
 */

const extraPages = [
  { label: 'Privacy Policy', path: '/privacy', keywords: 'privacy data cookies legal' },
  { label: 'Terms of Use', path: '/terms', keywords: 'terms conditions legal' }
]

const pageKeywords = {
  '/': 'home start main premium homes chennai',
  '/about': 'about us company story mission vision values team quality',
  '/projects': 'projects villas apartments plots upcoming ongoing completed properties',
  '/locations': 'locations ecr omr anna nagar velachery tambaram schools hospitals transport map',
  '/gallery': 'gallery photos images video film tour interiors exteriors',
  '/contact': 'contact enquiry enquire call phone whatsapp email address site visit office map',
  '/faq': 'faq questions answers help booking brochure amenities'
}

function buildIndex() {
  const items = []

  projects.forEach((project) => {
    items.push({
      type: 'Project',
      title: project.name,
      subtitle: `${project.type} · ${project.location} · ${project.status}`,
      path: `/projects/${project.id}`,
      image: project.image,
      haystack: [
        project.name,
        project.location,
        project.type,
        project.status,
        project.configuration,
        project.area,
        project.description,
        ...(project.highlights || [])
      ]
        .join(' ')
        .toLowerCase(),
      weight: 3
    })
  })

  locations.forEach((location) => {
    items.push({
      type: 'Location',
      title: location.name,
      subtitle: (location.highlights || []).slice(0, 3).join(' · '),
      path: '/locations',
      image: location.image,
      haystack: [location.name, location.description, ...(location.highlights || [])]
        .join(' ')
        .toLowerCase(),
      weight: 2
    })
  })

  navigation.concat(extraPages.map((page) => ({ label: page.label, path: page.path }))).forEach((page) => {
    const extra = extraPages.find((entry) => entry.path === page.path)?.keywords || ''
    items.push({
      type: 'Page',
      title: page.label,
      subtitle: page.path === '/' ? 'Go to the home page' : `Open ${page.label}`,
      path: page.path,
      haystack: `${page.label} ${pageKeywords[page.path] || ''} ${extra}`.toLowerCase(),
      weight: 2
    })
  })

  faqs.forEach((faq) => {
    items.push({
      type: 'FAQ',
      title: faq.question,
      subtitle: faq.category,
      path: '/faq',
      haystack: `${faq.question} ${faq.answer} ${faq.category}`.toLowerCase(),
      weight: 1
    })
  })

  return items
}

const index = buildIndex()

export const popularSearches = ['Villas', 'Apartments', 'ECR', 'OMR', 'Site visit', 'Brochure']

/** Returns results grouped by type, best matches first. */
export function searchSite(query) {
  const tokens = query.toLowerCase().trim().split(/\s+/).filter(Boolean)
  if (tokens.length === 0) return []

  const scored = []

  index.forEach((item) => {
    let score = 0
    let matchedAll = true

    for (const token of tokens) {
      if (item.title.toLowerCase().startsWith(token)) score += 10
      else if (item.title.toLowerCase().includes(token)) score += 6
      else if (item.haystack.includes(token)) score += 2
      else {
        matchedAll = false
        break
      }
    }

    if (matchedAll) scored.push({ item, score: score * item.weight })
  })

  scored.sort((a, b) => b.score - a.score)

  const limits = { Project: 6, Location: 4, Page: 4, FAQ: 4 }
  const counts = {}
  const groups = {}

  scored.forEach(({ item }) => {
    counts[item.type] = (counts[item.type] || 0) + 1
    if (counts[item.type] > limits[item.type]) return
    ;(groups[item.type] ||= []).push(item)
  })

  return ['Project', 'Location', 'Page', 'FAQ']
    .filter((type) => groups[type])
    .map((type) => ({ type, items: groups[type] }))
}
