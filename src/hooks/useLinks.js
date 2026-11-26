import { useCallback, useEffect, useState } from 'react'
import { getLinks, createLink, deleteLink } from '../api.js'

// Список посилань + створення/видалення. Підключимо, коли будемо наповнювати Home і Links.
export default function useLinks() {
  const [links, setLinks] = useState([])
  const [loadFailed, setLoadFailed] = useState(false)

  useEffect(() => {
    getLinks().then(setLinks).catch(() => setLoadFailed(true))
  }, [])

  const create = useCallback(async (body) => {
    const link = await createLink(body)
    setLinks((prev) => [link, ...prev])
    return link
  }, [])

  const remove = useCallback(async (link) => {
    await deleteLink(link.id)
    setLinks((prev) => prev.filter((x) => x.id !== link.id))
  }, [])

  return { links, loadFailed, create, remove }
}
