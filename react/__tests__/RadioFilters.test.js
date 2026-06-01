/* eslint-disable jest/no-mocks-import */
/* eslint-env jest */
import React from 'react'
import { render, fireEvent } from '@vtex/test-tools/react'
import { useDeliveryPromiseState } from 'vtex.delivery-promise-components/DeliveryPromiseContext'

import RadioFilters from '../components/RadioFilters'

// Keep tests focused on disabled/enabled logic — action buttons are tested separately
jest.mock('../hooks/useShippingActions', () => ({
  __esModule: true,
  default: () => ({ actionLabel: null, actionType: null }),
  isShippingActionPlaceholder: () => false,
}))

// Prevent pickup modal navigation side-effects in click tests
jest.mock('../utils/pickupInPointLabel', () => ({
  ...jest.requireActual('../utils/pickupInPointLabel'),
  resolvePickupInPointFacetForNavigation: facet => ({ facet }),
}))

const PICKUP_IN_POINT = 'pickup-in-point'
const DELIVERY = 'delivery'
const PICKUP_NEARBY = 'pickup-nearby'

const makeFacet = (value, quantity = 1, overrides = {}) => ({
  id: null,
  key: 'shipping',
  map: 'shipping',
  name: value,
  value,
  quantity,
  selected: false,
  ...overrides,
})

const renderRadioFilters = (facets, onChange = jest.fn()) =>
  render(
    <RadioFilters
      facets={facets}
      onChange={onChange}
      onOpenPostalCodeModal={jest.fn()}
      onOpenPickupModal={jest.fn()}
    />
  )

const getInput = (container, value) =>
  container.querySelector(`input[value="${value}"]`)

beforeEach(() => {
  jest.clearAllMocks()

  useDeliveryPromiseState.mockReturnValue({
    selectedPickup: undefined,
    pickupSuggestion: undefined,
    zipcode: undefined,
    pickups: [],
  })
})

describe('<RadioFilters /> — pickup-in-point disabled logic', () => {
  it('is disabled when quantity is 0 even if there are pickups in context', () => {
    useDeliveryPromiseState.mockReturnValue({
      pickups: [{ id: 'store-1', friendlyName: 'My Store' }],
    })

    const { container } = renderRadioFilters([makeFacet(PICKUP_IN_POINT, 0)])

    expect(getInput(container, PICKUP_IN_POINT)).toBeDisabled()
  })

  it('is disabled when there are no pickups in context even if quantity is greater than 0', () => {
    useDeliveryPromiseState.mockReturnValue({ pickups: [] })

    const { container } = renderRadioFilters([makeFacet(PICKUP_IN_POINT, 5)])

    expect(getInput(container, PICKUP_IN_POINT)).toBeDisabled()
  })

  it('is enabled when quantity is greater than 0 AND there are pickups in context', () => {
    useDeliveryPromiseState.mockReturnValue({
      pickups: [{ id: 'store-1', friendlyName: 'My Store' }],
    })

    const { container } = renderRadioFilters([makeFacet(PICKUP_IN_POINT, 3)])

    expect(getInput(container, PICKUP_IN_POINT)).not.toBeDisabled()
  })

  it('is disabled when both quantity is 0 and pickups are empty', () => {
    useDeliveryPromiseState.mockReturnValue({ pickups: [] })

    const { container } = renderRadioFilters([makeFacet(PICKUP_IN_POINT, 0)])

    expect(getInput(container, PICKUP_IN_POINT)).toBeDisabled()
  })

  it('treats pickup-in-point-{id} (URL-selected) the same as base value', () => {
    useDeliveryPromiseState.mockReturnValue({ pickups: [] })

    const { container } = renderRadioFilters([
      makeFacet('pickup-in-point-store-abc', 5),
    ])

    expect(getInput(container, 'pickup-in-point-store-abc')).toBeDisabled()
  })

  it('treats pickup-in-point-{id} as enabled when pickups exist and quantity > 0', () => {
    useDeliveryPromiseState.mockReturnValue({
      pickups: [{ id: 'store-abc' }],
    })

    const { container } = renderRadioFilters([
      makeFacet('pickup-in-point-store-abc', 2),
    ])

    expect(getInput(container, 'pickup-in-point-store-abc')).not.toBeDisabled()
  })
})

