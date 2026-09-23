interface apiProps {
  endpoint: string
  option?: RequestInit
}

const BASE_URL = 'http://localhost:5000/api'

let isRefreshing = false
let failedQueue: Array<{
  resolve: (value?: any) => void
  reject: (reason?: any) => void
}> = []

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error)
    } else {
      prom.resolve(token)
    }
  })
  failedQueue = []
}

export const API = async ({ endpoint, option = {} }: apiProps) => {
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
    cache: 'no-store'
  }

  try {
    const res = await fetch(`${BASE_URL}${endpoint}`, config)

    if (res.status === 401 && endpoint !== '/auth/refresh-token' && endpoint !== '/auth/signin') {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject })
        })
          .then(async (newToken) => {
            const retryHeaders: HeadersInit = {
              ...defaultHeaders,
              Authorization: `Bearer ${newToken}`,
            }
            const retryRes = await fetch(`${BASE_URL}${endpoint}`, {
              ...config,
              headers: retryHeaders,
            })
            const retryData = await retryRes.json()
            if (!retryRes.ok) throw new Error(retryData?.message || 'Request failed')
            return retryData
          })
          .catch((err) => {
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

        const refreshData = await refreshRes.json()

        if (!refreshRes.ok) {
          throw new Error(refreshData?.message || 'Session expired')
        }

        const newAccessToken =
          refreshData?.result?.accessToken ||
          refreshData?.result?.token ||
          refreshData?.result ||
          refreshData?.data?.accessToken ||
          refreshData?.accessToken ||
          refreshData?.data?.token ||
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

        const retryData = await retryRes.json()

        if (!retryRes.ok) {
          throw new Error(retryData?.message || 'Request failed after refresh')
        }

        return retryData
      } catch (refreshError) {
        processQueue(refreshError, null)

        if (typeof window !== 'undefined') {
          localStorage.removeItem('token')
          window.location.href = '/signin'
        }

        throw refreshError
      } finally {
        isRefreshing = false
      }
    }

    const data = await res.json()

    if (!res.ok) {
      console.log(data?.message)
      throw new Error(data?.message || 'Something went wrong')
    }

    return data
  } catch (error) {
    throw error
  }
}