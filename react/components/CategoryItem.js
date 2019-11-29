import classNames from 'classnames'
import React from 'react'
import { useCssHandles } from 'vtex.css-handles'

const CSS_HANDLES = ['categoryItemChildren']

const CategoryItem = ({ label, onClick, className }) => {
  const handles = useCssHandles(CSS_HANDLES)
  return (
    <div
      tabIndex={0}
      role="link"
      className={classNames(
        handles.categoryItemChildren,
        'ph5 ph3-ns pv5 pv1-ns lh-copy pointer hover-bg-muted-5 c-muted-1',
        className
      )}
      onClick={onClick}
      onKeyDown={e => e.key === 'Enter' && onClick(e)}
    >
      {label}
    </div>
  )
}

export default CategoryItem
