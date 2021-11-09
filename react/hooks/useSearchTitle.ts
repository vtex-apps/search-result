import { useContext, useMemo } from 'react'

// This is here so this JS file can be imported
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import QueryContext from '../components/QueryContext'
import type { Breadcrumb } from './useBreadcrumb'

interface UseSearchTitleOptions {
  matchFt?: boolean
  fallbackToLastName?: boolean
}

function getLastName(breadcrumbs: Breadcrumb[]) {
  if (breadcrumbs.length === 0) {
    return undefined
  }

  return breadcrumbs[breadcrumbs.length - 1]?.name
}

function breadcrumbName(
  index: number,
  breadcrumbs: Breadcrumb[]
): string | undefined {
  return breadcrumbs[index]?.name
}

function isBrandPage(mapArray: string[]) {
  return mapArray[0] === 'b'
}

function findLastCategory(mapArray: string[]) {
  // .reverse() mutates the array. We don't want to do that with the original array
  const index = [...mapArray].reverse().findIndex(
    // traditional mapping for category (c)
    // or compatibility with VTEX IS approach (category-)
    (mapItem) => mapItem === 'c' || mapItem.startsWith('category-')
  )

  if (index === -1) {
    return index
  }

  // reverses the index back to normal
  return mapArray.length - 1 - index
}

const getQueryNameIndex = (mapArray: string[], matchFt: boolean) => {
  if (isBrandPage(mapArray)) {
    return 0
  }

  if (matchFt) {
    const ftIndex = mapArray.findIndex((mapItem) => mapItem === 'ft')

    if (ftIndex >= 0) {
      return ftIndex
    }
  }

  const clusterIndex = mapArray.findIndex(
    (mapItem) => mapItem === 'productClusterIds'
  )

  if (clusterIndex >= 0) {
    return clusterIndex
  }

  const lastCategoryIndex = findLastCategory(mapArray)

  return lastCategoryIndex
}

export function useSearchTitle(
  breadcrumbs: Breadcrumb[],
  options?: UseSearchTitleOptions
) {
  const { map } = useContext(QueryContext)

  const matchFt = Boolean(options?.matchFt)

  const queryNameIndex = useMemo(() => {
    if (!map) {
      return -1
    }

    const mapArray = map.split(',')

    return getQueryNameIndex(mapArray, matchFt)
  }, [map, matchFt])

  let title = ''

  if (queryNameIndex >= 0) {
    title = breadcrumbName(queryNameIndex, breadcrumbs) ?? ''
  } else if (options?.fallbackToLastName) {
    title = getLastName(breadcrumbs) ?? ''
  }

  const decodedTitle = useMemo(() => {
    try {
      return decodeURIComponent(title)
    } catch {
      return title
    }
  }, [title])

  return decodedTitle
}
