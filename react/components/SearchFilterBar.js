import React from 'react'
import { defineMessages, injectIntl } from 'react-intl'
import { Input } from 'vtex.styleguide'
import classNames from 'classnames'
import { useCssHandles } from 'vtex.css-handles'

const CSS_HANDLES = ['filterSearch']

const messages = defineMessages({
  searchPlaceHolder: {
    id: 'store/search.filter.search-placeholder',
    defaultMessage: '',
  },
})

const SearchFilterBar = ({ title, handleChange, intl }) => {
  const handles = useCssHandles(CSS_HANDLES)

  return (
    <div className={classNames('mb3', handles.filterSearch)}>
      <Input
        onChange={e => handleChange(e.target.value.toLowerCase())}
        placeholder={intl.formatMessage(messages.searchPlaceHolder, {
          filterName: title,
        })}
      />
    </div>
  )
}

export default injectIntl(SearchFilterBar)
