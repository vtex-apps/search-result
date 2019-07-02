import PropTypes from 'prop-types'
import React, { Fragment } from 'react'
import { FormattedMessage } from 'react-intl'
import { ExtensionPoint } from 'vtex.render-runtime'
import { range } from 'ramda'

import searchResult from './searchResult.css'

const flexStyle = { flex: 1 }

/**
 * Not found page component, rendered when the search doesn't return any
 * products from the API.
 */
const NotFoundSearch = ({ term }) => {
  return (
    <Fragment>
      <div
        className={`${
          searchResult.searchNotFound
        } flex flex-column-s flex-row-ns justify-center-ns items-center h-auto-s h5-ns`}
      >
        <div
          className="flex justify-end-ns justify-center-s ttu f1 ph4 pv4-s pv0-ns c-muted-3 ph9 b"
          style={flexStyle}
        >
          Oops!
        </div>
        <div className="ph9" style={flexStyle}>
          {term ? (
            <FormattedMessage
              id="store/search.empty-products"
              values={{
                term: <span className="c-action-primary">{term}</span>,
              }}
            >
              {(...textList) => (
                <span className="c-muted-1 b">
                  {textList.map((text, index) => (
                    <Fragment key={index}>{text}</Fragment>
                  ))}
                </span>
              )}
            </FormattedMessage>
          ) : (
            <FormattedMessage id="store/search.no-products" />
          )}
          <FormattedMessage id="store/search.what-do-i-do">
            {text => <p className="c-muted-2">{text}</p>}
          </FormattedMessage>
          <ul className="c-muted-2">
            {range(1, 5).map(id => (
              <FormattedMessage id={`store/search.what-to-do.${id}`} key={id}>
                {text => <li key={text}>{text}</li>}
              </FormattedMessage>
            ))}
          </ul>
        </div>
      </div>
      <ExtensionPoint id="shelf" />
    </Fragment>
  )
}

NotFoundSearch.propTypes = {
  /** Search term */
  term: PropTypes.string,
}

export default NotFoundSearch
