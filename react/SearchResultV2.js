import React from 'react'
import { SearchBreadcrumb } from 'vtex.breadcrumb'
import { useDevice } from 'vtex.device-detector'
import { FlexLayout, Col } from 'vtex.flex-layout'

import { path, compose, equals, pathOr, isEmpty } from 'ramda'
import FetchMore from './FetchMore'
import FetchPrevious from './FetchPrevious'
import FilterNavigatorFlexible from './FilterNavigatorFlexible'
import Gallery from './Gallery'
import NotFoundLayout from './NotFoundLayout'
import NotFoundSearch from './NotFoundSearch'
import OrderByFlexible from './OrderByFlexible'
import SearchContent from './SearchContent'
import SearchResultFlexible from './SearchResultFlexible'
import SearchResultFlexibleMobile from './SearchResultFlexibleMobile'
import SearchTitleFlexible from './SearchTitleFlexible'
import TotalProductsFlexible from './TotalProductsFlexible'
import LayoutModeSwitcherFlexible from './LayoutModeSwitcherFlexible'

const noProducts = compose(
  isEmpty,
  pathOr([], ['data', 'productSearch', 'products'])
)

const isFtOnly = compose(
  equals('ft'),
  path(['variables', 'map'])
)

const foundNothing = searchQuery => {
  const { loading } = searchQuery || {}
  return isFtOnly(searchQuery) && !loading && noProducts(searchQuery)
}

const SearchResult = props => {
  console.log('props', props)
  const { searchQuery } = props
  const { isMobile } = useDevice()

  if (foundNothing(searchQuery)) {
    return (
      <NotFoundLayout {...props}>
        <FlexLayout preserveLayoutOnMobile fullWidth>
          <SearchBreadcrumb />
        </FlexLayout>
        <FlexLayout>
          <NotFoundSearch />
        </FlexLayout>
      </NotFoundLayout>
    )
  }

  if (isMobile) {
    return (
      <SearchResultFlexibleMobile {...props}>
        <FlexLayout preserveLayoutOnMobile colSizing="auto" colJustify="around">
          <Col blockClass="orderByMobileCol">
            <OrderByFlexible />
          </Col>
          <Col blockClass="filterMobileCol">
            <FilterNavigatorFlexible />
          </Col>
          <Col blockClass="switcherMobileCol">
            <LayoutModeSwitcherFlexible />
          </Col>
        </FlexLayout>
        <FlexLayout preserveLayoutOnMobile fullWidth>
          <SearchBreadcrumb />
        </FlexLayout>
        <FlexLayout blockClass="productCountMobileRow">
          <TotalProductsFlexible />
        </FlexLayout>
        <FlexLayout preserveLayoutOnMobile>
          <SearchContent>
            <Gallery />
            <NotFoundSearch />
          </SearchContent>
        </FlexLayout>
      </SearchResultFlexibleMobile>
    )
  }

  return (
    <SearchResultFlexible {...props}>
      <FlexLayout preserveLayoutOnMobile fullWidth>
        <SearchBreadcrumb />
      </FlexLayout>
      <FlexLayout>
        <SearchTitleFlexible />
      </FlexLayout>
      <FlexLayout preventHorizontalStretch fullWidth>
        <Col blockClass="filterCol">
          <FilterNavigatorFlexible />
        </Col>
        <Col width="grow">
          <FlexLayout>
            <Col blockClass="productCountCol">
              <TotalProductsFlexible />
            </Col>
            <Col blockClass="orderByCol">
              <OrderByFlexible />
            </Col>
          </FlexLayout>
          <FlexLayout marginBottom={3}>
            <FetchPrevious />
          </FlexLayout>
          <FlexLayout>
            <SearchContent>
              <Gallery />
              <NotFoundSearch />
            </SearchContent>
          </FlexLayout>
          <FlexLayout marginTop={3}>
            <FetchMore />
          </FlexLayout>
        </Col>
      </FlexLayout>
    </SearchResultFlexible>
  )
}

export default SearchResult
