import React from 'react'
import { render } from '@vtex/test-tools/react'

import GalleryRow from '../components/GalleryRow'
import { ProductsPositionOffsetProvider } from '../components/ProductsPositionOffsetContext'

const mockUseSearchPage = jest.fn()

jest.mock('vtex.search-page-context/SearchPageContext', () => ({
  useSearchPage: () => mockUseSearchPage(),
}))

jest.mock('../hooks/useRenderOnView', () => ({
  useRenderOnView: () => ({ hasBeenViewed: true, dummyElement: null }),
}))

jest.mock('../components/GalleryItem', () => {
  return function MockGalleryItem() {
    return null
  }
})

const searchQueryMock = {
  searchQuery: {
    data: {
      productSearch: {
        searchId: 'search-id',
        redirect: null,
      },
    },
  },
}

const createProduct = (id: string) => ({
  cacheId: id,
  productId: id,
  productName: `Product ${id}`,
  description: '',
  categories: [],
  linkText: id,
  items: [],
  specification: '',
})

const defaultProps = {
  products: [createProduct('1'), createProduct('2')],
  summary: {},
  displayMode: 'normal' as const,
  itemsPerRow: 2,
  rowIndex: 0,
  listName: 'Search result',
}

const renderGalleryRow = (
  offset: number,
  props: Partial<typeof defaultProps> = {}
) => {
  mockUseSearchPage.mockReturnValue(searchQueryMock)

  return render(
    <ProductsPositionOffsetProvider value={offset}>
      <GalleryRow {...defaultProps} {...props} />
    </ProductsPositionOffsetProvider>
  )
}

describe('<GalleryRow /> product position', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('uses DOM index when pagination offset is 0', () => {
    const { container } = renderGalleryRow(0)

    const positions = Array.from(
      container.querySelectorAll('[data-af-product-position]')
    ).map(el => el.getAttribute('data-af-product-position'))

    expect(positions).toEqual(['1', '2'])
  })

  it('adds pagination offset for direct page loads', () => {
    const { container } = renderGalleryRow(18)

    const positions = Array.from(
      container.querySelectorAll('[data-af-product-position]')
    ).map(el => el.getAttribute('data-af-product-position'))

    expect(positions).toEqual(['19', '20'])
  })

  it('accounts for row index when computing position', () => {
    const { container } = renderGalleryRow(18, { rowIndex: 1 })

    const positions = Array.from(
      container.querySelectorAll('[data-af-product-position]')
    ).map(el => el.getAttribute('data-af-product-position'))

    expect(positions).toEqual(['21', '22'])
  })
})
