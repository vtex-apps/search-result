import React, { Fragment } from 'react'
import { useRuntime } from 'vtex.render-runtime'
import { useIntl } from 'react-intl'

export function formatCurrency({ intl, culture, value }) {
  return intl.formatNumber(value, {
    style: 'currency',
    currency: culture.currency,
    ...(culture.customCurrencyDecimalDigits != null
      ? { minimumFractionDigits: culture.customCurrencyDecimalDigits }
      : {}),
  })
}

export function FormattedCurrency({ value }) {
  const { culture } = useRuntime()
  const intl = useIntl()

  const number = intl.formatNumber(value, {
    style: 'currency',
    currency: culture.currency,
    ...(culture.customCurrencyDecimalDigits != null
      ? { minimumFractionDigits: culture.customCurrencyDecimalDigits }
      : {}),
  })

  return <Fragment>{number}</Fragment>
}
