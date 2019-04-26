import { useContext } from 'react'
import QueryContext from '../components/QueryContext'

const useSelectedFilters = facets => {
  const { query } = useContext(QueryContext)

  const queryValues = query
    .toLowerCase()
    .split('/')
    .map(decodeURIComponent)

  return facets.map(facet => ({
    ...facet,
    selected: queryValues.includes(
      decodeURIComponent(facet.value).toLowerCase()
    ),
  }))
}

export default useSelectedFilters
