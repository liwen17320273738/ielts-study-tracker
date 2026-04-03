const API_BASE = ''

/** 使用纯对象标记，避免多 chunk / class 压缩导致 instanceof、.code 失效 */
export const TRACKER_UNAUTHORIZED = Object.freeze({
  __trackerUnauthorized: true as const,
})

export function isApiUnauthorized(err: unknown): boolean {
  if (err === TRACKER_UNAUTHORIZED) return true
  if (err instanceof Error && err.message === 'Unauthorized') return true
  if (!err || typeof err !== 'object') return false
  return (err as { __trackerUnauthorized?: boolean }).__trackerUnauthorized === true
}

export async function loginApi(password: string): Promise<boolean> {
  const res = await fetch(`${API_BASE}/api/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ password: password.trim() }),
    credentials: 'include',
  })
  return res.ok
}

export async function fetchState(): Promise<Record<string, any>> {
  const res = await fetch(`${API_BASE}/api/state`, { credentials: 'include' })
  if (res.status === 401) {
    throw TRACKER_UNAUTHORIZED
  }
  if (!res.ok) throw new Error(`GET /api/state failed: ${res.status}`)
  return res.json()
}

export async function saveStateToServer(state: Record<string, any>): Promise<void> {
  const res = await fetch(`${API_BASE}/api/state`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(state),
    credentials: 'include',
  })
  if (res.status === 401) {
    throw TRACKER_UNAUTHORIZED
  }
  if (!res.ok) throw new Error(`PUT /api/state failed: ${res.status}`)
}
