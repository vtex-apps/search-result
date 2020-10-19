import classNames from 'classnames'
import React from 'react'
import { useCssHandles } from 'vtex.css-handles'

const CSS_HANDLES = ['categoryItemChildren']

const CategoryItem = ({ label, onClick, className, href }) => {
  const handles = useCssHandles(CSS_HANDLES)

  return (
    <a
      tabIndex={0}
      className={classNames(
        handles.categoryItemChildren,
        'ph5 ph3-ns pv5 pv1-ns lh-copy pointer hover-bg-muted-5 c-muted-1 db no-underline',
        className
      )}
      onClick={e => {
        e.preventDefault()
        onClick()
      }}
      href={href && href.toLowerCase()}
      title={label}
      onKeyDown={e => e.key === 'Enter' && onClick(e)}
    >
      {label}
    </a>
  )
}

export default CategoryItem
