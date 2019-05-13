import React, { useContext } from 'react'
import { useRuntime } from 'vtex.render-runtime'
import { Checkbox } from 'vtex.styleguide'

import QueryContext from './QueryContext'
import SettingsContext from './SettingsContext'
import { HEADER_SCROLL_OFFSET } from '../constants/SearchHelpers'

const scrollOptions = {
  baseElementId: 'search-result-anchor',
  top: -HEADER_SCROLL_OFFSET,
}

const removeElementAtIndex = (str, index, separator) =>
  str
    .split(separator)
    .filter((_, i) => i !== index)
    .join(separator)

const FacetItem = ({ facet }) => {
  const { navigate } = useRuntime()
  const { query, map } = useContext(QueryContext)
  const { showFacetQuantity } = useContext(SettingsContext)

  const getFacetIndex = facet => {
    return query
      .toLowerCase()
      .split('/')
      .map(decodeURIComponent)
      .findIndex(
        value => value === decodeURIComponent(facet.value).toLowerCase()
      )
  }

  const removeChildrenSelected = (facet, urlParams) => {
    let newQuery = query
    for (const child of facet.children) {
      if (child.selected) {
        if (child.children) {
          for (const c of child.children) {
            newQuery = removeChildrenSelected(c, urlParams)
          }
        }
        const childIndex = getFacetIndex(child)
        newQuery = removeElementAtIndex(query, childIndex, '/')
        urlParams.set('map', removeElementAtIndex(map, childIndex, ','))
      }
    }
    return newQuery
  }

  const handleChange = () => {
    const urlParams = new URLSearchParams(window.location.search)

    if (facet.selected) {
      const facetIndex = getFacetIndex(facet)
      let newQuery = removeChildrenSelected(facet, urlParams)
      urlParams.set('map', removeElementAtIndex(map, facetIndex, ','))

      navigate({
        to: `/${removeElementAtIndex(newQuery, facetIndex, '/')}`,
        query: urlParams.toString(),
        scrollOptions,
      })
      return
    }
    
    urlParams.set('map', `${map},${facet.map}`)

    navigate({
      to: `/${query}/${facet.value}`,
      query: urlParams.toString(),
      scrollOptions,
    })
  }

  return (
    <div className="lh-copy w-100">
      <Checkbox
        id={facet.value}
        checked={facet.selected}
        label={
          showFacetQuantity ? `${facet.name} (${facet.quantity})` : facet.name
        }
        name={facet.name}
        onChange={handleChange}
        value={facet.name}
      />
    </div>
  )
}

export default FacetItem
