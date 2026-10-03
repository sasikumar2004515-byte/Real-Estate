export const projectFilters = {
  status: [
    'All',
    'Upcoming',
    'Ongoing',
    'Completed'
  ],

  type: [
    'All',
    'Villas',
    'Apartments',
    'Plots'
  ]
}

export function getProjectCategory(project) {
  if (project.category) {
    return project.category
  }

  if (project.type) {
    return project.type
  }

  return 'Other'
}

export function matchesProjectFilters(
  project,
  statusFilter,
  typeFilter
) {
  const projectCategory = getProjectCategory(project)

  const statusMatch =
    statusFilter === 'All' ||
    project.status === statusFilter ||
    (
      statusFilter === 'Completed' &&
      project.status === 'Ready to Move'
    )

  const typeMatch =
    typeFilter === 'All' ||
    projectCategory === typeFilter ||
    project.type === typeFilter

  return statusMatch && typeMatch
}