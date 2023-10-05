/* eslint-disable no-restricted-globals */
import { useMemo } from 'react'
import { useRuntime, canUseDOM } from 'vtex.render-runtime'

import useDataPixel from './useDataPixel'

interface UsePageViewArgs {
  title?: string
  cacheKey?: string
  skip?: boolean
}

export const usePageView = ({
  title,
  cacheKey,
  skip,
}: UsePageViewArgs = {}) => {
  const { route, account } = useRuntime()
  const pixelCacheKey = cacheKey ?? route.routeId

  const eventData = useMemo(() => {
    if (!canUseDOM || skip) {
      return null
    }

    return {
      event: 'pageView',
      pageTitle: title ?? document.title,
      pageUrl: location.href,
      referrer:
        document.referrer.indexOf(location.origin) === 0
          ? undefined
          : document.referrer,
      accountName: account,
      routeId: route?.routeId ? route.routeId : '',
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [account, title, canUseDOM, pixelCacheKey])

  useDataPixel(skip ? null : eventData, pixelCacheKey)
}
