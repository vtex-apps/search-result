import React from 'react'
import { defineMessages, injectIntl } from 'react-intl'
import { Input } from 'vtex.styleguide'

const messages = defineMessages({
  searchPlaceHolder: {
    id: 'store/search.filter.search-placeholder',
    defaultMessage: '',
  },
})

const SearchFilterBar = ({ title, handleChange, intl }) => {
  return (
    <Input
      onChange={e => handleChange(e.target.value.toLowerCase())}
      placeholder={intl.formatMessage(messages.searchPlaceHolder, {
        filterName: title,
      })}
    />
  )
}

export default injectIntl(SearchFilterBar)
