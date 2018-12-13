import React, { Component, Fragment } from 'react'
import PropTypes from 'prop-types'
import { Button } from 'vtex.styleguide'
import { FormattedMessage } from 'react-intl'
import classNames from 'classnames'
import { withRuntimeContext, Link } from 'render'
import { flatten, path, identity, contains, find, propEq, union, mergeAll, uniqBy, pick, keys, filter as filterRamda, props, map as mapRamda } from 'ramda'
import SideBar from './components/SideBar'
import ContentLoader from 'react-content-loader'
import FilterIcon from './images/FilterIcon'

import SelectedFilters from './components/SelectedFilters'
import AvailableFilters from './components/AvailableFilters'
import AccordionFilterContainer from './components/AccordionFilterContainer'
import {
  formatCategoriesTree,
  mountOptions,
  formatFacetToLinkPropsParam,
  getMapByType,
} from './constants/SearchHelpers'
import { facetOptionShape, paramShape, hiddenFacetsSchema } from './constants/propTypes'

export const CATEGORIES_TYPE = 'Categories'
export const BRANDS_TYPE = 'Brands'
export const PRICE_RANGES_TYPE = 'PriceRanges'
export const SPECIFICATION_FILTERS_TYPE = 'SpecificationFilters'

const CATEGORIES_TITLE = 'search.filter.title.categories'
const BRANDS_TITLE = 'search.filter.title.brands'
const PRICE_RANGES_TITLE = 'search.filter.title.price-ranges'

/**
 * Wrapper around the filters (selected and available) as well
 * as the popup filters that appear on mobile devices
 */
class FilterNavigator extends Component {
  static propTypes = {
    /** Get the props to pass to render's Link */
    getLinkProps: PropTypes.func.isRequired,
    /** Categories tree */
    tree: PropTypes.arrayOf(facetOptionShape),
    /** Params from pages */
    params: paramShape,
    /** List of brand filters (e.g. Samsung) */
    brands: PropTypes.arrayOf(facetOptionShape),
    /** List of specification filters (e.g. Android 7.0) */
    specificationFilters: PropTypes.arrayOf(
      PropTypes.shape({
        name: PropTypes.string.isRequired,
        facets: PropTypes.arrayOf(facetOptionShape),
      })
    ),
    /** List of price ranges filters (e.g. from-0-to-100) */
    priceRanges: PropTypes.arrayOf(facetOptionShape),
    /** Current price range filter query parameter */
    priceRange: PropTypes.string,
    /** Map query parameter */
    map: PropTypes.string,
    /** Rest query parameter */
    rest: PropTypes.string,
    /** Loading indicator */
    loading: PropTypes.bool,
    ...hiddenFacetsSchema,
  }

  static defaultProps = {
    tree: [],
    specificationFilters: [],
    priceRanges: [],
    brands: [],
    loading: false,
    hiddenFacets: {},
  }

  state = {
    openContent: false,
    filtersChecks: {},
    pagesArgs: {},
  }

  componentDidUpdate(prevProps, prevState) {
    const nonEmptyFilters = this.mapCheckboxFilters(this.filters.filter(spec => spec.options.length > 0))

    if (this.willUpdateFilters(keys(nonEmptyFilters), keys(prevState.filtersChecks))) {
      this.setState({ filtersChecks: nonEmptyFilters })
    }
  }

  willUpdateFilters = (newFilters, prevFilters) => {
    if (newFilters.length !== prevFilters.length) return true
    return !newFilters.every(e => prevFilters.includes(e))
  }

  mapCheckboxFilters = (filters) => {
    const { map, rest } = this.props

    const mapperOption = (isSelected, selectedFilters) => opt => {
      const pagesArgs = formatFacetToLinkPropsParam(opt.type, opt)
      return {
        name: opt.Name,
        ...pagesArgs,
        checked: isSelected || !!find(propEq('Name', opt.Name), selectedFilters),
      }
    }
    
    const filtersAll = [...(filters.map(({ options, type }) => 
      mountOptions(options, type, map, rest).map(
        mapperOption(false, this.selectedFilters))).reduce((current, next) => 
          union(current, next), [])), 
        ...this.selectedFilters.map(mapperOption(true))]
    const finalFilters = uniqBy(pick(['name']), filtersAll)

    return mergeAll(finalFilters.map(({ name, ...rest }) => ({ [name]: rest })))
  }

  handleFilterCheck = (filter) => {
    const { getLinkProps } = this.props
    const filterChecksAux = { ...this.state.filtersChecks }
    filterChecksAux[filter].checked = !filterChecksAux[filter].checked

    this.setState({
      filtersChecks: filterChecksAux,
    })

    const checkedFilters = props(keys(filterRamda(x => x.checked, filterChecksAux)), filterChecksAux)
    const map = checkedFilters.map(opt => getMapByType(opt.type))
    const pagesArgs = getLinkProps(checkedFilters, false, checkedFilters.map(opt => opt.slug), map)
    this.setState({ pagesArgs })
  }

  handleUpdateContentVisibility = () => {
    this.setState({
      openContent: false,
    })
  }

  handleClickButton = event => {
    if (!this.props.hideContent) {
      this.setState({
        openContent: !this.state.openContent,
      })
    }
    event.persist()
  }

  clearFilters = () => {
    const { getLinkProps, runtime: { navigate } } = this.props
    const clearedFilters = { ...this.state.filtersChecks }

    this.setState({ filtersChecks: mapRamda(x => ({ ...x, checked: false }), clearedFilters) })
    const pagesArgs = getLinkProps([])

    const options = {
      page: pagesArgs.page,
      params: pagesArgs.params,
      query: pagesArgs.queryString,
      to: null, scrollOptions: null,
      fallbackToWindowLocation: false,
    }
    navigate(options)
  }

