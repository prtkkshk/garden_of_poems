const ADMIN_KEY = 'cg_admin'
const CORRECT_PASSWORD = process.env.NEXT_PUBLIC_ADMIN_PASSWORD || 'ady_pepper$25'

export function checkPassword(password: string): boolean {
  return password === CORRECT_PASSWORD
}

export function setAdminSession(): void {
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem(ADMIN_KEY, 'true')
    } catch (e) {
      console.error('Failed to set admin session:', e)
    }
  }
}

export function clearAdminSession(): void {
  if (typeof window !== 'undefined') {
    try {
      localStorage.removeItem(ADMIN_KEY)
    } catch (e) {
      console.error('Failed to clear admin session:', e)
    }
  }
}

export function isAdminSession(): boolean {
  if (typeof window === 'undefined') return false
  try {
    return localStorage.getItem(ADMIN_KEY) === 'true'
  } catch (e) {
    console.error('Failed to get admin session:', e)
    return false
  }
}
