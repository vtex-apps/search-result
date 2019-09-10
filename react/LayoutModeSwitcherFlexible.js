import React from 'react'
import {
  useSearchPage,
  useSearchPageState,
  useSearchPageStateDispatch,
} from 'vtex.search-page-context/SearchPageContext'
import { prop } from 'ramda'

import LayoutModeSwitcher from './LayoutModeSwitcher'

const withSearchPageContextProps = Component => () => {
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

  return <Component activeMode={mobileLayout} onChange={onChange} />
}

export default withSearchPageContextProps(LayoutModeSwitcher)
