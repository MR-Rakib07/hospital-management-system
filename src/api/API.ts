interface ApiProps {
  endpoint: string
  option?: RequestInit
  _isRetry?: boolean
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

const BASE_URL = process.env.NEXT_PUBLIC_API_URL

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

export const API = async <T = Record<string, any>>({
  endpoint,
  option = {},
  _isRetry = false,
}: ApiProps): Promise<T> => {
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null

  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(option.headers || {}),
  }

  const config: RequestInit = {
    ...option,
    headers,
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

    if (res.status === 401 && !isAuthRequest && !_isRetry) {
      if (isRefreshing) {
        return new Promise<string>((resolve, reject) => {
          failedQueue.push({ resolve, reject })
        }).then((newToken: string) => {
          return API<T>({
            endpoint,
            option: {
              ...option,
              headers: {
                ...option.headers,
                Authorization: `Bearer ${newToken}`,
              },
            },
            _isRetry: true,
          })
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

        return API<T>({
          endpoint,
          option: {
            ...option,
            headers: {
              ...option.headers,
              Authorization: `Bearer ${newAccessToken}`,
            },
          },
          _isRetry: true,
        })
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