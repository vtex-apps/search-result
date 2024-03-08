type SponsoredProductsBehavior = 'skip' | 'sync' | 'async'

type Settings = {
  fetchSponsoredProductsOnSearch: boolean
} & Record<string, unknown>

/**
 * This function checks the store's settings, as well as the passed value of
 * `sponsoredProductsBehavior` passed in the store-theme, to determine if the
 * sponsored products request should be skipped or not.
 * Some accounts may not have configured the store's settings, so we need to check if the
 * `sponsoredProductsBehavior` parameter for compatibility.
 */
const shouldSkipSponsoredProducts = (
  sponsoredProductsBehavior: SponsoredProductsBehavior,
  settings: Settings
) => {
  const fetchSponsoredProductsConfig = settings?.fetchSponsoredProductsOnSearch

  return (
    (!fetchSponsoredProductsConfig && sponsoredProductsBehavior === 'skip') ||
    sponsoredProductsBehavior === 'sync'
  )
}

export default shouldSkipSponsoredProducts
