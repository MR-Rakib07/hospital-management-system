interface ApiProps {
  endpoint: string
  option?: RequestInit
}

interface ApiResponse {
  message?: string
  result?:
    | {
        accessToken?: string
        token?: string
      }
    | string
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

const RAW_BASE_URL = process.env.NEXT_PUBLIC_API_URL
if (!RAW_BASE_URL) {
  throw new Error("NEXT_PUBLIC_API_URL environment variable is not defined")
}
const BASE_URL = RAW_BASE_URL.replace(/\/+$/, "")

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

const safeParseJson = async <R>(res: Response): Promise<R | null> => {
  try {
    return (await res.json()) as R
  } catch {
    return null
  }
}

export const API = async <T = Record<string, string>>({
  endpoint,
  option = {},
}: ApiProps): Promise<T> => {
  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null

  const cleanEndpoint = endpoint.startsWith("/") ? endpoint : `/${endpoint}`
  const targetUrl = `${BASE_URL}${cleanEndpoint}`

  const defaultHeaders: Record<string, string> = {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...((option.headers as Record<string, string>) || {}),
  }

  const config: RequestInit = {
    ...option,
    headers: defaultHeaders,
    credentials: "include",
    cache: "no-store",
  }

  try {
    const res = await fetch(targetUrl, config)

    const isAuthRequest =
      endpoint.includes("signin") ||
      endpoint.includes("signup") ||
      endpoint.includes("refresh-token")

    if (res.status === 401 && !isAuthRequest) {
      if (!token) {
        const guestData = await safeParseJson<ApiResponse & T>(res)
        throw new Error(guestData?.message || "Unauthorized access")
      }

      if (isRefreshing) {
        return new Promise<string>((resolve, reject) => {
          failedQueue.push({ resolve, reject })
        }).then(async (newToken: string): Promise<T> => {
          const retryHeaders: HeadersInit = {
            ...defaultHeaders,
            Authorization: `Bearer ${newToken}`,
          }
          const retryRes = await fetch(targetUrl, {
            ...config,
            headers: retryHeaders,
          })
          const retryData = await safeParseJson<ApiResponse & T>(retryRes)
          if (!retryRes.ok) {
            throw new Error(retryData?.message || "Request failed")
          }
          return (retryData || {}) as T
        })
      }

      isRefreshing = true

      try {
        const refreshRes = await fetch(`${BASE_URL}/auth/refresh-token`, {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
        })

        const refreshData = await safeParseJson<ApiResponse>(refreshRes)

        if (!refreshRes.ok) {
          throw new Error(refreshData?.message || "Session expired")
        }

        const rawResult = refreshData?.result
        const tokenFromResult =
          typeof rawResult === "string"
            ? rawResult
            : rawResult?.accessToken || rawResult?.token

        const newAccessToken =
          tokenFromResult ||
          refreshData?.data?.accessToken ||
          refreshData?.data?.token ||
          refreshData?.accessToken ||
          refreshData?.token

        if (!newAccessToken) {
          throw new Error("New access token not received")
        }

        if (typeof window !== "undefined") {
          localStorage.setItem("token", newAccessToken)
        }

        processQueue(null, newAccessToken)

        const retryHeaders: HeadersInit = {
          ...defaultHeaders,
          Authorization: `Bearer ${newAccessToken}`,
        }

        const retryRes = await fetch(targetUrl, {
          ...config,
          headers: retryHeaders,
        })

        const retryData = await safeParseJson<ApiResponse & T>(retryRes)

        if (!retryRes.ok) {
          throw new Error(retryData?.message || "Request failed after refresh")
        }

        return (retryData || {}) as T
      } catch (refreshErr) {
        const normalizedError =
          refreshErr instanceof Error ? refreshErr : new Error(String(refreshErr))

        processQueue(normalizedError, null)

        if (typeof window !== "undefined") {
          localStorage.removeItem("token")
          const publicPaths = ["/", "/appointment", "/doctors", "/signin", "/signup"]
          const currentPath = window.location.pathname

          const isPublicPage = publicPaths.some(
            (path) => currentPath === path || currentPath.startsWith("/appointment")
          )

          if (!isPublicPage) {
            window.location.href = "/signin"
          }
        }

        throw normalizedError
      } finally {
        isRefreshing = false
      }
    }

    const data = await safeParseJson<ApiResponse & T>(res)

    if (!res.ok) {
      throw new Error(data?.message || `HTTP ${res.status}: Request failed`)
    }

    return (data || {}) as T
  } catch (error) {
    if (error instanceof Error) {
      throw error
    }
    throw new Error(String(error))
  }
}