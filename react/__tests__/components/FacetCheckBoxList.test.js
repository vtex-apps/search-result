import React from 'react'
import { fireEvent, render } from '@vtex/test-tools/react'
import specifications from 'specifications'
import { useRuntime } from 'vtex.render-runtime'

import FacetCheckboxList from '../../components/FacetCheckboxList'
import SettingsContext from '../../components/SettingsContext'

const mockProps = {
  facetTitle: 'Color',
  facets: specifications[0].facets,
  navigationType: 'page',
  quantity: 13,
  setTruncatedFacetsFetched: () => {},
  truncateFilters: true,
  tuncatedFacetsFetched: false,
}

beforeEach(() => {
  jest.clearAllMocks()

  useRuntime.mockImplementation(() => ({
    getSettings: () => ({ thresholdForFacetSearch: 10 }),
  }))
})

describe('<FacetCheckBoxList />', () => {
  const renderComponent = (customProps) => {
    const props = { ...mockProps, ...customProps }

    return render(
      <SettingsContext.Provider value={{ thresholdForFacetSearch: 10 }}>
        <FacetCheckboxList {...props} />
      </SettingsContext.Provider>
    )
  }

  it('should filter items by the search bar', () => {
    const { getByTestId, queryByText } = renderComponent()

    expect(queryByText('White')).toBeInTheDocument()

    fireEvent.change(getByTestId('filter-search-bar'), {
      target: { value: 'yellow' },
    })

    expect(queryByText('White')).toBeNull()
    expect(queryByText('Yellow')).toBeInTheDocument()
  })

  it('should truncate filters', () => {
    const { queryByText, getByText } = renderComponent({
      navigationType: 'collapsible',
      truncateFilters: true,
    })

    expect(queryByText('Rose')).toBeNull()

    fireEvent.click(getByText('See 3 more'))

    expect(getByText('Rose')).toBeInTheDocument()
  })
})
