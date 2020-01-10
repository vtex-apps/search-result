import classNames from 'classnames'
import React from 'react'
import { FormattedMessage } from 'react-intl'
import { useCssHandles, applyModifiers } from 'vtex.css-handles'

import Collapsible from './Collapsible'
import CategoryFilter from './CategoryFilter'

const CSS_HANDLES = [
  'filter__container',
  'filter',
  'filterTitle',
  'categoriesContainer',
]

const DepartmentFilters = ({
  map,
  title,
  isVisible,
  tree,
  onCategorySelect,
  hideBorder = false,
}) => {
  const handles = useCssHandles(CSS_HANDLES)
  if (!isVisible) {
    return null
  }

  const showAllDepartments = tree.every(category => !category.selected)

  const containerClassName = classNames(
    applyModifiers(handles.filter__container, 'c'),
    { 'bb b--muted-4': !hideBorder }
  )

  return (
    <div className={containerClassName}>
      {title && (
        <div className={classNames(handles.filter, 'pt4')}>
          <div
            className={classNames(
              handles.filterTitle,
              't-mini c-muted-2 flex items-center justify-between'
            )}
          >
            <FormattedMessage id={title} />
          </div>
        </div>
      )}
      <div
        className={classNames(
          handles.categoriesContainer,
          'pb5 flex flex-column'
        )}
      >
        {showAllDepartments ? (
          <Collapsible
            maxItems={8}
            threshold={2}
            items={tree}
            openLabel="store/filter.more-departments"
            render={category => (
              <CategoryFilter
                key={category.id}
                  map={map}
                category={category}
                shallow
                onCategorySelect={onCategorySelect}
              />
            )}
          />
        ) : (
            <CategoryFilter
            map={map}
              category={tree.find(category => category.selected)}
              onCategorySelect={onCategorySelect}
            />
          )}
      </div>
    </div>
  )
}

export default DepartmentFilters
