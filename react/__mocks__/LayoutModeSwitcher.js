import React from 'react'

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

const LayoutModeSwitcher = ({ activeMode, onChange }) => {
  return <div>LayoutModeSwitcher</div>
}

export default LayoutModeSwitcher
