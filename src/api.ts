const API_BASE = ''

export class ApiUnauthorized extends Error {
  constructor() {
    super('Unauthorized')
    this.name = 'ApiUnauthorized'
  }
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
    throw new ApiUnauthorized()
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
    throw new ApiUnauthorized()
  }
  if (!res.ok) throw new Error(`PUT /api/state failed: ${res.status}`)
}
