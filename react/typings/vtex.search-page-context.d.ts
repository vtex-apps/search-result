declare module 'vtex.search-page-context/SearchPageContext' {
  type DispatchFunction = (payload: {
    type: string
    args?: Record<string, unknown>
  }) => void

  export const useSearchPage: () => any
  export const useSearchPageState: () => SearchPageState
  export const useSearchPageStateDispatch: () => DispatchFunction

  export interface SearchPageState {
    galleryLayout?: string
    searchQuery: any
  }
}
