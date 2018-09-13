import PropTypes from 'prop-types'

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
  Quantity: PropTypes.number.isRequired,
  /** Link of the facets option. */
  Link: PropTypes.string.isRequired,
  /** Name of the facet option. */
  Name: PropTypes.string.isRequired,
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
  Departments: PropTypes.arrayOf(facetOptionShape),
  /** Brands matched with the facets. */
  Brands: PropTypes.arrayOf(facetOptionShape),
  /** SpecificationFilters matched with the facets. */
  SpecificationFilters: PropTypes.arrayOf(
    PropTypes.shape({
      /** SpecificationFilter's name. */
      name: PropTypes.string.isRequired,
      /** SpecificationFilter's facets. */
      facets: PropTypes.arrayOf(facetOptionShape),
    })
  ),
  /** Categories matched with the facets. */
  CategoriesTrees: PropTypes.arrayOf(
    PropTypes.shape({
      /** Category's name. */
      Name: PropTypes.string.isRequired,
      /** Category's quantity. */
      Quantity: PropTypes.number.isRequired,
      /** Array of SubCategories. */
      Children: PropTypes.arrayOf(facetOptionShape),
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
  /**
   * Rest of the search term, e.g: eletronics/smartphones/samsung implies that
   * rest will be equal to "smartphones,samsung".
   */
  rest: PropTypes.string,
  /** Determines the types of the terms, e.g: "c,c,b" (category, category, brand). */
  map: mapType,
  /** Current ordenation. */
  order: orderType,
  /** Current page number. */
  page: PropTypes.string,
  /**
   * Current price range filtering, e.g. "0 TO 1000" (meaning the result
   * is filtered with the price starting at 0 and ending at 1000)
   */
  priceRange: PropTypes.string,
})

export const mapType = PropTypes.string

export const orderType = PropTypes.string

export const hiddenFacetsSchema = {
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
  })
}

export const schemaPropsTypes = {
  /** Maximum number of items per page. */
  maxItemsPerPage: PropTypes.number,
  /** Product Summary's props */
  summary: PropTypes.any,
  ...hiddenFacetsSchema,
}

export const searchResultPropTypes = {
  /** Internal route path. e.g: 'store/search' */
  pagesPath: PropTypes.string,
  /** Internal route params.
   * e.g: { department: 'eletronics', category: 'smartphones' }
   */
  params: PropTypes.object,
  /** Map param. e.g: c,c */
  map: mapType.isRequired,
  /** Rest param. e.g: Android,Samsung */
  rest: mapType.isRequired,
  /** Search result page. */
  page: PropTypes.number.isRequired,
  /** Search result ordernation. */
  orderBy: orderType,
  /** Price range filter */
  priceRange: PropTypes.string,
  /** Search graphql query. */
  searchQuery: searchQueryShape,
  ...schemaPropsTypes,
}
