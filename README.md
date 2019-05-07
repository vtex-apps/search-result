# VTEX Search Result

[![Build Status](https://api.travis-ci.org/vtex-apps/search-result.svg?branch=master)](https://travis-ci.org/vtex-apps/search-result)

## Description

The VTEX Search Result app is a store component that handles with the result of our [_Search API_](https://documenter.getpostman.com/view/845/vtex-search-api/Hs43#8b71745e-00f9-6c98-b776-f4468ecb7a5e), and this app is used by store theme.

:loudspeaker: **Disclaimer:** Don't fork this project; use, contribute, or open issue with your feature request.

## Release schedule

| Release |       Status        | Initial Release | Maintenance LTS Start | End-of-life | Store Compatibility |
| :-----: | :-----------------: | :-------------: | :-------------------: | :---------: | :-----------------: |
|  [3.x]  | **Current Release** |   2018-12-01    |                       |             |         2.x         |
|  [2.x]  | **Maintenance LTS** |   2018-10-02    |      2018-12-01       | March 2019  |         1.x         |

See our [LTS policy](https://github.com/vtex-apps/awesome-io#lts-policy) for more information.

## Table of Contents

- [Usage](#usage)
  - [Blocks API](#blocks-api)
    - [Configuration](#configuration)
  - [Styles API](#styles-api)
    - [CSS namespaces](#css-namespaces)
- [Troubleshooting](#troubleshooting)
- [Contributing](#contributing)
- [Tests](#tests)

## Usage

This app uses our store builder with the blocks architecture. To know more about Store Builder [click here.](https://help.vtex.com/en/tutorial/understanding-storebuilder-and-stylesbuilder#structuring-and-configuring-our-store-with-object-object)

We add the search-result as a block in our [Store](https://github.com/vtex-apps/store/blob/master/store/interfaces.json).

To configure or customize this app, you need to import it in your dependencies in `manifest.json`.

```json
  dependencies: {
    "vtex.search-result": "3.x"
  }
```

Then, add `search-result` block into your app theme as we do in our [Store theme app](https://github.com/vtex-apps/store-theme/blob/master/store/blocks.json).

Now, you can change the behavior of the search result block that is in the store header. See an example of how to configure:

```json
  "search-result#department": {
    "blocks": [
      "filter-navigator",
      "gallery",
      "not-found",
      "breadcrumb",
      "order-by",
      "total-products",
      "category-panel",
      "search-title"
    ],
    "props": {
      "querySchema": {
        "maxItemsPerPage": 2,
        "orderByField": "OrderByReleaseDateDESC"
      },
      "hiddenFacets": {
        "layoutMode1": "normal",
        "layoutMode2": "small",
        "specificationFilters": {
          "hiddenFilters": []
        }
      },
      "pagination": "show-more",
      "showCategoryPanel": true,
      "quantityOfItemsPerRow": 4
    }
  },
```

### Blocks API

When implementing this app as a block, various inner blocks may be available. The following interface lists the available blocks within search result and describes if they are required or optional.

```json
"search-result": {
    "allowed": [
      "not-found",
      "breadcrumb",
      "filter-navigator",
      "total-products",
      "order-by",
      "category-panel",
      "search-title"
    ],
    "required": [
      "gallery"
    ],
    "component": "index"
  },
```

The search-result has as a required block the `gallery`. So, any search-result block implementation created must add a gallery as a block that is inside of search-result. Similarly, `gallery` has its own inner block structure that can be configured that you can see below.

```json
 "gallery": {
    "required": [
      "product-summary"
    ],
    "component": "Gallery"
  }
```

The gallery has as a required block the `product-summary`. So, any gallery block implementation created must add a product-summary as a block that is inside of gallery. (Similarly, `product-summary` has its own inner block structure that can be configured. There is a link to its API in the next section.)

### Configuration

Through the Storefront, you can change the search-result behavior and interface. However, you also can make in your theme app, as Dreamstore does.

| Prop name | Type | Description | Default value |
| --- | --- | --- | --- |
| `querySchema` | `QuerySchema` | Query made when there's no context | N/A |
| `hiddenFacets` | `HiddenFacets` | Indicates which facets will be hidden | N/A |
| `pagination` | `Enum` | Pagination type (values: 'show-more' or 'infinite-scroll') | `infinity-scroll` |
| `showCategoryPanel` | `Boolean` | Show category panel | false |
| `quantityOfItemsPerRow` | `Enum` | Number of cards per row in category panel (values: 2 or 4) | 4 |

QuerySchema

| Prop name | Type | Description | Default value |
| --- | --- | --- | --- |
| `maxItemsPerPage` | `Number` | Maximum number of items per search page | 10 |
| `queryField` | `String` | Query field | N/A |
| `mapField` | `String` | Map field | N/A |
| `restField` | `String` | Other Query Strings | N/A |
| `orderByField` | `Enum` | Order by field (values: 'OrderByTopSaleDESC', 'OrderByReleaseDateDESC', 'OrderByBestDiscountDESC', 'OrderByPriceDESC', 'OrderByPriceASC', 'OrderByNameASC' or 'OrderByNameDESC') | `OrderByReleaseDateDESC` |

HiddenFacets

| Prop name | Type | Description | Default value |
| --- | --- | --- | --- |
| `layoutMode1` | `Enum` | Layout mode of the switcher (values: 'normal', 'small' or 'inline') | `normal` |
| `layoutMode2` | `Enum` | Layout mode of the switcher 2 (values: 'normal', 'small' or 'inline') | `small` |
| `brands` | `Boolean` | Hide Brands filter | false |
| `categories` | `Boolean` | Hide Categories filter | false |
| `priceRange` | `Boolean` | Hide Price filter | false |
| `specificationFilters` | `SpecificationFilters` | Hide Specifications filters | N/A |

SpecificationFilters

| Prop name | Type | Description | Default value |
| --- | --- | --- | --- |
| `hideAll` | `Boolean` | Hide specifications filters | false |
| `hiddenFilters` | `Array(String)` | Array of specifications filters that should be hidden | N/A |

Also, you can configure the product summary that is defined on search-result. See [here](https://github.com/vtex-apps/product-summary/blob/master/README.md#configuration) the Product Summary API.

### Styles API

This app provides some CSS classes as an API for style customization.

To use this CSS API, you must add the `styles` builder and create an app styling CSS file.

1. Add the `styles` builder to your `manifest.json`:

```json
  "builders": {
    "styles": "1.x"
  }
```

2. Create a file called `vtex.searchResult.css` inside the `styles/css` folder. Add your custom styles:

```css
.container {
  margin-top: 10px;
}
```

#### CSS namespaces

Below, we describe the namespaces that are defined in the search-result.

| Token name | Description | Component Source |
| --- | --- | --- |
| `container` | The main container of search-result | [SearchResult](/react/components/SearchResult.js) |
| `buttonShowMore` | Show the see more button | [ShowMoreLoaderResult](/react/components/loaders/ShowMoreLoaderResult.js) |
| `switch` | Layout mode switcher container | [SearchResult](/react/components/SearchResult.js) |
| `breadcrumb` | Breadcrumb container | [SearchResult](/react/components/SearchResult.js) |
| `filter` | Filter option container | [FilterOptionTemplate](/react/components/FilterOptionTemplate.js) |
| `resultGallery` | Gallery result container | [SearchResult](/react/components/SearchResult.js) |
| `border` | Order by container border | [SearchResult](/react/components/SearchResult.js) |
| `categoryPanelHeaderRow` | The main container of category panel header | [CategoryPanel](/react/CategoryPanel.js) |
| `categoryPanelItemRow` | The main container of category panel row | [CategoryPanel](/react/CategoryPanel.js) |
| `gallery` | The main container of gallery | [Gallery](/react/Gallery.js) |
| `filterPopupButton` | Filter pop-up button | [FilterSideBar](/react/components/FilterSideBar.js) |
| `accordionFilter` | Accordion filter container | [AccordionFilterContainer](/react/components/AccordionFilterContainer.js) |
| `filterAccordionItemBox` | Accordion filter item container | [AccordionFilterItem](/react/components/AccordionFilterItem.js) |
| `filterAccordionBreadcrumbs` | Filter accordion breadcrumbs container | [AccordionFilterContainer](/react/components/AccordionFilterContainer.js) |
| `filterButtonsBox` | Filter buttons container | [FilterSidebar](/react/components/FilterSidebar.js) |
| `filterPopupFooter` | Filter pop-up footer container | [Popup](/react/components/Popup.js) |
| `accordionFilterItemOptions` | Accordion filter item options container | [AccordionFilterItem](/react/components/AccordionFilterItem.js) |
| `dropdownMobile` | The main container of drop-down on mobile | [SelectionListOrderBy](/react/components/SelectionListOrderBy.js) |
| `accordionFilterItemActive` | Container of the accordion filter item when it is active | [AccordionFilterItem](/react/components/AccordionFilterItem.js) |
| `totalProducts` | The main container of total-products | [TotalProducts](/react/TotalProducts.js) |
| `orderBy` | The main container of order-by | [OrderBy](/react/OrderBy.js) |
| `accordionFilterItemHidden` | Accordion filter item container when it is hidden | [AccordionFilterItem](/react/compoents/AccordionFilterItem.js) |
| `accordionFilterItem` | Accordion filter item container | [AccordionFilterItem](/react/compoents/AccordionFilterItem.js) |
| `accordionFilterItemBox` | Accordion filter item box | [AccordionFilterItem](/react/compoents/AccordionFilterItem.js) |
| `accordionFilterItemTitle` | Accordion filter item title container | [AccordionFilterItem](/react/compoents/AccordionFilterItem.js) |
| `accordionFilterItemIcon` | Accordion filter item icon container | [AccordionFilterItem](/react/compoents/AccordionFilterItem.js) |
| `filterAvailable` | Filter option template main container when it is available | [FilterOptionTemplate](/react/compoents/AccordionFilterItem.js) |
| `filterSelected` | Filter option template main container when it is selected | [FilterOptionTemplate](/react/compoents/AccordionFilterItem.js) |
| `filterPopupTitle` | Filter pop-up title label | [FilterSidebar](/react/compoents/FilterSidebar.js) |
| `filterPopupArrowIcon` | Filter pop-up arrow icon container | [FilterSidebar](/react/compoents/FilterSidebar.js) |
| `footerButton` | Footer button | [FooterButton](/react/components/FooterButton.js) |
| `layoutSwitcher` | Layout mode switcher container | [LayoutModeSwitcher](/react/components/LayoutModeSwitcher.js) |
| `filterPopup` | Main container of filter pop-up | [FilterPopup](/react/components/FilterPopup.js) |
| `filterPopupOpen` | Main container of filter pop-up when it is open | [FilterPopup](/react/components/FilterPopup.js) |
| `filterPopupContent` | Filter pop-up content | [Popup](/react/components/Popup.js) |
| `filterPopupContentContainer` | Filter pop-up content container | [Popup](/react/components/Popup.js) |
| `filterPopupContentContainerOpen` | Filter pop-up content container when it is open | [Popup](/react/components/Popup.js) |
| `selectedFilterCheckbox` | Selected filter check-box | [SelectedFilters](/react/components/SelectedFilters.js) |
| `galleryItem` | Gallery item container | [Gallery](/react/Gallery.js) |
| `searchNotFound` | Main container of Search Not Found | [NotFoundSearch](/react/NotFoundSearch.js) |
| `filterTitle` | Filter title container | [FilterOptionTemplate](/react/components/FilterOptionTemplate.js) |
| `filterIcon` | Filter icon container | [FilterOptionTemplate](/react/components/FilterOptionTemplate.js) |
| `galleryTitle` | Category name or search term title | [Title](/react/Title.js) |

## Troubleshooting

You can check if others are experiencing similar issues [here](https://github.com/vtex-apps/search-result/issues). Also feel free to [open issues](https://github.com/vtex-apps/search-result/issues/new).

## Contributing

Check it out [how to contribute](https://github.com/vtex-apps/awesome-io#contributing) with this project. 

## Tests

To execute our tests go to `react/` folder and run `npm test`
