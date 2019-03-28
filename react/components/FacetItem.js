import React from 'react'
import { useRuntime } from 'vtex.render-runtime'
import { Checkbox } from 'vtex.styleguide'

import { HEADER_SCROLL_OFFSET } from '../constants/SearchHelpers'
import useSelectedFacet from '../hooks/useSelectedFacet'

const FacetItem = ({ facet }) => {
  const { navigate } = useRuntime()

  const isSelected = useSelectedFacet(facet)

  const handleChange = () => {
    if (isSelected) {
      // should remove facet
      return
    }

    const [path, query] = facet.Link.split('?')

    navigate({
      to: path,
      query,
      scrollOptions: {
        baseElementId: 'search-result-anchor',
        top: -HEADER_SCROLL_OFFSET,
      },
    })
  }

  return (
    <div className="lh-copy w-100">
      <Checkbox
        checked={isSelected}
        label={`${facet.Name} (${facet.Quantity})`}
        onChange={handleChange}
        value={facet.Name}
      />
    </div>
  )
}

export default FacetItem
