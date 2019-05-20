import classNames from 'classnames'
import React, { useState, useCallback, useContext } from 'react'
import { injectIntl } from 'react-intl'
import { Collapsible } from 'vtex.styleguide'
import { IconClose } from 'vtex.store-icons'

import CategoryItem from './CategoryItem'
import QueryContext from './QueryContext'
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

const CategoryFilter = ({ category, shallow = false, intl }) => {
  const [isOpen, setOpen] = useState(true)
  const { map } = useContext(QueryContext)

  const shouldShowSeeAll = map.split(',').includes('ft') && !shallow

  const handleClick = useCallback(() => {
    setOpen(prevOpen => !prevOpen)
  }, [])

  const navigateToFacet = useFacetNavigation()

  const selectedCategories = getSelectedCategories(category)

  const handleUnselectCategories = index => {
    const startIndex = shouldShowSeeAll ? index : index + 1
    const categoriesToRemove = selectedCategories.slice(startIndex)

    navigateToFacet(categoriesToRemove)
  }

  const lastSelectedCategory = selectedCategories[selectedCategories.length - 1]

  const seeAllLabel = intl.formatMessage({
    id: 'store/search-result.filter.see-all',
  })

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
          {selectedCategories
            .slice(shouldShowSeeAll ? 0 : 1)
            .map((subCategory, index) => (
              <span
                key={subCategory.id}
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
                  {subCategory.name === category.name
                    ? seeAllLabel
                    : subCategory.name}
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
              label={seeAllLabel}
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

export default injectIntl(CategoryFilter)
