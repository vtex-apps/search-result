import React, { useContext } from 'react'
import { useRuntime } from 'vtex.render-runtime'
import { Checkbox } from 'vtex.styleguide'

import QueryContext from './QueryContext'
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

  const handleChange = () => {
    if (facet.selected) {
      const facetIndex = query
        .toLowerCase()
        .split('/')
        .map(decodeURIComponent)
        .findIndex(
          value => value === decodeURIComponent(facet.value).toLowerCase()
        )

      const urlParams = new URLSearchParams(window.location.search)

      urlParams.set('map', removeElementAtIndex(map, facetIndex, ','))

      navigate({
        to: `/${removeElementAtIndex(query, facetIndex, '/')}`,
        query: urlParams.toString(),
        scrollOptions,
      })
      return
    }

    const [path, queryParams] = facet.linkEncoded.split('?')

    navigate({
      to: path,
      query: queryParams,
      scrollOptions,
    })
  }

  return (
    <div className="lh-copy w-100">
      <Checkbox
        id={facet.value}
        checked={facet.selected}
        label={`${facet.name} (${facet.quantity})`}
        name={facet.name}
        onChange={handleChange}
        value={facet.name}
      />
    </div>
  )
}

export default FacetItem
