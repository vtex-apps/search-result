import React from 'react'
import { useCssHandles } from 'vtex.css-handles'
import { FormattedMessage } from 'react-intl'

const CSS_HANDLES = ['filterMessage']

const FilterNavigatorTitleTags = ({ filtersTitleTag }) => {
  const handles = useCssHandles(CSS_HANDLES)

  if (filtersTitleTag === 'h1') {
    return (
      <h1 className={`${handles.filterMessage} t-heading-1 mv5`}>
        <FormattedMessage id="store/search-result.filter-button.title" />
      </h1>
    )
  }

  if (filtersTitleTag === 'h2') {
    return (
      <h2 className={`${handles.filterMessage} t-heading-2 mv5`}>
        <FormattedMessage id="store/search-result.filter-button.title" />
      </h2>
    )
  }

  if (filtersTitleTag === 'h3') {
    return (
      <h3 className={`${handles.filterMessage} t-heading-3 mv5`}>
        <FormattedMessage id="store/search-result.filter-button.title" />
      </h3>
    )
  }

  if (filtersTitleTag === 'h4') {
    return (
      <h4 className={`${handles.filterMessage} t-heading-4 mv5`}>
        <FormattedMessage id="store/search-result.filter-button.title" />
      </h4>
    )
  }

  return (
    <h5 className={`${handles.filterMessage} t-heading-5 mv5`}>
      <FormattedMessage id="store/search-result.filter-button.title" />
    </h5>
  )
}

export default FilterNavigatorTitleTags
