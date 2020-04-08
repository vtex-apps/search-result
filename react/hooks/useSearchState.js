import { useSearchPage } from 'vtex.search-page-context/SearchPageContext'
import { path } from 'ramda'

const useSearchState = () => {
  const { searchQuery } = useSearchPage()

  return {
    fuzzy: path(['data', 'productSearch', 'fuzzy'], searchQuery),
    operator: path(['data', 'productSearch', 'operator'], searchQuery),
    searchState: path(['data', 'productSearch', 'searchState'], searchQuery),
  }
}

export default useSearchState
