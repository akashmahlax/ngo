import { 
  fallbackVolunteerOpportunities,
  fallbackTopVolunteers,
  fallbackFeaturedNGOs,
  fallbackStats
} from './fallback-data'

/**
 * Fetch recent volunteer opportunities with fallback
 * In production, this will fetch from your API
 */
export async function getRecentOpportunities(limit: number = 4) {
  try {
    // Try to fetch from API
    const response = await fetch('/api/jobs/recent?limit=' + limit, {
      next: { revalidate: 300 } // Revalidate every 5 minutes
    })
    
    if (!response.ok) {
      throw new Error('Failed to fetch opportunities')
    }
    
    const data = await response.json()
    return data.jobs || fallbackVolunteerOpportunities.slice(0, limit)
  } catch (error) {
    console.warn('Using fallback data for opportunities:', error)
    return fallbackVolunteerOpportunities.slice(0, limit)
  }
}

/**
 * Fetch top volunteers with fallback
 */
export async function getTopVolunteers(limit: number = 4) {
  try {
    const response = await fetch('/api/volunteers/top?limit=' + limit, {
      next: { revalidate: 600 } // Revalidate every 10 minutes
    })
    
    if (!response.ok) {
      throw new Error('Failed to fetch top volunteers')
    }
    
    const data = await response.json()
    return data.volunteers || fallbackTopVolunteers.slice(0, limit)
  } catch (error) {
    console.warn('Using fallback data for top volunteers:', error)
    return fallbackTopVolunteers.slice(0, limit)
  }
}

/**
 * Fetch featured NGOs with fallback
 */
export async function getFeaturedNGOs(limit: number = 4) {
  try {
    const response = await fetch('/api/ngos/featured?limit=' + limit, {
      next: { revalidate: 600 } // Revalidate every 10 minutes
    })
    
    if (!response.ok) {
      throw new Error('Failed to fetch featured NGOs')
    }
    
    const data = await response.json()
    return data.ngos || fallbackFeaturedNGOs.slice(0, limit)
  } catch (error) {
    console.warn('Using fallback data for NGOs:', error)
    return fallbackFeaturedNGOs.slice(0, limit)
  }
}

/**
 * Fetch platform stats with fallback
 */
export async function getPlatformStats() {
  try {
    const response = await fetch('/api/stats', {
      next: { revalidate: 3600 } // Revalidate every hour
    })
    
    if (!response.ok) {
      throw new Error('Failed to fetch stats')
    }
    
    const data = await response.json()
    return data.stats || fallbackStats
  } catch (error) {
    console.warn('Using fallback data for stats:', error)
    return fallbackStats
  }
}

/**
 * Client-side data fetching with fallback
 * Use this for client components
 */
export async function fetchWithFallback<T>(
  url: string,
  fallbackData: T,
  options?: RequestInit
): Promise<T> {
  try {
    const response = await fetch(url, options)
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    
    const data = await response.json()
    return data as T
  } catch (error) {
    console.warn(`Failed to fetch ${url}, using fallback data:`, error)
    return fallbackData
  }
}
