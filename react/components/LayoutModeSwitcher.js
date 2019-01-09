import React from 'react'
import PropTypes from 'prop-types'
import { Button } from 'vtex.styleguide'

import Grid from '../images/Grid'
import SingleItemGrid from '../images/SingleItemGrid'
import InlineGrid from '../images/InlineGrid'

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
          return <Grid />
        case 'inline':
          return <InlineGrid />
        case 'normal':
          return <SingleItemGrid />
      }
    }

    return (
      <div className={`${searchResult.layoutSwitcher} dn-ns h-100 flex justify-center items-center`}>
        <Button
          variation="tertiary"
          size="small"
          onClick={e => onChange(e, mode)}
        >
          {renderIcon(mode)}
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
