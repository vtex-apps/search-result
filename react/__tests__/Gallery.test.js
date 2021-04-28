/* eslint-disable jest/no-mocks-import */
/* eslint-env jest */
import React from 'react'
import { render } from '@vtex/test-tools/react'
import { useDevice } from 'vtex.device-detector'
import { products, summary } from 'GalleryMocks'

import Gallery from '../Gallery'
import { useRuntime } from '../__mocks__/vtex.render-runtime'
import { SearchPageContext } from '../__mocks__/vtex.search-page-context'

const { useSearchPageState } = SearchPageContext

const mockUseRuntime = useRuntime
const mockUseSearchPageState = useSearchPageState

beforeEach(() => {
  jest.clearAllMocks()

  mockUseRuntime.mockImplementation(() => ({
    getSettings: () => ({}),
  }))

  mockUseSearchPageState.mockImplementation(() => ({}))

  useDevice.mockImplementation(() => ({
    isMobile: false,
  }))
})

describe('<Gallery />', () => {
  const renderComponent = (customProps) => {
    const props = {
      products,
      summary,
      ...customProps,
    }

    return render(<Gallery {...props} />)
  }

  it('should match snapshot', () => {
    const { asFragment } = renderComponent()

    expect(asFragment()).toMatchSnapshot()
  })
})
