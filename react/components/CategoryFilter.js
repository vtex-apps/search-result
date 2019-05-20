import classNames from 'classnames'
import React from 'react'
import { injectIntl } from 'react-intl'
import { IconClose } from 'vtex.store-icons'

import CategoryItem from './CategoryItem'
import useFacetNavigation from '../hooks/useFacetNavigation'

import styles from '../searchResult.css'

const getSelectedCategories = rootCategory => {
  let node = rootCategory.children
  const selectedCategories = [rootCategory]

  while (node) {
    const category = node.find(category => category.selected)

    if (!category) {
      break
    }

    selectedCategories.push(category)
    node = category.children
  }

  return selectedCategories
}

const CategoryFilter = ({ category, shallow = false }) => {
  const navigateToFacet = useFacetNavigation()

  const selectedCategories = getSelectedCategories(category)

  const handleUnselectCategories = index => {
    const categoriesToRemove = selectedCategories.slice(index)

    navigateToFacet(categoriesToRemove)
  }

  const handleCategoryNameClick = () => {
    if (shallow) {
      navigateToFacet(category)
    } else {
      // deselect root category
      handleUnselectCategories(0)
    }
  }

  const lastSelectedCategory = selectedCategories[selectedCategories.length - 1]

  return (
    <div className="mt4">
      <div
        role="button"
        tabIndex={0}
        className="flex items-center pointer"
        onClick={handleCategoryNameClick}
        onKeyDown={e => e.key === 'Enter' && handleCategoryNameClick()}
      >
        <div className="flex-grow-1">
          <span className={classNames(styles.categoryItemName, 'f5')}>
            {category.name}
          </span>
        </div>
        {!shallow && (
          <span
            className={classNames(
              styles.selectedCategoryIcon,
              'flex items-center c-action-primary'
            )}
          >
            <IconClose type="outline" size={14} />
          </span>
        )}
      </div>
      <div className={styles.categoryItemChildrenContainer}>
        {selectedCategories.slice(1).map((subCategory, index) => (
          <span
            key={subCategory.id}
            role="button"
            tabIndex={0}
            className={classNames(
              styles.selectedCategory,
              'mt4 flex items-center justify-between pointer f6'
            )}
            onClick={() => handleUnselectCategories(index + 1)}
            onKeyDown={e =>
              e.key === 'Enter' && handleUnselectCategories(index + 1)
            }
          >
            <span className={styles.selectedCategoryName}>
              {subCategory.name}
            </span>
            <span
              className={classNames(
                styles.selectedCategoryIcon,
                'flex items-center c-action-primary'
              )}
            >
              <IconClose type="outline" size={14} />
            </span>
          </span>
        ))}
        {lastSelectedCategory.children &&
          lastSelectedCategory.children.length > 0 && (
            <div
              className={classNames({
                'mt4 bl b--muted-4': !shallow,
                mt2: shallow,
              })}
            >
              {lastSelectedCategory.children.map((childCategory, index) => (
                <CategoryItem
                  key={childCategory.id}
                  className={classNames({
                    mt2: index === 0 && !shallow,
                  })}
                  onClick={() =>
                    navigateToFacet(
                      shallow ? [category, childCategory] : childCategory
                    )
                  }
                  label={childCategory.name}
                />
              ))}
            </div>
          )}
      </div>
    </div>
  )
}

export default injectIntl(CategoryFilter)
