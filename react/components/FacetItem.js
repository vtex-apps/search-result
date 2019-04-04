import React, { useContext } from 'react'
import { useRuntime } from 'vtex.render-runtime'
import { Checkbox } from 'vtex.styleguide'

import QueryContext from './QueryContext'
import { HEADER_SCROLL_OFFSET } from '../constants/SearchHelpers'

const scrollOptions = {
  baseElementId: 'search-result-anchor',
  top: -HEADER_SCROLL_OFFSET,
}

const FacetItem = ({ facet }) => {
  const { navigate } = useRuntime()
  const { query, map } = useContext(QueryContext)

  const handleChange = () => {
    if (facet.selected) {
      const facetIndex = query
        .toLowerCase()
        .split('/')
        .findIndex(slug => slug === facet.slug.toLowerCase())

      const urlParams = new URLSearchParams(window.location.search)

      urlParams.set(
        'map',
        map
          .split(',')
          .filter((_, i) => i !== facetIndex)
          .join(',')
      )

      navigate({
        to:
          '/' +
          query
            .split('/')
            .filter((_, i) => i !== facetIndex)
            .join('/'),
        query: urlParams.toString(),
        scrollOptions,
      })
      return
    }

    const [path, queryParams] = facet.link.split('?')

    navigate({
      to: path,
      query: queryParams,
      scrollOptions,
    })
  }

  return (
    <div className="lh-copy w-100">
      <Checkbox
        id={facet.slug}
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
