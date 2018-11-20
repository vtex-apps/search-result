import React from 'react'
import PropTypes from 'prop-types'
import { Button } from 'vtex.styleguide'

import GridIcon from '../images/GridIcon'

const onChangeHandler = (type, onChange) => e => onChange(e, type)

export default function LayoutModeSwitcher({ activeMode, onChange }) {
  return (
    <div className="vtex-layout-switcher flex justify-between pv2">
      <div className="flex justify-center flex-auto br b--muted-4">
        <Button
          variation="tertiary"
          size="small"
          onClick={onChangeHandler('small', onChange)}
        >
          <GridIcon active={activeMode === 'small'} iconID='grid' width='16' height='19' />
        </Button>
      </div>
      <div className="flex justify-center flex-auto br b--muted-4">
        <Button
          variation="tertiary"
          size="small"
          onClick={onChangeHandler('inline', onChange)}
        >
          <GridIcon active={activeMode === 'inline'} iconID='inline-grid' width='19' height='19' />          
        </Button>
      </div>
      <div className="flex justify-center flex-auto">
        <Button
          variation="tertiary"
          size="small"
          onClick={onChangeHandler('normal', onChange)}
        > 
          <GridIcon active={activeMode === 'normal'} iconID='single-item-grid' width='10' height='19' />          
        </Button>
      </div>
    </div>
  )
}

LayoutModeSwitcher.propTypes = {
  /** Current active mode */
  activeMode: PropTypes.string.isRequired,
  /** On change callback */
  onChange: PropTypes.func.isRequired,
}
