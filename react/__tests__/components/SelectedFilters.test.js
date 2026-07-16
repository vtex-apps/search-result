import React from 'react'
import { render } from '@vtex/test-tools/react'

import SelectedFilters from '../../components/SelectedFilters'

// Isolate the delivery-promise gating logic: render only the keys that made it
// past SelectedFilters' own filtering, without pulling in the full
// FilterOptionTemplate / FacetItem tree.
jest.mock('../../components/FilterOptionTemplate', () => {
  // eslint-disable-next-line global-require
  const ReactModule = require('react')
  const MockFilterOptionTemplate = ({ filters }) =>
    ReactModule.createElement(
      'div',
      { 'data-testid': 'visible-keys' },
      filters.map(f => f.key).join(',')
    )

  MockFilterOptionTemplate.displayName = 'FilterOptionTemplate'

  return MockFilterOptionTemplate
})

const makeFacet = (key, name) => ({
  key,
  name,
  value: name,
  quantity: 1,
  selected: true,
})

const filters = [
  makeFacet('brand', 'Samsung'),
  makeFacet('shipping', 'delivery'),
  makeFacet('dynamic-estimate', 'estimate'),
  makeFacet('delivery-options', 'pickup'),
]

const renderComponent = customProps =>
  render(<SelectedFilters map="b" filters={filters} {...customProps} />)

describe('<SelectedFilters /> delivery-promise gate', () => {
  it('keeps every delivery-promise badge when showDeliveryPromiseFacets is true', () => {
    const { getByTestId } = renderComponent({ showDeliveryPromiseFacets: true })

    const keys = getByTestId('visible-keys').textContent.split(',')

    expect(keys).toEqual(
      expect.arrayContaining([
        'brand',
        'shipping',
        'dynamic-estimate',
        'delivery-options',
      ])
    )
  })

  it('drops all three delivery-promise badges when showDeliveryPromiseFacets is false', () => {
    const { getByTestId } = renderComponent({
      showDeliveryPromiseFacets: false,
    })

    expect(getByTestId('visible-keys').textContent).toBe('brand')
  })

  it('drops all three delivery-promise badges when showDeliveryPromiseFacets is undefined', () => {
    const { getByTestId } = renderComponent()

    expect(getByTestId('visible-keys').textContent).toBe('brand')
  })
})
