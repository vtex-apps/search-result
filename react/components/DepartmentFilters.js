import classNames from 'classnames'
import React from 'react'
import { FormattedMessage } from 'react-intl'

import Collapsible from './Collapsible'
import CategoryFilter from './CategoryFilter'

import styles from '../searchResult.css'

const DepartmentFilters = ({
  title,
  isVisible,
  tree,
  onCategorySelect,
  hideBorder = false,
}) => {
  if (!isVisible) {
    return null
  }

  const showAllDepartments = tree.every(category => !category.selected)

  return (
    <div className={classNames({ 'bb b--muted-4': !hideBorder })}>
      {title && (
        <div className={classNames(styles.filter, 'pt4')}>
          <div
            className={classNames(
              styles.filterTitle,
              't-mini c-muted-2 flex items-center justify-between'
            )}
          >
            <FormattedMessage id={title} />
          </div>
        </div>
      )}
      <div
        className={classNames(
          styles.selectedCategoriesContainer,
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
                category={category}
                shallow
                onCategorySelect={onCategorySelect}
              />
            )}
          />
        ) : (
          <CategoryFilter
            category={tree.find(category => category.selected)}
            onCategorySelect={onCategorySelect}
          />
        )}
      </div>
    </div>
  )
}

export default DepartmentFilters
