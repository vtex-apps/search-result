import PropTypes from 'prop-types'
import { pluck } from 'ramda'
import { LAYOUT_MODE } from '../components/LayoutModeSwitcher'

export const paramShape = PropTypes.shape({
  /** Department of the page */
  department: PropTypes.string,
  /** Category of the page */
  category: PropTypes.string,
  /** Subcategory of the page */
  subcategory: PropTypes.string,
  /** Search term */
  term: PropTypes.string,
})

export const facetOptionShape = PropTypes.shape({
  /** Quantity of products matched with the facet option. */
  quantity: PropTypes.number.isRequired,
  /** Link of the facets option. */
  link: PropTypes.string.isRequired,
  /** Name of the facet option. */
  name: PropTypes.string.isRequired,
})

export const facetQueryArgsShape = PropTypes.shape({
  /** Search query field */
  query: PropTypes.string.isRequired,
  /** Search map field */
  map: PropTypes.string,
})

export const productShape = PropTypes.shape({
  /** Product's id. */
  productId: PropTypes.string.isRequired,
  /** Product's name. */
  productName: PropTypes.string.isRequired,
  /** Product's description. */
  description: PropTypes.string.isRequired,
  /** Product's categories. */
  categories: PropTypes.array,
  /** Product's link. */
  link: PropTypes.string,
  /** Product's link text. */
  linkText: PropTypes.string.isRequired,
  /** Product's brand. */
  brand: PropTypes.string,
  /** Product's SKU items. */
  items: PropTypes.arrayOf(
    PropTypes.shape({
      /** SKU's id. */
      itemId: PropTypes.string.isRequired,
      /** SKU's name. */
      name: PropTypes.string.isRequired,
      /** SKU's referenceId. */
      referenceId: PropTypes.arrayOf(
        PropTypes.shape({
          /** ReferenceId's value. */
          Value: PropTypes.string.isRequired,
        })
      ),
      /** SKU's images. */
      images: PropTypes.arrayOf(
        PropTypes.shape({
          /** Images's imageUrl. */
          imageUrl: PropTypes.string.isRequired,
          /** Images's imageTag. */
          imageTag: PropTypes.string.isRequired,
        })
      ).isRequired,
      /** SKU's sellers. */
      sellers: PropTypes.arrayOf(
        PropTypes.shape({
          /** Sellers's commertialOffer. */
          commertialOffer: PropTypes.shape({
            /** CommertialOffer's price. */
            Price: PropTypes.number.isRequired,
            /** CommertialOffer's list price. */
            ListPrice: PropTypes.number.isRequired,
          }).isRequired,
        })
      ).isRequired,
    })
  ).isRequired,
})

export const facetsShape = PropTypes.shape({
  /** Departments matched with the facets. */
  departments: PropTypes.arrayOf(facetOptionShape),
  /** Brands matched with the facets. */
  brands: PropTypes.arrayOf(facetOptionShape),
  /** SpecificationFilters matched with the facets. */
  specificationFilters: PropTypes.arrayOf(
    PropTypes.shape({
      /** SpecificationFilter's name. */
      name: PropTypes.string.isRequired,
      /** SpecificationFilter's facets. */
      facets: PropTypes.arrayOf(facetOptionShape),
    })
  ),
  /** Categories matched with the facets. */
  categoriesTrees: PropTypes.arrayOf(
    PropTypes.shape({
      /** Category's name. */
      name: PropTypes.string.isRequired,
      /** Category's quantity. */
      quantity: PropTypes.number.isRequired,
      /** Array of SubCategories. */
      children: PropTypes.arrayOf(facetOptionShape),
    })
  ),
})

export const searchQueryShape = PropTypes.shape({
  /** Facets resulting by the search. */
  facets: facetsShape,
  /** Products resulting by the search.  */
  products: PropTypes.arrayOf(productShape),
  /** Records filtered by the search. */
  recordsFiltered: PropTypes.number,
})

