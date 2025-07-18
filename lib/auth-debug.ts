// Debug utility to help with multi-user testing
export function getSessionDebugInfo() {
  if (typeof window !== "undefined") {
    return {
      userAgent: navigator.userAgent,
      cookieCount: document.cookie.split(";").length,
      sessionStorage: Object.keys(sessionStorage).length,
      localStorage: Object.keys(localStorage).length,
      timestamp: new Date().toISOString(),
    }
  }
  return null
}

export function clearAllSessions() {
  if (typeof window !== "undefined") {
    // Clear all cookies
    document.cookie.split(";").forEach((c) => {
      document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/")
    })

    // Clear storage
    sessionStorage.clear()
    localStorage.clear()

    console.log("All sessions cleared")
  }
}
