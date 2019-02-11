# VTEX Search Result

The VTEX Search Result app handles the result of a search and this app is used by the Dreamstore product.

:loudspeaker: **Disclaimer:** Don't fork this project, use, contribute, or open issue with your feature request.

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
  ...
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
| `hiddenFacets`                      | `String`   | Define Minicart mode. (values: 'popup' or 'sidebar')               |
| `summary`          | `Boolean`  | Shows the remove button in each item                               |
| `pagination`              | `String`  | Shows the total discount of your cart                              |
| `showSku`                   | `Boolean`  | Shows the SKU name of the item                                     |
| `labelMiniCartEmpty`        | `String`   | Text that is displayed when the cart is empty                      |
| `labelButtonFinishShopping` | `String`   | Text displayed in the finish shopping button                       |
| `enableQuantitySelector`    | `Boolean`  | Enable the quantity selector component                             |
| `maxQuantity`               | `String`   | Define the maximum quantity of an item in cart                     |

Also, you can configure the product summary that is defined on minicart. See [here](https://github.com/vtex-apps/product-summary/blob/master/README.md#configuration) the Product Summary API. 


### Styles API

:construction: :construction: :construction:

## Troubleshooting

You can check if others are experiencing similar issues [here](https://github.com/vtex-apps/search-result/issues). Also feel free to [open issues](https://github.com/vtex-apps/search-result/issues/new).

## Tests

To execute our tests go to `react/` folder and run `npm t`  or `npm test`
