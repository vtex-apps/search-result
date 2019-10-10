import React, { useContext } from 'react'
import { Checkbox } from 'vtex.styleguide'
import classNames from 'classnames'

import SettingsContext from './SettingsContext'
import useFacetNavigation from '../hooks/useFacetNavigation'

import styles from '../searchResult.css'

const FacetItem = ({ facet, className, preventRouteChange = false }) => {
  const { showFacetQuantity } = useContext(SettingsContext)

  const navigateToFacet = useFacetNavigation()

  const classes = classNames(
    styles.filterItem,
    `${styles.filterItem}--${facet.value}`,
    { [`${styles.filterItem}--selected`]: facet.selected },
    className,
    'lh-copy w-100'
  )

  return (
    <div
      className={classes}
      style={{ hyphens: 'auto', wordBreak: 'break-word' }}
    >
      <Checkbox
        id={facet.value}
        checked={facet.selected}
        label={
          showFacetQuantity ? `${facet.name} (${facet.quantity})` : facet.name
        }
        name={facet.name}
        onChange={() => navigateToFacet(facet, preventRouteChange)}
        value={facet.name}
      />
    </div>
  )
}

export default FacetItem