export const queryShape = PropTypes.shape({
  /** Determines the types of the terms, e.g: "c,c,b" (category, category, brand). */
  map: PropTypes.string,
  /** Current ordenation. */
  order: PropTypes.string,
  /** Current page number. */
  page: PropTypes.string,
  /**
   * Current price range filtering, e.g. "0 TO 1000" (meaning the result
   * is filtered with the price starting at 0 and ending at 1000)
   */
  priceRange: PropTypes.string,
})

export const hiddenFacetsSchema = {
  /** Indicates which facets will be hidden */
  hiddenFacets: PropTypes.shape({
    /** Determines if the brands facets will be hidden */
    brands: PropTypes.bool,
    /** Determines if the categories facets will be hidden */
    categories: PropTypes.bool,
    /** Determines if the price range will be hidden */
    priceRange: PropTypes.bool,
    /** Hidden specification filters facets configuration */
    specificationFilters: PropTypes.shape({
      /** Determines if all the specification filters facets will be hidden */
      hideAll: PropTypes.bool,
      /** Array of specific hidden filters */
      hiddenFilters: PropTypes.arrayOf(
        PropTypes.shape({
          /** Name of the hidden filter */
          name: PropTypes.string,
        })
      ),
    }),
  }),
}

export const schemaPropsTypes = {
  /** Maximum number of items per page. */
  maxItemsPerPage: PropTypes.number,
  /** Product Summary's props */
  summary: PropTypes.any,
  ...hiddenFacetsSchema,
}

export const searchResultContainerPropTypes = {
  /** Internal route path. e.g: 'store.search' */
  pagesPath: PropTypes.string,
  /** Internal route params.
   * e.g: { department: 'eletronics', category: 'smartphones' }
   */
  params: PropTypes.object,
  /** Map param. e.g: c,c */
  map: PropTypes.string,
  /** Search result page. */
  page: PropTypes.number,
  /** Search result ordernation. */
  orderBy: PropTypes.string,
  /** Price range filter */
  priceRange: PropTypes.string,
  /** Search graphql query. */
  searchQuery: searchQueryShape,
  ...schemaPropsTypes,
}

export const searchResultPropTypes = {
  breadcrumbsProps: PropTypes.shape({
    categories: PropTypes.array,
    term: PropTypes.string,
  }),
  /** Number of items available according to the filters */
  recordsFiltered: PropTypes.number.isRequired,
  /** List of brands available */
  brands: PropTypes.array.isRequired,
  /** Map param. e.g: c,c */
  map: PropTypes.string,
  params: PropTypes.object,
  /** Price range filter */
  priceRange: PropTypes.string,
  /** List of price ranges filter */
  priceRanges: PropTypes.array.isRequired,
  /** Hidden specification filters facets configuration */
  specificationFilters: PropTypes.array.isRequired,
  /** Categories matched with the facets. */
  tree: PropTypes.array,
  /** Query loading status*/
  loading: PropTypes.bool.isRequired,
  /** Loading status when the query is refetched */
  fetchMoreLoading: PropTypes.bool.isRequired,
  /** Runtime context */
  runtime: PropTypes.shape({
    hints: PropTypes.shape({
      /** Indicates if is on a mobile device */
      mobile: PropTypes.bool,
    }),
  }),
  /** Mobile Layout Modes setup */
  mobileLayout: PropTypes.shape({
    /** First Layout Mode */
    mode1: PropTypes.oneOf(pluck('value', LAYOUT_MODE)),
    /** Second Layout Mode */
    mode2: PropTypes.oneOf(pluck('value', LAYOUT_MODE)),
  }),
}

export const loaderPropTypes = {
  /** List of products */
  products: PropTypes.arrayOf(productShape),
  /** Function to refetch de data query */
  onFetchMore: PropTypes.func.isRequired,
  /** Number of items available according to the filters */
  recordsFiltered: PropTypes.number.isRequired,
  /** Loading status when the query is refetched */
  fetchMoreLoading: PropTypes.bool,
}
