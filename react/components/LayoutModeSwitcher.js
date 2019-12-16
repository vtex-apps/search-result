import React from 'react'
import PropTypes from 'prop-types'
import { Button } from 'vtex.styleguide'
import { IconGrid, IconInlineGrid, IconSingleGrid } from 'vtex.store-icons'
import { useCssHandles } from 'vtex.css-handles'

const CSS_HANDLES = ['layoutSwitcher']

export const LAYOUT_MODE = [
  {
    /** This is the single product view on mobile */
    value: 'normal',
    label: 'layoutModeSwitcher.normal',
  },
  {
    /** This is the grid product view on mobile */
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
      return <IconSingleGrid size={20} />
    case 'inline':
      return <IconInlineGrid size={20} />
    case 'normal':
      return <IconGrid size={20} />
    default: {
      // eslint-disable-next-line no-undef
      if (process.env.NODE_ENV === 'development') {
        console.warn(`Unsupported icon ${mode} in LayoutIcon`)
      }
      return null
    }
  }
}

const LayoutModeSwitcher = ({ activeMode, onChange }) => {
  const handles = useCssHandles(CSS_HANDLES)
  return (
    <div
      className={`${handles.layoutSwitcher} h-100 flex justify-center items-center pl4`}
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
