import React, { Component, Fragment } from 'react'
import classNames from 'classnames'
import PropTypes from 'prop-types'
import { Link } from 'vtex.render-runtime'
import { facetOptionShape } from './constants/propTypes'
import searchResult from './searchResult.css'
import CategoriesHighlights from 'vtex.store-components/CategoriesHighlights'

class CategoryPanel extends Component {
  static propTypes = {
    /** Category tree */
    tree: PropTypes.arrayOf(facetOptionShape),
    /** Number of category filters to be shown */
    noOfCategories: PropTypes.number,
    /** Number of categories per row */
    quantityOfItemsPerRow: PropTypes.number,
  }

  static defaultProps = {
    tree: [],
    noOfCategories: 1000,
    quantityOfItemsPerRow: 4,
  }

  renderCategoryShelf = (
    category,
    noOfChildren,
    quantityOfItemsPerRow
  ) => {
    const categoriesHighlighted = category.Children.slice(0, noOfChildren).map(
      child => ({
        id: child.Id,
        name: child.Name,
        to: child.Link,
      })
    )
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
      <Fragment key={`parent-fragment-${category.Id}`}>
        <h3 className={`t-heading-3 ${headerClasses}`}>
          <Link to={category.Link}>{category.Name}</Link>
        </h3>
        {items.length > 0 &&
          items.map((item, index) => (
            <div key={`category-row-${index}`} className={itemClasses}>
              <CategoriesHighlights
                categoriesHighlighted={item}
                showCategoriesHighlighted={true}
                quantityOfItems={quantityOfItemsPerRow}
              />
            </div>
          ))}
        {category.Children.map(child => {
          if (child.Children && child.Children.length > 0) {
            return this.renderCategoryShelf(child, noOfChildren, quantityOfItemsPerRow)
          }
        })}
      </Fragment>
    )
  }

  render() {
    const { tree, noOfCategories, quantityOfItemsPerRow } = this.props

    return (
      <div>
        {tree.map(category => {
          return this.renderCategoryShelf(
            category,
            noOfCategories,
            quantityOfItemsPerRow
          )
        })}
      </div>
    )
  }
}

export default CategoryPanel
