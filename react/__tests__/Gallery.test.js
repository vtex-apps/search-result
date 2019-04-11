/* eslint-env jest */
import React from 'react'
import { render } from '@vtex/test-tools/react'

import { products, summary } from 'GalleryMocks'

import Gallery from '../Gallery'

describe('<OrderBy />', () => {
  const renderComponent = customProps => {
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
