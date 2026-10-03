import { useMemo } from 'react'

/**
 * MapEmbed - lazy OpenStreetMap iframe (no API key needed).
 */
function MapEmbed({ lat, lng, zoom = 13, title = 'Map', className = '' }) {
  const src = useMemo(() => {
    const span = 0.35 / Math.pow(2, Math.max(zoom - 11, 0))
    const bbox = [lng - span, lat - span * 0.6, lng + span, lat + span * 0.6].join('%2C')
    return `https://www.openstreetmap.org/export/embed.html?bbox=${bbox}&layer=mapnik&marker=${lat}%2C${lng}`
  }, [lat, lng, zoom])

  return (
    <div className={`map-embed ${className}`}>
      <iframe
        key={src}
        title={title}
        src={src}
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
      />
    </div>
  )
}

export default MapEmbed
