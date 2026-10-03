import { Helmet } from 'react-helmet-async'
import { site } from '../data/site'

/**
 * Seo - per-page title, description, canonical and Open Graph tags.
 */
function Seo({
  title,
  description,
  image = '/images/projects/serenity-villas.webp',
  path = ''
}) {
  const fullTitle = title ? `${title} | ${site.brand}` : `${site.brand} | ${site.tagline}`
  const url = `${site.url}${path || (typeof window !== 'undefined' ? window.location.pathname : '')}`
  const imageUrl = image.startsWith('http') ? image : `${site.url}${image}`

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={url} />

      <meta property="og:type" content="website" />
      <meta property="og:site_name" content={site.brand} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={url} />
      <meta property="og:image" content={imageUrl} />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={imageUrl} />
    </Helmet>
  )
}

export default Seo
