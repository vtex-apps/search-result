import React, { useState, useCallback } from 'react'
import { Collapsible } from 'vtex.styleguide'

import useFacetNavigation from '../hooks/useFacetNavigation'

const CategoryItem = ({ category }) => {
  const [isOpen, setOpen] = useState(true)

  const handleClick = useCallback(() => {
    setOpen(prevOpen => !prevOpen)
  }, [])

  const navigateToFacet = useFacetNavigation()

  return (
    <Collapsible
      muted
      header={category.name}
      isOpen={isOpen}
      onClick={handleClick}
    >
      {category.children.map(childCategory => (
        <div
          tabIndex={0}
          role="link"
          key={childCategory.id}
          className="lh-copy pointer"
          onClick={() => navigateToFacet(childCategory)}
          onKeyDown={e => e.key === 'Enter' && navigateToFacet(childCategory)}
        >
          {childCategory.name}
        </div>
      ))}
    </Collapsible>
  )
}

export default CategoryItem
