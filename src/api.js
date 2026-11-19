async function request(url, options) {
  const res = await fetch(url, { headers: { 'Content-Type': 'application/json' }, ...options })
  if (res.status === 204) return null
  const data = await res.json()
  if (!res.ok) throw new Error(data.code || 'unknown')
  return data
}

export const getLinks = () => request('/api/links')
export const createLink = (body) => request('/api/links', { method: 'POST', body: JSON.stringify(body) })
export const deleteLink = (id) => request(`/api/links/${id}`, { method: 'DELETE' })
