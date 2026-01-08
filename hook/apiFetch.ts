import { AlertNotification } from "@/lib/alert"
import { getToken } from "@/lib/cookie"

export async function apiFetch<T>(
  url: RequestInfo,
  init: RequestInit = {}
): Promise<T> {
  const token =
    typeof window !== "undefined"
      ? getToken()
      : null

  const headers = new Headers(init.headers || {})

  if (
    init.body &&
    typeof init.body === "object" &&
    !(init.body instanceof FormData)
  ) {
    headers.set("Content-Type", "application/json")
    init.body = JSON.stringify(init.body)
  }

  if (token) {
    headers.set("Authorization", token)
  }

  const response = await fetch(url, {
    ...init,
    headers,
  })

  if (!response.ok) {
    let errorMessage = `API error: ${response.status}`

    try {
      const errorData = await response.json()
      if (errorData?.message) {
        errorMessage = errorData.message
      }
    } catch {}

    if (response.status === 401 || response.status === 403) {
      if (typeof window !== "undefined") {
        AlertNotification("Login Ulang", "Session telah habis, silakan login ulang", "info", 2000,
        true)


        localStorage.removeItem("token")
        document.cookie =
          "token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT;"
        window.location.href = "/login"
      }
    }

    throw new Error(errorMessage)
  }

  return response.json() as Promise<T>
}
