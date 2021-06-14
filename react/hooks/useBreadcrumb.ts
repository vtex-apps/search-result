import { useSearchPage } from 'vtex.search-page-context/SearchPageContext'

export interface Breadcrumb {
  name: string
}

export function useBreadcrumb(): Breadcrumb[] | null | undefined {
  const { searchQuery } = useSearchPage()

  return (
    searchQuery?.data?.productSearch?.breadcrumb ||
    searchQuery?.data?.facets?.breadcrumb
  )
}
