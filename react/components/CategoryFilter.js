import classNames from 'classnames'
import React, { useState, useCallback } from 'react'
import { Collapsible } from 'vtex.styleguide'
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
  const [isOpen, setOpen] = useState(true)

  const handleClick = useCallback(() => {
    setOpen(prevOpen => !prevOpen)
  }, [])

  const navigateToFacet = useFacetNavigation()

  const selectedCategories = getSelectedCategories(category)

  const handleUnselectCategories = index => {
    const categoriesToRemove = selectedCategories.slice(index + 1)

    navigateToFacet(categoriesToRemove)
  }

  const lastSelectedCategory = selectedCategories[selectedCategories.length - 1]

  return (
    <div className="mt4">
      <Collapsible
        align="right"
        caretColor="muted"
        header={
          <span className={classNames(styles.categoryItemName, 'f5')}>
            {category.name}
          </span>
        }
        isOpen={isOpen}
        onClick={handleClick}
      >
        <div className={classNames(styles.categoryItemChildrenContainer)}>
          {selectedCategories.slice(1).map((category, index) => (
            <span
              key={category.id}
              role="button"
              tabIndex={0}
              className={classNames(
                styles.selectedCategory,
                'mt4 flex items-center justify-between pointer f6'
              )}
              onClick={() => handleUnselectCategories(index)}
              onKeyDown={e =>
                e.key === 'Enter' && handleUnselectCategories(index)
              }
            >
              <span className={styles.selectedCategoryName}>
                {category.name}
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
          {shallow && (
            <CategoryItem
              label="See All"
              onClick={() => navigateToFacet(category)}
              className="mt2"
            />
          )}
          {lastSelectedCategory.children &&
            lastSelectedCategory.children.length > 0 && (
              <div className={classNames({ ['mt4 bl b--muted-4']: !shallow })}>
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
      </Collapsible>
    </div>
  )
}

export default CategoryFilter
