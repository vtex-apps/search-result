import React, { useContext } from 'react'
import { useRuntime } from 'vtex.render-runtime'
import { Checkbox } from 'vtex.styleguide'

import QueryContext from '../../QueryContext'
import SettingsContext from '../../SettingsContext'
import { HEADER_SCROLL_OFFSET } from '../../../constants/SearchHelpers'

const scrollOptions = {
  baseElementId: 'search-result-anchor',
  top: -HEADER_SCROLL_OFFSET,
}

const removeElementAtIndex = (str, index, separator) =>
  str
    .split(separator)
    .filter((_, i) => i !== index)
    .join(separator)

const FacetItem = ({ facet, preventRouteChange = false }) => {
  const { navigate, setQuery } = useRuntime()
  const { query, map } = useContext(QueryContext)
  const { showFacetQuantity } = useContext(SettingsContext)

  const handleChange = () => {
    const urlParams = new URLSearchParams(window.location.search)

    if (facet.selected) {
      const facetIndex = query
        .toLowerCase()
        .split('/')
        .map(decodeURIComponent)
        .findIndex(
          value => value === decodeURIComponent(facet.value).toLowerCase()
        )

      if (preventRouteChange) {
        setQuery({
          map: removeElementAtIndex(map, facetIndex, ','),
          query: `/${removeElementAtIndex(query, facetIndex, '/')}`,
        })
      } else {
        urlParams.set('map', removeElementAtIndex(map, facetIndex, ','))

        navigate({
          to: `/${removeElementAtIndex(query, facetIndex, '/')}`,
          query: urlParams.toString(),
          scrollOptions,
        })
      }

      return
    }

    if (preventRouteChange) {
      setQuery({
        map: `${map},${facet.map}`,
        query: `/${query}/${facet.value}`,
      })
    } else {
      urlParams.set('map', `${map},${facet.map}`)

      navigate({
        to: `/${query}/${facet.value}`,
        query: urlParams.toString(),
        scrollOptions,
      })
    }
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
