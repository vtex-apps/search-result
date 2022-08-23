import React from 'react'
import SelectedFilters from './SelectedFilters'
import { Button } from 'vtex.styleguide'
import { FormattedMessage } from 'react-intl'
import { useCssHandles, applyModifiers } from 'vtex.css-handles'

const CSS_HANDLES = [
    'filter__container',
]



export default function FilterSelectedMobile({
    filterSelectedMobile: {
    navigateToFacet,
    filterSelected=[],
    preventRouteChange
}}) {

    const handles = useCssHandles(CSS_HANDLES)
    
    return (
        <>
            <div
                className={`${applyModifiers(
                  handles.filter__container,
                  'clearAllFilters'
                )} bb b--muted-4`}
              >
                <Button onClick={()  => navigateToFacet(filterSelected, preventRouteChange)}>
                    <FormattedMessage id="store/search-result.filter-button.clearAll" />
                </Button>
            </div>
            <SelectedFilters
                filters={filterSelected}
                preventRouteChange={preventRouteChange}
                navigateToFacet={navigateToFacet}
            />     
        </>
    )
    
}
