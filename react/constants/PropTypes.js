import PropTypes from 'prop-types'

export const facetOptionShape = PropTypes.shape({
  Quantity: PropTypes.number.isRequired,
  Link: PropTypes.string.isRequired,
  Name: PropTypes.string.isRequired,
})

export const productShape = PropTypes.shape({
  productId: PropTypes.string.isRequired,
  productName: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  categories: PropTypes.array,
  link: PropTypes.string,
  linkText: PropTypes.string.isRequired,
  brand: PropTypes.string,
  items: PropTypes.arrayOf(
    PropTypes.shape({
      itemId: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      referenceId: PropTypes.arrayOf(
        PropTypes.shape({
          Value: PropTypes.string.isRequired,
        })
      ),
      images: PropTypes.arrayOf(
        PropTypes.shape({
          imageUrl: PropTypes.string.isRequired,
          imageTag: PropTypes.string.isRequired,
        })
      ).isRequired,
      sellers: PropTypes.arrayOf(
        PropTypes.shape({
          commertialOffer: PropTypes.shape({
            Price: PropTypes.number.isRequired,
            ListPrice: PropTypes.number.isRequired,
          }).isRequired,
        })
      ).isRequired,
    })
  ).isRequired,
})

export const facetsQueryShape = PropTypes.shape({
  Departments: PropTypes.arrayOf(facetOptionShape),
  Brands: PropTypes.arrayOf(facetOptionShape),
  SpecificationFilters: PropTypes.arrayOf(PropTypes.shape({
    name: PropTypes.string.isRequired,
    facets: facetOptionShape,
  })),
  CategoriesTrees: PropTypes.arrayOf(PropTypes.shape({
    Name: PropTypes.string.isRequired,
    Quantity: PropTypes.number.isRequired,
    Children: PropTypes.arrayOf(facetOptionShape),
  })),
})

export const searchQueryShape = PropTypes.shape({
  products: PropTypes.arrayOf(productShape),
})
