import React, { useEffect, useState } from 'react'
import { InputCurrency, Button } from 'vtex.styleguide'
import { useRuntime } from 'vtex.render-runtime'
import { useCssHandles } from 'vtex.css-handles'
import { FormattedMessage } from 'react-intl'

const CSS_HANDLES = [
  'priceRangeInputWrapper',
  'priceRangeInput',
  'priceRangeInputButton',
]

const PriceRangeInput = ({ defaultValues, onSubmit, min, max }) => {
  const handles = useCssHandles(CSS_HANDLES)
  const { culture } = useRuntime()

  const [defaultLeft, defaultRight] = defaultValues

  const [values, setValues] = useState({
    left: defaultLeft,
    right: defaultRight,
  })

  useEffect(() => setValues({ left: defaultLeft, right: defaultRight }), [
    defaultLeft,
    defaultRight,
  ])

  const handleChange = (name) => (e) => {
    const { value } = e.target

    if (name === 'min') {
      setValues((currentValues) => ({
        ...currentValues,
        left: parseFloat(value),
      }))
    } else {
      setValues((currentValues) => ({
        ...currentValues,
        right: parseFloat(value),
      }))
    }
  }

  const handleSubmit = () => {
    const { left: leftValue, right: rightValue } = values
    const left = Math.max(Math.min(leftValue, rightValue), min)
    const right = Math.min(Math.max(leftValue, rightValue), max)

    setValues({
      left,
      right,
    })

    const definedValues = [left, right]

    onSubmit(definedValues)
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSubmit()
    }
  }

  return (
    <div className={`${handles.priceRangeInputWrapper} flex justify-between`}>
      <div className={`${handles.priceRangeInput} mr2`}>
        <InputCurrency
          name="min"
          size="small"
          currencyCode={culture.currency}
          locale={culture.locale}
          value={values.left}
          onChange={handleChange('min')}
          onKeyDown={handleKeyDown}
        />
      </div>
      <div className={`${handles.priceRangeInput} mr2`}>
        <InputCurrency
          name="max"
          size="small"
          currencyCode={culture.currency}
          locale={culture.locale}
          value={values.right}
          onChange={handleChange('max')}
          onKeyDown={handleKeyDown}
        />
      </div>
      <Button
        className={handles.priceRangeInputButton}
        onClick={handleSubmit}
        size="small"
      >
        <FormattedMessage id="store/search-result.price-ranges.submit" />
      </Button>
    </div>
  )
}

export default PriceRangeInput