  getAvailableCategories = (showOnlySelected = false) => {
    const { rest, query, map } = this.props
    const categories = this.categories

    let queryParams = query || ''

    if (rest && rest.length > 0) {
      queryParams = `${queryParams}/${rest.replace(/,/g, '/')}`
    }

    const mapArray = map.split(',')

    const categoriesCount = mapArray
      .filter(m => m === getMapByType(CATEGORIES_TYPE))
      .length

    const currentPath = queryParams
      .split('/')
      .filter((_, index) => mapArray[index] === getMapByType(CATEGORIES_TYPE))
      .join('/')

    return categories
      .filter(c => c.level === (showOnlySelected ? categoriesCount - 1 : categoriesCount))
      .filter(c => c.path.toLowerCase().startsWith(currentPath.toLowerCase()))
  }

  get categories() {
    const { tree } = this.props

    if (!tree || tree.length === 0) {
      return []
    }

    return formatCategoriesTree(tree)
  }

  get selectedFilters() {
    const { brands, specificationFilters, priceRanges, map, rest } = this.props

    const categories = this.getAvailableCategories(true)

    const options = [
      ...mountOptions(categories, CATEGORIES_TYPE, map, rest),
      ...specificationFilters.map(spec =>
        mountOptions(spec.facets, SPECIFICATION_FILTERS_TYPE, map, rest)
      ),
      ...mountOptions(brands, BRANDS_TYPE, map, rest),
      ...mountOptions(priceRanges, PRICE_RANGES_TYPE, map, rest),
    ]

    return flatten(options).filter(opt => opt.selected)
  }

  get filters() {
    const {
      specificationFilters = [],
      brands,
      priceRanges,
      hiddenFacets,
    } = this.props

    const categories = this.getAvailableCategories()

    const hiddenFacetsNames = (
      path(['specificationFilters', 'hiddenFilters'], hiddenFacets) || []
    ).map(filter => filter.name)

    const mappedSpecificationFilters = !path(['specificationFilters', 'hideAll'], hiddenFacets)
      ? specificationFilters.filter(
        spec => !contains(spec.name, hiddenFacetsNames)
      ).map(spec => ({
        type: SPECIFICATION_FILTERS_TYPE,
        title: spec.name,
        options: spec.facets,
      }))
      : []

    return [
      !hiddenFacets.categories && {
        type: CATEGORIES_TYPE,
        title: CATEGORIES_TITLE,
        options: categories,
        oneSelectedCollapse: true,
      },
      ...mappedSpecificationFilters,
      !hiddenFacets.brands && {
        type: BRANDS_TYPE,
        title: BRANDS_TITLE,
        options: brands,
      },
      !hiddenFacets.priceRange && {
        type: PRICE_RANGES_TYPE,
        title: PRICE_RANGES_TITLE,
        options: priceRanges,
      },
    ].filter(identity)
  }

  render() {
    const { openContent, pagesArgs, filtersChecks } = this.state
    const {
      priceRange,
      map,
      rest,
      getLinkProps,
      loading,
      runtime: { hints: { mobile } },
    } = this.props

    if (!map || !map.length) {
      return null
    }

    if (loading && !mobile) {
      return (
        <ContentLoader
          style={{
            width: '100%',
            height: '100%',
          }}
          width="267"
          height="320"
          y="0"
          x="0"
        >
          <rect width="100%" height="1em" />
          <rect width="100%" height="8em" y="1.5em" />
          <rect width="100%" height="1em" y="10.5em" />
          <rect width="100%" height="8em" y="12em" />
        </ContentLoader>
      )
    }

    if (mobile) {
      return (
        <Fragment>
          <button
            className={classNames('vtex-filter-popup__button mv0 pointer flex justify-center items-center', {
              'bb b--muted-1': openContent,
              'bn': !openContent,
            })}
            onClick={event => this.handleClickButton(event)}
          >
            <span className="vtex-filter-popup__title c-on-base t-action--small ml-auto">
              <FormattedMessage id="search-result.filter-action.title" />
            </span>
            <span className="vtex-filter-popup__arrow-icon ml-auto pl3 pt2">
              <FilterIcon size={16} active />
            </span>
          </button>

          <SideBar
            onOutsideClick={this.handleUpdateContentVisibility}
            isOpen={openContent}
          >

            <AccordionFilterContainer
              filters={this.filters}
              filtersChecks={filtersChecks}
              onFilterCheck={this.handleFilterCheck}
              selectedFilters={this.selectedFilters}
            />
            <div className="vtex-filter-buttons__box bt b--muted-5 bottom-0 fixed w-100 items-center flex">

              <div className="bottom-0 fl w-50 pl4 pr2">
                <Button block variation="tertiary" size="default" onClick={() => this.clearFilters()}>
                  <FormattedMessage id="search-result.filter-button.clear" />
                </Button>
              </div>
              <div className="bottom-0 fr w-50 pr4 pl2">
                <Link
                  page={pagesArgs.page}
                  params={pagesArgs.params}
                  query={pagesArgs.queryString}
                >
                  <Button block variation="secondary" size="default">
                  <FormattedMessage id="search-result.filter-button.apply" />
                  </Button>
                </Link>
              </div>
            </div>
          </SideBar>
        </Fragment>
      )
    }

    return (
      <Fragment>
        <SelectedFilters
          filters={this.selectedFilters}
          getLinkProps={getLinkProps}
        />
        <AvailableFilters
          getLinkProps={getLinkProps}
          filters={this.filters}
          map={map}
          rest={rest}
          priceRange={priceRange}
        />
      </Fragment>
    )
  }
}

export default withRuntimeContext(FilterNavigator)
