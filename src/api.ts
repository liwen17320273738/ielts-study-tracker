const API_BASE = ''

export async function fetchState(): Promise<Record<string, any>> {
  const res = await fetch(`${API_BASE}/api/state`, { credentials: 'include' })
  if (res.status === 401) {
    window.location.href = '/'
    throw new Error('Unauthorized')
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
    window.location.href = '/'
    return
  }
  if (!res.ok) throw new Error(`PUT /api/state failed: ${res.status}`)
}
