import React from 'react'
import { Input } from 'vtex.styleguide'
import { useCssHandles } from 'vtex.css-handles'
import { defineMessages, useIntl } from 'react-intl'

const CSS_HANDLES = ['searchFilterBar']

const messages = defineMessages({
  placeholder: {
    id: 'store/search.filter.placeholder',
    defaultMessage: '',
  },
})

interface Props {
  name: string
  handleChange: (value: string) => void
}

export const SearchFilterBar = ({ name, handleChange }: Props) => {
  const handles = useCssHandles(CSS_HANDLES)
  const intl = useIntl()

  return (
    <div className={`${handles.searchFilterBar} mb3`}>
      <Input
        data-testid="filter-search-bar"
        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
          handleChange(e.target.value)
        }
        placeholder={intl.formatMessage(messages.placeholder, {
          filterName: name,
        })}
      />
    </div>
  )
}
