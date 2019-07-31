# VTEX Search Result

[![Build Status](https://api.travis-ci.org/vtex-apps/search-result.svg?branch=master)](https://travis-ci.org/vtex-apps/search-result)

## Description

The VTEX Search Result app is a store component that handles with the result of our [_Search API_](https://documenter.getpostman.com/view/845/vtex-search-api/Hs43#8b71745e-00f9-6c98-b776-f4468ecb7a5e), and this app is used by store theme.

:loudspeaker: **Disclaimer:** Don't fork this project; use, contribute, or open issue with your feature request.

## Important Note

We ask for users, from now on, to use the `filter-navigator.v2` block if you want to keep updated with the most up to date Filter Navigator in your search-result.

The correct way to use it is setting it in your `blocks.json` like:

```
json
"search-result": {
    "blocks": [
      "filter-navigator.v2",
      "gallery",
      "not-found",
      "breadcrumb",
      "order-by",
      "total-products"
    ],
  }
```

Or via Storefront.

## Max Items Per Page Usage

A `search-result` block may appear in two different contexts, (a) in a search result page (store.search) or (b) as a block in your home page (store.home).

In case of (a) we can configure the search parameters in a search context in the following way:

```json
  "store.search": {
    "blocks": [
      "search-result"
    ],
    "props": {
        "context": {
           "orderByField": "OrderByReleaseDateDESC",
            "hideUnavailableItems": true,
            "maxItemsPerPage": 8
        }
     }
  },
 "store.search#category": {
    "blocks": [
      "search-result"
    ],
    "props": {
        "context": {
           "orderByField": "OrderByReleaseDateDESC",
            "hideUnavailableItems": true,
            "maxItemsPerPage": 8
        }
     }
  },
  "store.search#brand": {
    "blocks": [
      "search-result"
    ],
    "props": {
        "context": {
           "orderByField": "OrderByReleaseDateDESC",
            "hideUnavailableItems": true,
            "maxItemsPerPage": 8
        }
     }
  },
  "store.search#department": {
    "blocks": [
      "search-result"
    ],
    "props": {
        "context": {
           "orderByField": "OrderByReleaseDateDESC",
            "hideUnavailableItems": true,
            "maxItemsPerPage": 8
        }
     }
  },
  "store.search#subcategory": {
    "blocks": [
      "search-result"
    ],
    "props": {
        "context": {
           "orderByField": "OrderByReleaseDateDESC",
            "hideUnavailableItems": true,
            "maxItemsPerPage": 8
        }
     }
  }
```

Note that only in this case, the parameters must be passed in the `context` prop of the `store.search` block. Also remember that we have different `store.search` blocks e you may configure them in different ways.
You may configure a brand search (ended with /b), have 6 items per page, while a department search page, that number may be 12.

Search examples:
Free search: https://storetheme.vtex.com/shirt?map=ft. Falls on: `store.search`.
Departament: https://storetheme.vtex.com/decoration/d. Falls on: `store.search#department`.
Category: https://storetheme.vtex.com/bags/necessaire. Falls on: `store.search#category Subcategory: https://storetheme.vtex.com/decoration/smartphones/bateria. Falls on:`store.search#subcategory`. Brand: https://storetheme.vtex.com/kawasaki/b. Falls on:`store.search#brand`.

Now for option (b), when we want to show the `search-result` block outse of a search page, like in the home page, the same parameters must be passed on a different way.

At our example, we want to show a `search-result` inside a `store.home`. We put this inside our blocks.json:

```json
"store.home": {
  "blocks": [
    "carousel#home",
    "shelf#home",
    "search-result#home"
  ]
}
```

Now, to change the search done by this block, we must pass its parameters directly to it, thorugh the `querySchema` prop:

```json
"store.home": {
  "blocks": [
    "carousel#home",
     "shelf#home",
    "search-result#home"
  ]
},
"search-result#home": {
  "props": {
    "querySchema": {
      "orderByField": "OrderByReleaseDateDESC",
      "hideUnavailableItems": true,
      "maxItemsPerPage": 8
    }
  }
}
```

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
      "filter-navigator.v2",
      "gallery",
      "not-found",
      "breadcrumb",
      "order-by",
      "total-products",
      "search-title"
    ],
    "props": {
      "context": {
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
      "pagination": "show-more"
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

#### Layout API

These properties can be changed in the `blocks.json` file of your theme.

| Prop name           | Type           | Description                                                                                 | Default value     |
| ------------------- | -------------- | ------------------------------------------------------------------------------------------- | ----------------- |
| `querySchema`       | `QuerySchema`  | Query made when there's no context                                                          | N/A               |
| `hiddenFacets`      | `HiddenFacets` | Indicates which facets will be hidden                                                       | N/A               |
| `pagination`        | `Enum`         | Pagination type (values: 'show-more' or 'infinite-scroll')                                  | `infinity-scroll` |
| `mobileLayout`      | `MobileLayout` | Control mobile layout                                                                       | N/A               |
| `showFacetQuantity` | `Boolean`      | If quantity of items filtered by facet should appear besides its name on `filter-navigator` | `false`           |
| `blockClass`        | `String`       | Unique class name to be appended to block classes                                           | `""`              |

QuerySchema

| Prop name              | Type      | Description                                                                                                                                                                                           | Default value |
| ---------------------- | --------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------- |
| `maxItemsPerPage`      | `Number`  | Maximum number of items per search page                                                                                                                                                               | 10            |
| `queryField`           | `String`  | Query field                                                                                                                                                                                           | N/A           |
| `mapField`             | `String`  | Map field                                                                                                                                                                                             | N/A           |
| `restField`            | `String`  | Other Query Strings                                                                                                                                                                                   | N/A           |
| `orderByField`         | `Enum`    | Order by field (values: `OrderByTopSaleDESC`, `OrderByReleaseDateDESC`, `OrderByBestDiscountDESC`, `OrderByPriceDESC`, `OrderByPriceASC`, `OrderByNameASC`, `OrderByNameDESC` or `''` (by relevance)) | `''`          |
| `hideUnavailableItems` | `Boolean` | Set if unavailable items should show on search                                                                                                                                                        | `false`       |

HiddenFacets

| Prop name              | Type                   | Description                 | Default value |
| ---------------------- | ---------------------- | --------------------------- | ------------- |
| `brands`               | `Boolean`              | Hide Brands filter          | false         |
| `categories`           | `Boolean`              | Hide Categories filter      | false         |
| `priceRange`           | `Boolean`              | Hide Price filter           | false         |
| `specificationFilters` | `SpecificationFilters` | Hide Specifications filters | N/A           |

SpecificationFilters

| Prop name       | Type                      | Description                                           | Default value |
| --------------- | ------------------------- | ----------------------------------------------------- | ------------- |
| `hideAll`       | `Boolean`                 | Hide specifications filters                           | false         |
| `hiddenFilters` | `Array(HiddenFilterUnit)` | Array of specifications filters that should be hidden | N/A           |

HiddenFilterUnit

| Prop name | Type    | Description                         | Default value |
| --------- | ------- | ----------------------------------- | ------------- |
| name      | String! | Name of Hidden specification filter | ""            |

MobileLayout

| Prop name | Type   | Description                                                           | Default value |
| --------- | ------ | --------------------------------------------------------------------- | ------------- |
| `mode1`   | `Enum` | Layout mode of the switcher (values: 'normal', 'small' or 'inline')   | `normal`      |
| `mode2`   | `Enum` | Layout mode of the switcher 2 (values: 'normal', 'small' or 'inline') | `small`       |

`filter-navigator.v1` block

| Prop name            | Type      | Description                                                                                                                                                    | Default value |
| -------------------- | --------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------- |
| `preventRouteChange` | `Boolean` | Prevents route change when selecting filters, using the query string instead. Intended for `search-result` blocks inserted on custom pages with static routes. | `false`       |

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

| Token name                        | Description                                                | Component Source                                                          |
| --------------------------------- | ---------------------------------------------------------- | ------------------------------------------------------------------------- |
| `container`                       | The main container of search-result                        | [SearchResult](/react/components/SearchResult.js)                         |
| `buttonShowMore`                  | Show the see more button                                   | [ShowMoreLoaderResult](/react/components/loaders/ShowMoreLoaderResult.js) |
| `switch`                          | Layout mode switcher container                             | [SearchResult](/react/components/SearchResult.js)                         |
| `breadcrumb`                      | Breadcrumb container                                       | [SearchResult](/react/components/SearchResult.js)                         |
| `filter`                          | Filter option container                                    | [FilterOptionTemplate](/react/components/FilterOptionTemplate.js)         |
| `resultGallery`                   | Gallery result container                                   | [SearchResult](/react/components/SearchResult.js)                         |
| `border`                          | Order by container border                                  | [SearchResult](/react/components/SearchResult.js)                         |
| `gallery`                         | The main container of gallery                              | [Gallery](/react/Gallery.js)                                              |
| `filterPopupButton`               | Filter pop-up button                                       | [FilterSideBar](/react/components/FilterSideBar.js)                       |
| `accordionFilter`                 | Accordion filter container                                 | [AccordionFilterContainer](/react/components/AccordionFilterContainer.js) |
| `filterAccordionItemBox`          | Accordion filter item container                            | [AccordionFilterItem](/react/components/AccordionFilterItem.js)           |
| `filterAccordionBreadcrumbs`      | Filter accordion breadcrumbs container                     | [AccordionFilterContainer](/react/components/AccordionFilterContainer.js) |
| `filterButtonsBox`                | Filter buttons container                                   | [FilterSidebar](/react/components/FilterSidebar.js)                       |
| `filterPopupFooter`               | Filter pop-up footer container                             | [Popup](/react/components/Popup.js)                                       |
| `accordionFilterItemOptions`      | Accordion filter item options container                    | [AccordionFilterItem](/react/components/AccordionFilterItem.js)           |
| `dropdownMobile`                  | The main container of drop-down on mobile                  | [SelectionListOrderBy](/react/components/SelectionListOrderBy.js)         |
| `accordionFilterItemActive`       | Container of the accordion filter item when it is active   | [AccordionFilterItem](/react/components/AccordionFilterItem.js)           |
| `totalProducts`                   | The main container of total-products                       | [TotalProducts](/react/TotalProducts.js)                                  |
| `orderBy`                         | The main container of order-by                             | [OrderBy](/react/OrderBy.js)                                              |
| `accordionFilterItemHidden`       | Accordion filter item container when it is hidden          | [AccordionFilterItem](/react/components/AccordionFilterItem.js)           |
| `accordionFilterItem`             | Accordion filter item container                            | [AccordionFilterItem](/react/components/AccordionFilterItem.js)           |
| `accordionFilterItemBox`          | Accordion filter item box                                  | [AccordionFilterItem](/react/components/AccordionFilterItem.js)           |
| `accordionFilterItemTitle`        | Accordion filter item title container                      | [AccordionFilterItem](/react/components/AccordionFilterItem.js)           |
| `accordionFilterItemIcon`         | Accordion filter item icon container                       | [AccordionFilterItem](/react/components/AccordionFilterItem.js)           |
| `filterAvailable`                 | Filter option template main container when it is available | [FilterOptionTemplate](/react/components/AccordionFilterItem.js)          |
| `filterSelected`                  | Filter option template main container when it is selected  | [FilterOptionTemplate](/react/components/AccordionFilterItem.js)          |
| `filterPopupTitle`                | Filter pop-up title label                                  | [FilterSidebar](/react/components/FilterSidebar.js)                       |
| `filterPopupArrowIcon`            | Filter pop-up arrow icon container                         | [FilterSidebar](/react/components/FilterSidebar.js)                       |
| `footerButton`                    | Footer button                                              | [FooterButton](/react/components/FooterButton.js)                         |
| `layoutSwitcher`                  | Layout mode switcher container                             | [LayoutModeSwitcher](/react/components/LayoutModeSwitcher.js)             |
| `filterPopup`                     | Main container of filter pop-up                            | [FilterPopup](/react/components/FilterPopup.js)                           |
| `filterPopupOpen`                 | Main container of filter pop-up when it is open            | [FilterPopup](/react/components/FilterPopup.js)                           |
| `filterPopupContent`              | Filter pop-up content                                      | [Popup](/react/components/Popup.js)                                       |
| `filterPopupContentContainer`     | Filter pop-up content container                            | [Popup](/react/components/Popup.js)                                       |
| `filterPopupContentContainerOpen` | Filter pop-up content container when it is open            | [Popup](/react/components/Popup.js)                                       |
| `galleryItem`                     | Gallery item container                                     | [Gallery](/react/Gallery.js)                                              |
| `searchNotFound`                  | Main container of Search Not Found                         | [NotFoundSearch](/react/NotFoundSearch.js)                                |
| `filterTitle`                     | Filter title container                                     | [FilterOptionTemplate](/react/components/FilterOptionTemplate.js)         |
| `filterIcon`                      | Filter icon container                                      | [FilterOptionTemplate](/react/components/FilterOptionTemplate.js)         |
| `galleryTitle`                    | Category name or search term title                         | [Title](/react/Title.js)                                                  |
| `filterItem`                      | Checkbox and label for Filters (desktop only)              | [SearchFilter](/react/components/SearchFilter.js)                         |
| `filterItem--selected`            | Checkbox and label for selected Filters (desktop only)     | [SearchFilter](/react/components/SearchFilter.js)                         |
| `selectedFilterItem`              | Checkbox and label for selected Filters (desktop only)     | [SelectedFilters](/react/components/SelectedFilters.js)                   |
| `orderByButton`              | the "Sort By" button found on search results     | [SelectionListOrderBy](/react/components/SelectionListOrderBy.js)                   |
| `orderByDropdown`              | the dropdown that appears when the "Sort By" button found on search results is pressed     | [SelectionListOrderBy](/react/components/SelectionListOrderBy.js)                   |
| `orderByOptionsContainer`              | the container with the "Order by" options of the "Sort by" button   | [SelectionListOrderBy](/react/components/SelectionListItem.js)                   |
| `orderByOptionItem`              | the "Order by" option that appears in the container of the "Sort by" button   | [SelectionListOrderBy](/react/components/SelectionListItem.js)                   |

| `categoriesContainer` | The container for the department filters | [DepartmentFilters](/react/components/DepartmentFilters.js) |
| `categoryGroup` | Container for each category group in the department filters | [CategoryFilter](/react/components/CategoryFilter.js) |
| `categoryParent` | View of the parent category of this group | [CategoryFilter](/react/components/CategoryFilter.js) |

## Troubleshooting

You can check if others are experiencing similar issues [here](https://github.com/vtex-apps/search-result/issues). Also feel free to [open issues](https://github.com/vtex-apps/search-result/issues/new).

## Contributing

Check it out [how to contribute](https://github.com/vtex-apps/awesome-io#contributing) with this project.

## Tests

To execute our tests go to `react/` folder and run `npm test`
