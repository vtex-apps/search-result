import React from 'react'

export const useCssHandles = cssHandles => {
  const handles = {}

  cssHandles.forEach(handle => {
    handles[handle] = handle
  })

  return handles
}

export function applyModifiers(baseClass, modifier) {
  if (modifier instanceof Array) modifier = modifier.filter(item => !!item)

  return `${baseClass} ${baseClass}--${modifier}`
}

export const withCssHandles = () => Comp => {
  // eslint-disable-next-line react/prefer-stateless-function
  return class extends React.Component {
    static displayName = 'withCssHandles'
    render() {
      return <Comp cssHandles={{}} {...this.props} />
    }
  }
}
