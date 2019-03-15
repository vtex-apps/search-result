/* eslint-env jest */
import React from 'react'
import { render } from '@vtex/test-tools/react'

import OrderBy from '../OrderBy'
import { setMobileState } from 'vtex.render-runtime'

describe('<OrderBy />', () => {
  const renderComponent = customProps => mobile => {
    setMobileState(mobile)
    const props = {
      getLinkProps: () => ({ page: 'mokedPage' }),
      orderBy: 'OrderByTopSaleDESC',
      ...customProps,
    }

    return render(<OrderBy {...props} />)
  }

  it('should match snapshot in web mod', () => {
    const { asFragment } = renderComponent()(false)

    expect(asFragment()).toMatchSnapshot()
  })

  it('should match snapshot in mobile', () => {
    const { asFragment } = renderComponent()(true)

    expect(asFragment()).toMatchSnapshot()
  })

  afterEach(() => {
    setMobileState(false)
  })
})
