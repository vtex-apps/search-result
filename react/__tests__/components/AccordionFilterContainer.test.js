import React from 'react'
import { fireEvent, render } from '@vtex/test-tools/react'
import specifications from 'specifications'
import { useRuntime } from 'vtex.render-runtime'

import AccordionFilterContainer from '../../components/AccordionFilterContainer'
import FilterNavigatorContext from '../../components/FilterNavigatorContext'

const mockProps = {
  filters: specifications,
  onFilterCheck: () => {},
  tree: [],
  onCategorySelect: () => {},
  appliedFiltersOverview: 'hide',
  navigationType: 'collapsible',
  initiallyCollapsed: false,
  truncateFilters: false,
  truncatedFacetsFetched: false,
  setTruncatedFacetsFetched: () => {},
  categoryFiltersMode: 'default',
  loading: false,
  onClearFilter: () => {},
  showClearByFilter: false,
  updateOnFilterSelectionOnMobile: false,
}

beforeEach(() => {
  jest.clearAllMocks()

  useRuntime.mockImplementation(() => ({
    getSettings: () => ({}),
  }))
})

describe('<AccordionFilterContainer />', () => {
  const renderComponent = () =>
    render(
      <FilterNavigatorContext.Provider
        value={{ query: 'fulltextterm', map: 'ft' }}
      >
        <AccordionFilterContainer {...mockProps} />
      </FilterNavigatorContext.Provider>
    )

  it('should be able to collapse filters when navigationTypeOnMobile is collapsible', () => {
    const { queryByText, getByText } = renderComponent()

    expect(getByText('White')).toBeInTheDocument()

    fireEvent.click(getByText('Color'))

    expect(queryByText('White')).toBeNull()

    fireEvent.click(getByText('Color'))

    expect(getByText('White')).toBeInTheDocument()
  })

  it('should be able to collapse filters on click when navigationTypeOnMobile is collapsible', () => {
    const { queryByText, getByText } = renderComponent()

    expect(getByText('White')).toBeInTheDocument()

    fireEvent.keyDown(getByText('Color'), {
      key: ' ',
      code: 'Space',
    })

    expect(queryByText('White')).toBeNull()
  })
})
