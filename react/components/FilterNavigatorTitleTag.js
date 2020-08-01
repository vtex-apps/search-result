import React from 'react'
import { useCssHandles } from 'vtex.css-handles'
import { FormattedMessage } from 'react-intl'

const CSS_HANDLES = ['filterMessage']

const FilterNavigatorTitleTags = ({ filtersTitleTag }) => {
  const handles = useCssHandles(CSS_HANDLES)
  const CustomTag = filtersTitleTag

  if (CustomTag && filtersTitleTag !== 'h5') {
    return (
      <CustomTag className={`${handles.filterMessage} mv5`}>
        <FormattedMessage id="store/search-result.filter-button.title" />
      </CustomTag>
    )
  }

  return (
    <h5 className={`${handles.filterMessage} t-heading-5 mv5`}>
      <FormattedMessage id="store/search-result.filter-button.title" />
    </h5>
  )
}

export default FilterNavigatorTitleTags
