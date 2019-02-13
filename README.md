# VTEX Search Result

## Description
The VTEX Search Result app handles the result of a search and this app is used by the Dreamstore product.

:loudspeaker: **Disclaimer:** Don't fork this project; use, contribute, or open issue with your feature request.

## Release schedule

| Release  | Status              | Initial Release | Maintenance LTS Start | End-of-life | Dreamstore Compatibility
| :--:     | :---:               |  :---:          | :---:                 | :---:       | :---: 
| [2.x]    | **Maintenance LTS** |  2018-10-02     | 2018-12-01            | March 2019  | 1.x
| [3.x]    | **Current Release** |  2018-12-01     |                       |             | 2.x


See our [LTS policy](https://github.com/vtex-apps/awesome-io#lts-policy) for more information.

## Table of Contents
- [Usage](#usage)
  - [Blocks API](#blocks-api)
    - [Configuration](#configuration)
  - [Styles API](#styles-api)
- [Troubleshooting](#troubleshooting)
- [Tests](#tests)

## Usage

This app uses our store builder with the blocks architecture. To know more about Store Builder [click here.](https://help.vtex.com/en/tutorial/understanding-storebuilder-and-stylesbuilder#structuring-and-configuring-our-store-with-object-object)

To use this app, you need to import in your dependencies on `manifest.json`.

```json
  dependencies: {
    "vtex.search-result": "3.x"
  }
```

Then, add `search-result` block into our app theme, as we do in our [Dreamstore app](https://github.com/vtex-apps/dreamstore/blob/master/store/blocks.json). 

### Blocks API
This app has an interface that describes which rules must be implemented by a block when you want to use the search result.

```json
{
  "search-result": {
    "allowed": [
      "not-found",
      "breadcrumb",
      "filter-navigator",
      "total-products",
      "order-by"
    ],
    "required": [
      "gallery"
    ],
    "component": "index"
  }
}
```

The search-result has as a required block the `gallery`. So, any search-result implementation created must add a gallery as a block that is inside of search-result. Also it has as allowed blocks `not-found`, `breadcrumb`, `filter-navigator`, `total-products` and `order-by`. To know how is the API of the breadcrumbs, see the next section and to read about the API of the others apps, keep reading this documentation.

Below, we can see the `gallery`'s interface that describes witch rules must be implemented by a block when you want to use it. The `gallery` has as required block the `product-summary`. So, any gallery implementation created must add a product-summary as a block that is inside of gallery. To know how is the API of `product-summary` see the next section.

```json
{
  "gallery": {
    "required": [
      "product-summary"
    ],
    "component": "Gallery"
  }
}
```
This is the `not-found` interface, it describes the rules that must be implemented by a block when you want to use it. This app has the `shelf` as a required block, to know about the shelf API, see the next section.

```json
{
  "not-found": {
    "allowed": [
      "shelf"
    ],
    "component": "NotFoundSearch"
  }
}
```

Below, there are the `filter-navigator`, `order-by` and `total-products` interfaces respectively, they do not have required or allowed blocks.

```json
{
  "filter-navigator": {
    "component": "FilterNavigator"
  },
  "order-by": {
    "component": "OrderBy"
  },
  "total-products": {
    "component": "TotalProducts"
  }
}
```

### Configuration

Through the Storefront, you can change the search-result behavior and interface. However, you also can make in your theme app, as Dreamstore does.

| Prop name          | Type       | Description                                                                 |
| ------------------ | ---------- | --------------------------------------------------------------------------- |
| `querySchema`                      | `QuerySchema`   | Query made when there's no context                     |
| `hiddenFacets`          | `HiddenFacets`  | Indicates which facets will be hidden                             |
| `pagination`                   | `String`  | Pagination type (values: 'show-more' or 'infinite-scroll')       |

QuerySchema
| Prop name          | Type       | Description                                                                 |
| ------------------ | ---------- | --------------------------------------------------------------------------- |
| `maxItemsPerPage`   | `Number`   | Maximum number of items per search page                     |
| `queryField`          | `String`  | Query field                             |
| `mapField`              | `String`  | Map field                                                  |
| `restField`                   | `String`  | Other Query Strings       |
| `orderByField`                   | `String`  | Order by field (values: 'OrderByTopSaleDESC', 'OrderByReleaseDateDESC', 'OrderByBestDiscountDESC', 'OrderByPriceDESC', 'OrderByPriceASC', 'OrderByNameASC' or 'OrderByNameDESC')       |

HiddenFacets
| Prop name          | Type       | Description                                                                 |
| ------------------ | ---------- | --------------------------------------------------------------------------- |
| `layoutMode1`            | `String`  | Layout mode of the switcher (values: 'normal', 'small' or 'inline')    |
| `layoutMode2`            | `String`  | Layout mode of the switcher 2 (values: 'normal', 'small' or 'inline')  |
| `brands`                 | `Boolean`  | Hide Brands filter       |
| `categories`             | `Boolean`  | Hide Categories filter       |
| `priceRange`              | `Boolean`  | Hide Price filter       |
| `specificationFilters`   | `SpecificationFilters`  | Hide Specifications filters       |

SpecificationFilters
| Prop name          | Type       | Description                                                                 |
| ------------------ | ---------- | --------------------------------------------------------------------------- |
| `hideAll`            | `Boolean`  | Hide specifications filters    |
| `hiddenFilters`            | `Array(String)`  | Array of specifications filters that should be hidden  |

Also, you can configure the product summary that is defined on minicart. See [here](https://github.com/vtex-apps/product-summary/blob/master/README.md#configuration) the Product Summary API. 

### Styles API
This app provides some CSS classes as an API for style customization.

| Token name         | Component          | Description                                            |
| ------------------ | ----------         |------------------------------------------------------- |
| `container`        | [SearchResult](https://github.com/vtex-apps/search-result/blob/master/react/components/SearchResult.js) | The main container of search-result |
| `buttonShowMore`        | [ShowMoreLoaderResult](https://github.com/vtex-apps/search-result/blob/master/react/components/loaders/ShowMoreLoaderResult.js) | Show the see more button |
| `switch`        | [SearchResult](https://github.com/vtex-apps/search-result/blob/master/react/components/SearchResult.js) | Layout mode switcher container |
| `breadcrumb`        | [SearchResult](https://github.com/vtex-apps/search-result/blob/master/react/components/SearchResult.js) | Breadcrumb container |
| `filter`        | [FilterOptionTemplate](https://github.com/vtex-apps/search-result/blob/master/react/components/FilterOptionTemplate.js) | Filter option container |
| `resultGallery`        | [SearchResult](https://github.com/vtex-apps/search-result/blob/master/react/components/SearchResult.js) | Gallery result container |
| `border`        | [SearchResult](https://github.com/vtex-apps/search-result/blob/master/react/components/SearchResult.js) | Order by container border |
| `gallery`        | [Gallery](https://github.com/vtex-apps/search-result/blob/master/react/Gallery.js) | The main container of gallery |
| `filterPopupButton`        | [FilterSideBar](https://github.com/vtex-apps/search-result/blob/master/react/components/FilterSideBar.js), [Popup](https://github.com/vtex-apps/search-result/blob/master/react/components/Popup.js) | Filter pop-up button |
| `accordionFilter`        | [AccordionFilterContainer](https://github.com/vtex-apps/search-result/blob/master/react/components/AccordionFilterContainer.js) | Accordion filter container |
| `filterAccordionItemBox`        | [AccordionFilterItem](https://github.com/vtex-apps/search-result/blob/master/react/components/AccordionFilterItem.js) | Accordion filter item container |
| `filterAccordionBreadcrumbs`        | [AccordionFilterContainer](https://github.com/vtex-apps/search-result/blob/master/react/components/AccordionFilterContainer.js) | Filter accordion breadcrumbs container |
| `filterButtonsBox`        | [FilterSidebar](https://github.com/vtex-apps/search-result/blob/master/react/components/FilterSidebar.js) | Filter buttons container |
| `filterPopupFooter`        | [Popup](https://github.com/vtex-apps/search-result/blob/master/react/components/Popup.js) | Filter pop-up footer container |
| `accordionFilterItemOptions`        | [AccordionFilterItem](https://github.com/vtex-apps/search-result/blob/master/react/components/AccordionFilterItem.js) | Accordion filter item options container |
| `dropdownMobile`        | [SelectionListOrderBy](https://github.com/vtex-apps/search-result/blob/master/react/components/SelectionListOrderBy.js) | The main container of drop-down on mobile |
| `accordionFilterItemActive`        | [AccordionFilterItem](https://github.com/vtex-apps/search-result/blob/master/react/components/AccordionFilterItem.js) | Container of the accordion filter item when it is active |
| `totalProducts`        | [TotalProducts](https://github.com/vtex-apps/search-result/blob/master/react/TotalProducts.js) | The main container of total-products |
| `orderBy`        | [OrderBy](https://github.com/vtex-apps/search-result/blob/master/react/OrderBy.js) | The main container of order-by |
| `accordionFilterItemHidden`        | [AccordionFilterItem](https://github.com/vtex-apps/search-result/blob/master/react/compoents/AccordionFilterItem.js) | Accordion filter item container when it is hidden |
| `accordionFilterItem`        | [AccordionFilterItem](https://github.com/vtex-apps/search-result/blob/master/react/compoents/AccordionFilterItem.js) | Accordion filter item container |
| `accordionFilterItemBox`        | [AccordionFilterItem](https://github.com/vtex-apps/search-result/blob/master/react/compoents/AccordionFilterItem.js) | Accordion filter item box |
| `accordionFilterItemTitle`        | [AccordionFilterItem](https://github.com/vtex-apps/search-result/blob/master/react/compoents/AccordionFilterItem.js) | Accordion filter item title container |
| `accordionFilterItemIcon`        | [AccordionFilterItem](https://github.com/vtex-apps/search-result/blob/master/react/compoents/AccordionFilterItem.js) | Accordion filter item icon container |
| `filterAvailable`        | [FilterOptionTemplate](https://github.com/vtex-apps/search-result/blob/master/react/compoents/AccordionFilterItem.js) | Filter option template main container when it is available |
| `filterSelected`        | [FilterOptionTemplate](https://github.com/vtex-apps/search-result/blob/master/react/compoents/AccordionFilterItem.js) | Filter option template main container when it is selected |
| `filterPopupTitle`        | [FilterSidebar](https://github.com/vtex-apps/search-result/blob/master/react/compoents/FilterSidebar.js), [Popup](https://github.com/vtex-apps/search-result/blob/master/react/compoents/Popup.js), [SelectionListOrderBy](https://github.com/vtex-apps/search-result/blob/master/react/compoents/SelectionListOrderBy.js) | Filter pop-up title label |
| `filterPopupArrowIcon`        | [FilterSidebar](https://github.com/vtex-apps/search-result/blob/master/react/compoents/FilterSidebar.js), [Popup](https://github.com/vtex-apps/search-result/blob/master/react/compoents/Popup.js), [SelectionListOrderBy](https://github.com/vtex-apps/search-result/blob/master/react/compoents/SelectionListOrderBy.js) | Filter pop-up arrow icon container |
| `footerButton`        | [FooterButton](https://github.com/vtex-apps/search-result/blob/master/react/components/FooterButton.js) | Footer button |
| `layoutSwitcher`        | [LayoutModeSwitcher](https://github.com/vtex-apps/search-result/blob/master/react/components/LayoutModeSwitcher.js) | Layout mode switcher container |
| `filterPopup`        | [FilterPopup](https://github.com/vtex-apps/search-result/blob/master/react/components/FilterPopup.js) | Main container of filter pop-up |
| `filterPopupOpen`        | [FilterPopup](https://github.com/vtex-apps/search-result/blob/master/react/components/FilterPopup.js) | Main container of filter pop-up when it is open |
| `filterPopupContent`        | [Popup](https://github.com/vtex-apps/search-result/blob/master/react/components/Popup.js) | Filter pop-up content |
| `filterPopupContentContainer`        | [Popup](https://github.com/vtex-apps/search-result/blob/master/react/components/Popup.js) | Filter pop-up content container |
| `filterPopupContentContainerOpen`        | [Popup](https://github.com/vtex-apps/search-result/blob/master/react/components/Popup.js) | Filter pop-up content container when it is open |
| `selectedFilterCheckbox`        | [SelectedFilters](https://github.com/vtex-apps/search-result/blob/master/react/components/SelectedFilters.js) | Selected filter check-box |
| `galleryItem`        | [Gallery](https://github.com/vtex-apps/search-result/blob/master/react/Gallery.js) | Gallery item container |
| `searchNotFound`        | [NotFoundSearch](https://github.com/vtex-apps/search-result/blob/master/react/NotFoundSearch.js) | Main container of Search Not Found |
| `filterTitle`        | [FilterOptionTemplate](https://github.com/vtex-apps/search-result/blob/master/react/components/FilterOptionTemplate.js) | Filter title container |
| `filterIcon`        | [FilterOptionTemplate](https://github.com/vtex-apps/search-result/blob/master/react/components/FilterOptionTemplate.js) | Filter icon container |

To use this CSS API, you must add the `styles` builder and create an app styling CSS file.

1. Add the `stylea` builder to your `manifest.json`:

```json
	"builders": {
    	"styles": "1.x"
    }
```

2. Create a file called `vtex.minicart.css` inside the `styles/css` folder. Add your custom styles:

```css
.container {
	margin-top: 10px;
}
```


## Troubleshooting

You can check if others are experiencing similar issues [here](https://github.com/vtex-apps/search-result/issues). Also feel free to [open issues](https://github.com/vtex-apps/search-result/issues/new).

## Tests

To execute our tests go to `react/` folder and run `npm t`  or `npm test`
