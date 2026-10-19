export function getProjectCategory(project) {
  const combined =
    `${project.type || ''} ${project.name || ''} ${project.configuration || ''}`.toLowerCase()
  if (combined.includes('villa') || combined.includes('bungalow')) return 'Villas'
  if (combined.includes('apartment') || combined.includes('flat')) return 'Apartments'
  if (combined.includes('plot') || combined.includes('land')) return 'Plots'
  return 'Residences'
}
