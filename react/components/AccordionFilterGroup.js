import React from 'react'
import { useIntl } from 'react-intl'
import classNames from 'classnames'
import { useCssHandles, applyModifiers } from 'vtex.css-handles'
import slugify from 'slugify'

import AccordionFilterItem from './AccordionFilterItem'
import FacetCheckboxList from './FacetCheckboxList'
import useSelectedFilters from '../hooks/useSelectedFilters'

import { getFilterTitle } from '../constants/SearchHelpers'

const CSS_HANDLES = ['accordionFilterOpened']

const AccordionFilterGroup = ({
  className,
  title,
  facets,
  show,
  open,
  onOpen,
  onFilterCheck,
}) => {
  const handles = useCssHandles(CSS_HANDLES)
  const filters = useSelectedFilters(facets)
  const quantitySelected = filters.filter(facet => facet.selected).length
  const intl = useIntl()
  const facetTitle = getFilterTitle(title, intl)
  const slugFaceTitle = slugify(facetTitle, { lower: true, remove: /[*+~.()'"!:@]/g })

  return (
    <AccordionFilterItem
      title={title}
      open={open}
      show={show}
      onOpen={onOpen}
      quantitySelected={quantitySelected}
    >
      <div className={classNames(
          applyModifiers(handles.accordionFilterOpened, slugFaceTitle),
          className
        )}>
        <FacetCheckboxList
          onFilterCheck={onFilterCheck}
          facets={filters}
          facetTitle={facetTitle}
        />
      </div>
    </AccordionFilterItem>
  )
}

export default AccordionFilterGroup
