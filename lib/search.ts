import {
  fallbackVolunteerOpportunities,
  fallbackTopVolunteers,
  fallbackFeaturedNGOs
} from './fallback-data'

export interface SearchResult {
  id: string
  title: string
  subtitle: string
  description: string
  type: 'job' | 'volunteer' | 'ngo'
  image?: string
  category?: string
  location?: string
  url: string
}

interface Job {
  id: string
  title: string
  ngo: string
  location: string
  category: string
  description: string
  image?: string
}

interface Volunteer {
  name: string
  category: string
  location: string
  quote: string
  image?: string
}

interface NGO {
  id: string
  name: string
  category: string
  location: string
  description: string
  tagline: string
  image?: string
}

/**
 * Search across all platform data (jobs, volunteers, NGOs)
 */
export async function searchPlatform(query: string): Promise<SearchResult[]> {
  if (!query.trim()) return []

  const searchTerm = query.toLowerCase().trim()
  const results: SearchResult[] = []

  // Search jobs
  const jobs = await getAllJobs()
  jobs.forEach((job: Job) => {
    if (
      job.title.toLowerCase().includes(searchTerm) ||
      job.ngo.toLowerCase().includes(searchTerm) ||
      job.category.toLowerCase().includes(searchTerm) ||
      job.location.toLowerCase().includes(searchTerm) ||
      job.description.toLowerCase().includes(searchTerm)
    ) {
      results.push({
        id: job.id,
        title: job.title,
        subtitle: `${job.ngo} • ${job.category}`,
        description: job.description,
        type: 'job',
        image: job.image,
        category: job.category,
        location: job.location,
        url: `/jobs/${job.id}`
      })
    }
  })

  // Search volunteers
  const volunteers = await getAllVolunteers()
  volunteers.forEach((volunteer: Volunteer) => {
    if (
      volunteer.name.toLowerCase().includes(searchTerm) ||
      volunteer.category.toLowerCase().includes(searchTerm) ||
      volunteer.location.toLowerCase().includes(searchTerm) ||
      volunteer.quote.toLowerCase().includes(searchTerm)
    ) {
      results.push({
        id: volunteer.name.toLowerCase().replace(/\s+/g, '-'),
        title: volunteer.name,
        subtitle: `${volunteer.category} • ${volunteer.location}`,
        description: volunteer.quote,
        type: 'volunteer',
        image: volunteer.image,
        category: volunteer.category,
        location: volunteer.location,
        url: `/volunteers/${volunteer.name.toLowerCase().replace(/\s+/g, '-')}`
      })
    }
  })

  // Search NGOs
  const ngos = await getAllNGOs()
  ngos.forEach((ngo: NGO) => {
    if (
      ngo.name.toLowerCase().includes(searchTerm) ||
      ngo.category.toLowerCase().includes(searchTerm) ||
      ngo.location.toLowerCase().includes(searchTerm) ||
      ngo.description.toLowerCase().includes(searchTerm) ||
      ngo.tagline.toLowerCase().includes(searchTerm)
    ) {
      results.push({
        id: ngo.id,
        title: ngo.name,
        subtitle: `${ngo.category} • ${ngo.location}`,
        description: ngo.description,
        type: 'ngo',
        image: ngo.image,
        category: ngo.category,
        location: ngo.location,
        url: `/ngos/${ngo.id}`
      })
    }
  })

  // Sort by relevance (exact matches first, then partial matches)
  return results.sort((a, b) => {
    const aTitle = a.title.toLowerCase()
    const bTitle = b.title.toLowerCase()
    const aDesc = a.description.toLowerCase()
    const bDesc = b.description.toLowerCase()

    // Exact title matches first
    if (aTitle === searchTerm && bTitle !== searchTerm) return -1
    if (bTitle === searchTerm && aTitle !== searchTerm) return 1

    // Title starts with query
    if (aTitle.startsWith(searchTerm) && !bTitle.startsWith(searchTerm)) return -1
    if (bTitle.startsWith(searchTerm) && !aTitle.startsWith(searchTerm)) return 1

    // Description contains query
    if (aDesc.includes(searchTerm) && !bDesc.includes(searchTerm)) return -1
    if (bDesc.includes(searchTerm) && !aDesc.includes(searchTerm)) return 1

    return 0
  }).slice(0, 10) // Limit to 10 results
}

/**
 * Get all jobs (with fallback)
 */
async function getAllJobs(): Promise<Job[]> {
  try {
    const response = await fetch('/api/jobs', {
      next: { revalidate: 300 }
    })
    if (response.ok) {
      const data = await response.json()
      return data.jobs || fallbackVolunteerOpportunities
    }
  } catch (error) {
    console.warn('Using fallback data for jobs search:', error)
  }
  return fallbackVolunteerOpportunities
}

/**
 * Get all volunteers (with fallback)
 */
async function getAllVolunteers(): Promise<Volunteer[]> {
  try {
    const response = await fetch('/api/volunteers', {
      next: { revalidate: 600 }
    })
    if (response.ok) {
      const data = await response.json()
      return data.volunteers || fallbackTopVolunteers
    }
  } catch (error) {
    console.warn('Using fallback data for volunteers search:', error)
  }
  return fallbackTopVolunteers
}

/**
 * Get all NGOs (with fallback)
 */
async function getAllNGOs(): Promise<NGO[]> {
  try {
    const response = await fetch('/api/ngos', {
      next: { revalidate: 600 }
    })
    if (response.ok) {
      const data = await response.json()
      return data.ngos || fallbackFeaturedNGOs
    }
  } catch (error) {
    console.warn('Using fallback data for NGOs search:', error)
  }
  return fallbackFeaturedNGOs
}