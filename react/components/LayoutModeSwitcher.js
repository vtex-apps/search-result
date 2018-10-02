import React from 'react'
import PropTypes from 'prop-types'
import { Button } from 'vtex.styleguide'

import Grid from '../images/Grid'
import SingleItemGrid from '../images/SingleItemGrid'
import InlineGrid from '../images/InlineGrid'

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
          <Grid active={activeMode === 'small'} />
        </Button>
      </div>
      <div className="flex justify-center flex-auto br b--muted-4">
        <Button
          variation="tertiary"
          size="small"
          onClick={onChangeHandler('inline', onChange)}
        >
          <InlineGrid active={activeMode === 'inline'} />
        </Button>
      </div>
      <div className="flex justify-center flex-auto">
        <Button
          variation="tertiary"
          size="small"
          onClick={onChangeHandler('normal', onChange)}
        >
          <SingleItemGrid active={activeMode === 'normal'} />
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
