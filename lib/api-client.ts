/**
 * Centralized API client for all server-side API calls
 * Handles:
 * - Consistent error handling
 * - Request/response typing
 * - JSON parsing
 * - Error messages
 */

export interface ApiResponse<T> {
  data?: T
  error?: string
  status: number
}

/**
 * Generic API call wrapper
 */
export async function apiCall<T = unknown>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  try {
    const response = await fetch(endpoint, {
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
      ...options,
    })

    const status = response.status

    if (!response.ok) {
      try {
        const error = await response.json()
        return {
          error: error.error || `HTTP ${status}`,
          status,
        }
      } catch {
        return {
          error: `HTTP ${status}: ${response.statusText}`,
          status,
        }
      }
    }

    const data = await response.json()
    return { data, status }
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error"
    return { error: message, status: 0 }
  }
}

/**
 * GET request
 */
export function apiGet<T = unknown>(endpoint: string) {
  return apiCall<T>(endpoint, { method: "GET" })
}

/**
 * POST request
 */
export function apiPost<T = unknown>(endpoint: string, body?: unknown) {
  return apiCall<T>(endpoint, {
    method: "POST",
    body: body ? JSON.stringify(body) : undefined,
  })
}

/**
 * PATCH request
 */
export function apiPatch<T = unknown>(endpoint: string, body?: unknown) {
  return apiCall<T>(endpoint, {
    method: "PATCH",
    body: body ? JSON.stringify(body) : undefined,
  })
}

/**
 * DELETE request
 */
export function apiDelete<T = unknown>(endpoint: string) {
  return apiCall<T>(endpoint, { method: "DELETE" })
}

/**
 * Handle API errors in a consistent way
 */
export function getErrorMessage(error?: string): string {
  if (!error) return "Something went wrong"
  
  const errorMap: Record<string, string> = {
    UNAUTHORIZED: "You are not authorized to perform this action",
    ONLY_VOLUNTEER: "This action is only available for volunteers",
    ONLY_NGO: "This action is only available for NGOs",
    USER_NOT_FOUND: "User profile not found",
    JOB_UNAVAILABLE: "This job is no longer available",
    LIMIT_REACHED: "You have reached your quota limit",
    INVALID_BODY: "Invalid request data",
    INVALID_SIGNATURE: "Payment verification failed",
    INVALID_PLAN: "Invalid plan selected",
  }

  return errorMap[error] || error
}
