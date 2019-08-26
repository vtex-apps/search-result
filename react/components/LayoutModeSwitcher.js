import React from 'react'
import PropTypes from 'prop-types'
import { Button } from 'vtex.styleguide'
import { IconGrid, IconInlineGrid, IconSingleGrid } from 'vtex.store-icons'
import { prop } from 'ramda'

import searchResult from '../searchResult.css'
import {
  useSearchPage,
  useSearchPageState,
  useSearchPageStateDispatch,
} from 'vtex.search-page-context/SearchPageContext'

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
      return null
    }
  }
}

const LayoutModeSwitcher = ({ activeMode, onChange }) => {
  return (
    <div
      className={`${
        searchResult.layoutSwitcher
      } h-100 flex justify-center items-center pl4`}
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

const withSearchPageContextProps = Component => props => {
  const { mobileLayout: layoutOptions } = useSearchPage()
  const { mobileLayout } = useSearchPageState()
  const dispatch = useSearchPageStateDispatch()

  const onChange = e => {
    e.preventDefault()
    const newLayoutIndex =
      prop('mode1', layoutOptions) === mobileLayout ? 'mode2' : 'mode1'
    const newLayout = prop(newLayoutIndex, layoutOptions)
    dispatch({ type: 'SWITCH_LAYOUT', args: { mobileLayout: newLayout } })
  }

  if (layoutOptions && Object.keys(layoutOptions).length < 2) {
    return null
  }

  return (
    <Component
      activeMode={props.activeMode || mobileLayout}
      onChange={props.onChange || onChange}
    />
  )
}

export default withSearchPageContextProps(LayoutModeSwitcher)
