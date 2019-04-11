import React from 'react'
import PropTypes from 'prop-types'
import { Button } from 'vtex.styleguide'
import { IconGrid, IconInlineGrid, IconSingleGrid } from 'vtex.store-icons'

import searchResult from '../searchResult.css'

export const LAYOUT_MODE = [
  {
    value: 'normal',
    label: 'layoutModeSwitcher.normal',
  },
  {
    value: 'small',
    label: 'layoutModeSwitcher.small',
  },
  {
    value: 'inline',
    label: 'layoutModeSwitcher.inline',
  },
]

export default function LayoutModeSwitcher({ activeMode, onChange }) {

  const renderButton = (mode, onChange) => {
    const renderIcon = mode => {
      switch (mode) {
        case 'small':
          return <IconGrid size={20} />
        case 'inline':
          return <IconInlineGrid size={20} />
        case 'normal':
          return <IconSingleGrid size={20} />
      }
    }

    return (
      <div className={`${searchResult.layoutSwitcher} dn-ns h-100 flex justify-center items-center`}>
        <Button
          variation="tertiary"
          size="small"
          onClick={e => onChange(e, mode)}
        >
          <span className="c-on-base">{renderIcon(mode)}</span>
        </Button>
      </div>
    )
  }

  return renderButton(activeMode, onChange)
}

LayoutModeSwitcher.propTypes = {
  /** Current active mode */
  activeMode: PropTypes.string,
  /** On change callback */
  onChange: PropTypes.func.isRequired,
}
