import React from 'react'
import { useCssHandles } from 'vtex.css-handles'
import { FormattedMessage } from 'react-intl'

const CSS_HANDLES = ['filterMessage']

const FilterNavigatorTitleTags = ({ filtersTitleHtmlTag = 'h5' }) => {
  const handles = useCssHandles(CSS_HANDLES)
  const CustomTag = filtersTitleHtmlTag

  return (
    <CustomTag
      className={`${handles.filterMessage} ${
        filtersTitleHtmlTag === 'h5' ? 't-heading-5' : ''
      } mv5`}
    >
      <FormattedMessage id="store/search-result.filter-button.title" />
    </CustomTag>
  )
}

export default FilterNavigatorTitleTags