describe('<RadioFilters /> — non-pickup-in-point facets disabled logic', () => {
  it('disables delivery when quantity is 0', () => {
    useDeliveryPromiseState.mockReturnValue({ pickups: [{ id: 'store-1' }] })

    const { container } = renderRadioFilters([makeFacet(DELIVERY, 0)])

    expect(getInput(container, DELIVERY)).toBeDisabled()
  })

  it('enables delivery when quantity is greater than 0, regardless of pickups', () => {
    useDeliveryPromiseState.mockReturnValue({ pickups: [] })

    const { container } = renderRadioFilters([makeFacet(DELIVERY, 10)])

    expect(getInput(container, DELIVERY)).not.toBeDisabled()
  })

  it('disables pickup-nearby when quantity is 0', () => {
    useDeliveryPromiseState.mockReturnValue({ pickups: [{ id: 'store-1' }] })

    const { container } = renderRadioFilters([makeFacet(PICKUP_NEARBY, 0)])

    expect(getInput(container, PICKUP_NEARBY)).toBeDisabled()
  })

  it('enables pickup-nearby when quantity is greater than 0', () => {
    useDeliveryPromiseState.mockReturnValue({ pickups: [] })

    const { container } = renderRadioFilters([makeFacet(PICKUP_NEARBY, 7)])

    expect(getInput(container, PICKUP_NEARBY)).not.toBeDisabled()
  })
})

describe('<RadioFilters /> — mixed facets', () => {
  it('correctly disables only the facets that should be inactive', () => {
    useDeliveryPromiseState.mockReturnValue({
      pickups: [{ id: 'store-1' }],
    })

    const { container } = renderRadioFilters([
      makeFacet(DELIVERY, 5),
      makeFacet(PICKUP_IN_POINT, 0), // quantity 0 → disabled even with pickups
      makeFacet(PICKUP_NEARBY, 0), // quantity 0 → disabled
    ])

    expect(getInput(container, DELIVERY)).not.toBeDisabled()
    expect(getInput(container, PICKUP_IN_POINT)).toBeDisabled()
    expect(getInput(container, PICKUP_NEARBY)).toBeDisabled()
  })

  it('enables all facets when quantities are positive and pickups exist', () => {
    useDeliveryPromiseState.mockReturnValue({
      pickups: [{ id: 'store-1' }],
    })

    const { container } = renderRadioFilters([
      makeFacet(DELIVERY, 5),
      makeFacet(PICKUP_IN_POINT, 3),
      makeFacet(PICKUP_NEARBY, 2),
    ])

    expect(getInput(container, DELIVERY)).not.toBeDisabled()
    expect(getInput(container, PICKUP_IN_POINT)).not.toBeDisabled()
    expect(getInput(container, PICKUP_NEARBY)).not.toBeDisabled()
  })

  it('disables pickup-in-point but keeps delivery enabled when no pickups in context', () => {
    useDeliveryPromiseState.mockReturnValue({ pickups: [] })

    const { container } = renderRadioFilters([
      makeFacet(DELIVERY, 5),
      makeFacet(PICKUP_IN_POINT, 3),
    ])

    expect(getInput(container, DELIVERY)).not.toBeDisabled()
    expect(getInput(container, PICKUP_IN_POINT)).toBeDisabled()
  })
})

describe('<RadioFilters /> — interaction', () => {
  it('calls onChange when an enabled facet is clicked', () => {
    useDeliveryPromiseState.mockReturnValue({ pickups: [] })

    const onChange = jest.fn()
    const { container } = renderRadioFilters([makeFacet(DELIVERY, 5)], onChange)

    fireEvent.click(getInput(container, DELIVERY))

    expect(onChange).toHaveBeenCalledTimes(1)
  })

  it('does not call onChange when a selected facet is clicked again', () => {
    useDeliveryPromiseState.mockReturnValue({ pickups: [] })

    const onChange = jest.fn()
    const { container } = renderRadioFilters(
      [makeFacet(DELIVERY, 5, { selected: true })],
      onChange
    )

    fireEvent.click(getInput(container, DELIVERY))

    expect(onChange).not.toHaveBeenCalled()
  })
})
