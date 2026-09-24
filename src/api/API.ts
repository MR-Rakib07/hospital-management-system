interface ApiProps {
  endpoint: string
  option?: RequestInit
}

interface ApiResponse {
  message?: string
  result?: {
    accessToken?: string
    token?: string
  } | string
  data?: {
    accessToken?: string
    token?: string
  }
  accessToken?: string
  token?: string
}

interface QueueItem {
  resolve: (value: string) => void
  reject: (reason: Error) => void
}

const BASE_URL = 'http://localhost:5000/api'

let isRefreshing = false
let failedQueue: QueueItem[] = []

const processQueue = (error: Error | null, token: string | null = null): void => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error)
    } else if (token) {
      prom.resolve(token)
    }
  })
  failedQueue = []
}

export const API = async <T = Record<string, string>>({
  endpoint,
  option = {},
}: ApiProps): Promise<T> => {
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null

  const defaultHeaders: HeadersInit = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(option.headers || {}),
  }

  const config: RequestInit = {
    ...option,
    headers: defaultHeaders,
    credentials: 'include',
    cache: 'no-store',
  }

  try {
    const res = await fetch(`${BASE_URL}${endpoint}`, config)

    const isAuthRequest =
      endpoint.includes('signin') ||
      endpoint.includes('login') ||
      endpoint.includes('signup') ||
      endpoint.includes('refresh-token')

    if (res.status === 401 && !isAuthRequest) {
      if (isRefreshing) {
        return new Promise<string>((resolve, reject) => {
          failedQueue.push({ resolve, reject })
        })
          .then(async (newToken: string): Promise<T> => {
            const retryHeaders: HeadersInit = {
              ...defaultHeaders,
              Authorization: `Bearer ${newToken}`,
            }
            const retryRes = await fetch(`${BASE_URL}${endpoint}`, {
              ...config,
              headers: retryHeaders,
            })
            const retryData = (await retryRes.json()) as ApiResponse & T
            if (!retryRes.ok) {
              throw new Error(retryData?.message || 'Request failed')
            }
            return retryData
          })
          .catch((err: Error) => {
            throw err
          })
      }

      isRefreshing = true

      try {
        const refreshRes = await fetch(`${BASE_URL}/auth/refresh-token`, {
          method: 'POST',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          },
        })

        const refreshData = (await refreshRes.json()) as ApiResponse

        if (!refreshRes.ok) {
          throw new Error(refreshData?.message || 'Session expired')
        }

        const rawResult = refreshData?.result
        const tokenFromResult =
          typeof rawResult === 'string'
            ? rawResult
            : rawResult?.accessToken || rawResult?.token

        const newAccessToken =
          tokenFromResult ||
          refreshData?.data?.accessToken ||
          refreshData?.data?.token ||
          refreshData?.accessToken ||
          refreshData?.token

        if (!newAccessToken) {
          throw new Error('New access token not received')
        }

        if (typeof window !== 'undefined') {
          localStorage.setItem('token', newAccessToken)
        }

        processQueue(null, newAccessToken)

        const retryHeaders: HeadersInit = {
          ...defaultHeaders,
          Authorization: `Bearer ${newAccessToken}`,
        }

        const retryRes = await fetch(`${BASE_URL}${endpoint}`, {
          ...config,
          headers: retryHeaders,
        })

        const retryData = (await retryRes.json()) as ApiResponse & T

        if (!retryRes.ok) {
          throw new Error(retryData?.message || 'Request failed after refresh')
        }

        return retryData
      } catch (refreshErr) {
        const normalizedError =
          refreshErr instanceof Error ? refreshErr : new Error(String(refreshErr))

        processQueue(normalizedError, null)

        if (typeof window !== 'undefined') {
          localStorage.removeItem('token')
          if (!window.location.pathname.includes('/signin')) {
            window.location.href = '/signin'
          }
        }

        throw normalizedError
      } finally {
        isRefreshing = false
      }
    }

    const data = (await res.json()) as ApiResponse & T

    if (!res.ok) {
      console.log(data?.message)
      throw new Error(data?.message || 'Something went wrong')
    }

    return data
  } catch (error) {
    if (error instanceof Error) {
      throw error
    }
    throw new Error(String(error))
  }
}