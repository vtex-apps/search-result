import classNames from 'classnames'
import React from 'react'
import { FormattedMessage } from 'react-intl'
import { NoSSR } from 'vtex.render-runtime'

import Collapsible from './Collapsible'
import CategoryFilter from './CategoryFilter'

import styles from '../searchResult.css'

const DepartmentFilters = ({
  title,
  isVisible,
  tree,
  onCategorySelect,
  preventRouteChange = false,
  hideBorder = false,
}) => {
  if (!isVisible) {
    return null
  }

  const showAllDepartments = tree.every(category => !category.selected)

  const containerClassName = classNames(
    styles['filter__container'],
    styles['filter__container'] + '--c',
    { 'bb b--muted-4': !hideBorder }
  )

  return (
    <div className={containerClassName}>
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
          styles.categoriesContainer,
          'pb5 flex flex-column'
        )}
      >
        {showAllDepartments ? (
          <NoSSR>
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
                  preventRouteChange={preventRouteChange}
                />
              )}
            />
          </NoSSR>
        ) : (
          <CategoryFilter
            category={tree.find(category => category.selected)}
            onCategorySelect={onCategorySelect}
            preventRouteChange={preventRouteChange}
          />
        )}
      </div>
    </div>
  )
}

export default DepartmentFilters
