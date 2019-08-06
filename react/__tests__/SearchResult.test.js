import React from 'react'
import { render } from '@vtex/test-tools/react'
import SearchResult from '../components/SearchResult'

describe('<SearchResult />', () => {
  const renderComponent = (isMobile, showBreadcrumbs) => {
    const breadcrumbsProps = {
      breadcrumb: 'bc',
    }
    return render(
      <SearchResult
        isMobile={isMobile}
        showBreadcrumbsOnMobile={showBreadcrumbs}
        breadcrumbsProps={breadcrumbsProps}
        fetchMoreLoading={false}
        loading={false}
        specificationFilters={[]}
        priceRanges={[]}
        brands={[]}
        recordsFiltered={8}
      />
    )
  }

  it('check if breadcrumbs are present on desktop with showBreadcrumbs as true', () => {
    const { getByTestId } = renderComponent(false, true)
    expect(getByTestId('breadcrumb')).toBeInTheDocument()
  })

  it('check if breadcrumbs are present on desktop with showBreadcrumbs as false', () => {
    const { getByTestId } = renderComponent(false, false)
    expect(getByTestId('breadcrumb')).toBeInTheDocument()
  })

  it('check if breadcrumbs are present on mobile with showBreadcrumbs as true', () => {
    const { getByTestId } = renderComponent(true, true)
    expect(getByTestId('breadcrumb')).toBeInTheDocument()
  })

  it('check if breadcrumbs are present on mobile with showBreadcrumbs as false', () => {
    const { queryByTestId } = renderComponent(true, false)
    expect(queryByTestId('breadcrumb')).toBeNull()
  })
})
