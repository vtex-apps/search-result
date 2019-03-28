import { useContext } from 'react'

import QueryContext from '../components/QueryContext'

const useSelectedFacet = facet => {
  const { query, map } = useContext(QueryContext)

  return query.split('/').indexOf(facet.Name) !== -1
}

export default useSelectedFacet
