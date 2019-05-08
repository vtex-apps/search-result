import classNames from 'classnames'
import { zip } from 'ramda'
import React, { useContext } from 'react'
import { FormattedMessage } from 'react-intl'
import { IconCaret } from 'vtex.store-icons'

import QueryContext from './QueryContext'
import CategoryItem from './CategoryItem'
import useFacetNavigation from '../hooks/useFacetNavigation'

import styles from '../searchResult.css'

const getCategoryWithName = (name, categoryList) => {
  return categoryList.find(
    category =>
      decodeURIComponent(category.value).toLowerCase() ===
      decodeURIComponent(name).toLowerCase()
  )
}

const mapSelectedCategories = (tree, categoriesQuery) => {
  let node = undefined

  const selectedCategories = categoriesQuery.map(categoryName => {
    if (!node) {
      node = getCategoryWithName(categoryName, tree)
    } else {
      node = getCategoryWithName(categoryName, node.children)
    }

    return node
  })

  if (selectedCategories.every(Boolean)) {
    return selectedCategories
  }

  return []
}

const CategoryFilters = ({ title, isVisible, tree }) => {
  const { facetMap, facetQuery } = useContext(QueryContext)

  const categoriesQuery = zip(facetMap.split(','), facetQuery.split('/'))
    .filter(([map]) => map === 'c')
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    .map(([_, query]) => query)

  const navigateToFacet = useFacetNavigation()

  if (!isVisible) {
    return null
  }

  const selectedCategories = mapSelectedCategories(tree, categoriesQuery)

  const handleUnselectCategories = index => {
    const categoriesToRemove = selectedCategories.slice(index + 1)

    navigateToFacet(categoriesToRemove)
  }

  return (
    <div className="bb b--muted-4 pv5 flex flex-column">
      <div className={classNames(styles.filter, 'pb5')}>
        <span
          className={classNames(
            styles.filterTitle,
            't-heading-6 flex items-center justify-between'
          )}
        >
          <FormattedMessage id={title} />
        </span>
      </div>
      {selectedCategories.length > 1 &&
        selectedCategories
          .slice(0, selectedCategories.length - 1)
          .map((category, index) => (
            <span
              key={category.id}
              role="button"
              tabIndex={0}
              className="mb3 flex items-center c-muted-2 pointer"
              onClick={() => handleUnselectCategories(index)}
              onKeyDown={e =>
                e.key === 'Enter' && handleUnselectCategories(index)
              }
            >
              <span className="flex items-center mr3 c-muted-3">
                <IconCaret orientation="left" size={14} />
              </span>
              {category.name}
            </span>
          ))}
      {selectedCategories.length > 0 ? (
        <CategoryItem
          category={selectedCategories[selectedCategories.length - 1]}
        />
      ) : (
        tree.map(category => (
          <CategoryItem key={category.id} category={category} shallow />
        ))
      )}
    </div>
  )
}

export default CategoryFilters
