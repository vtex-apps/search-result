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
  title,
  isVisible,
  tree,
  onCategorySelect,
  hideBorder = false,
  preventRouteChange,
  maxItemsDepartment,
  maxItemsCategory,
  categoryFiltersMode
}) => {
  const handles = useCssHandles(CSS_HANDLES)
  if (!isVisible || tree.length === 0) {
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
            maxItems={maxItemsDepartment}
            threshold={2}
            items={tree}
            openLabel="store/filter.more-departments"
            render={category => (
              <CategoryFilter
                key={category.id}
                category={category}
                shallow
                onCategorySelect={onCategorySelect}
                preventRouteChange={preventRouteChange}
                maxItemsCategory={maxItemsCategory}
                categoryFiltersMode={categoryFiltersMode}
              />
            )}
          />
        ) : (
          <CategoryFilter
            category={tree.find(category => category.selected)}
            onCategorySelect={onCategorySelect}
            preventRouteChange={preventRouteChange}
            maxItemsCategory={maxItemsCategory}
            categoryFiltersMode={categoryFiltersMode}
          />
        )}
      </div>
    </div>
  )
}

export default DepartmentFilters
