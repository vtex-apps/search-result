import React from 'react'
import SearchResultFlexible from './SearchResultFlexible'

const SearchResultFlexibleMobile = props => {
  return <SearchResultFlexible {...props} />
}

SearchResultFlexibleMobile.schema = {
  title: 'admin/editor.search-result-mobile.title',
}

export default SearchResultFlexibleMobile
