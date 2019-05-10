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

const LayoutIcon = ({ mode }) => {
  switch (mode) {
    case 'small':
      return <IconGrid size={20} />
    case 'inline':
      return <IconInlineGrid size={20} />
    case 'normal':
      return <IconSingleGrid size={20} />
    default: {
      // eslint-disable-next-line no-undef
      if (process.env.NODE_ENV === 'development') {
        console.warn(`Unsupported icon ${mode} in LayoutIcon`)
      }
    }
  }
}

const LayoutModeSwitcher = ({ activeMode, onChange }) => {
  return (
    <div
      className={`${
        searchResult.layoutSwitcher
      } h-100 flex justify-center items-center`}
    >
      <Button
        variation="tertiary"
        size="small"
        onClick={e => onChange(e, activeMode)}
      >
        <span className="c-on-base">
          <LayoutIcon mode={activeMode} />
        </span>
      </Button>
    </div>
  )
}

LayoutModeSwitcher.propTypes = {
  /** Current active mode */
  activeMode: PropTypes.string,
  /** On change callback */
  onChange: PropTypes.func.isRequired,
}

export default LayoutModeSwitcher
