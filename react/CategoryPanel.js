import React, { Fragment } from 'react'
import classNames from 'classnames'
import PropTypes from 'prop-types'
import { Link } from 'vtex.render-runtime'
import { facetOptionShape } from './constants/propTypes'
import searchResult from './searchResult.css'
import CategoriesHighlights from 'vtex.store-components/CategoriesHighlights'

const renderCategoryShelf = (category, noOfChildren, quantityOfItemsPerRow) => {
  const categoriesHighlighted = category.children
    .slice(0, noOfChildren)
    .map(child => ({
      id: child.id,
      name: child.name,
      to: child.link,
    }))
  const headerClasses = classNames(
    searchResult.categoryPanelHeaderRow,
    'flex flex-row flex-wrap items-stretch pa3 bn mh4-ns'
  )
  const itemClasses = classNames(
    searchResult.categoryPanelItemRow,
    'flex flex-row flex-wrap items-stretch pa3 bn mh4-ns'
  )
  let i = 0
  const items = []
  for (i = 0; i < categoriesHighlighted.length; i += quantityOfItemsPerRow) {
    items.push(categoriesHighlighted.slice(i, i + quantityOfItemsPerRow))
  }
  return (
    <Fragment key={`parent-fragment-${category.id}`}>
      <h3 className={`t-heading-3 ${headerClasses}`}>
        <Link to={category.link}>{category.name}</Link>
      </h3>
      {items.length > 0 &&
        items.map((item, index) => (
          <div key={`category-row-${index}`} className={itemClasses}>
            <CategoriesHighlights
              categoriesHighlighted={item}
              showCategoriesHighlighted
              quantityOfItems={quantityOfItemsPerRow}
            />
          </div>
        ))}
      {category.children.map(child => {
        if (child.children && child.children.length > 0) {
          return renderCategoryShelf(child, noOfChildren, quantityOfItemsPerRow)
        }
      })}
    </Fragment>
  )
}

const CategoryPanel = ({ tree, noOfCategories, quantityOfItemsPerRow }) => {
  return (
    <div>
      {tree.map(category => {
        return renderCategoryShelf(
          category,
          noOfCategories,
          quantityOfItemsPerRow
        )
      })}
    </div>
  )
}

CategoryPanel.propTypes = {
  /** Category tree */
  tree: PropTypes.arrayOf(facetOptionShape),
  /** Number of category filters to be shown */
  noOfCategories: PropTypes.number,
  /** Number of categories per row */
  quantityOfItemsPerRow: PropTypes.number,
}

CategoryPanel.defaultProps = {
  tree: [],
  noOfCategories: 1000,
  quantityOfItemsPerRow: 4,
}

export default CategoryPanel
