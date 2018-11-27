import React from 'react'
import PropTypes from 'prop-types'
import { Button } from 'vtex.styleguide'

import Icon from 'vtex.use-svg/Icon'

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
          <Icon id="grid" isActive={activeMode === 'small'} size={20} />
        </Button>
      </div>
      <div className="flex justify-center flex-auto br b--muted-4">
        <Button
          variation="tertiary"
          size="small"
          onClick={onChangeHandler('inline', onChange)}
        >
          <Icon id="inline-grid" isActive={activeMode === 'inline'} size={20} />          
        </Button>
      </div>
      <div className="flex justify-center flex-auto">
        <Button
          variation="tertiary"
          size="small"
          onClick={onChangeHandler('normal', onChange)}
        > 
          <Icon id="single-item-grid" isActive={activeMode === 'normal'} size={20} />          
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
