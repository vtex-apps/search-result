import classNames from 'classnames'
import React from 'react'
import { FormattedMessage } from 'react-intl'

import Collapsible from './Collapsible'
import CategoryFilter from './CategoryFilter'

import styles from '../searchResult.css'

const DepartmentFilters = ({ title, isVisible, tree }) => {
  if (!isVisible) {
    return null
  }

  const showAllDepartments = tree.every(category => !category.selected)

  return (
    <div className="bb b--muted-4">
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
      <div
        className={classNames(
          styles.selectedCategoriesContainer,
          'pb5 flex flex-column'
        )}
      >
        {showAllDepartments ? (
          <Collapsible
            maxItems={5}
            threshold={3}
            items={tree}
            openLabel="store/filter.more-departments"
            render={category => (
              <CategoryFilter key={category.id} category={category} shallow />
            )}
          />
        ) : (
          <CategoryFilter category={tree.find(category => category.selected)} />
        )}
      </div>
    </div>
  )
}

export default DepartmentFilters
