import React, { Fragment } from 'react'
import { FormattedMessage } from 'react-intl'
import { ExtensionPoint } from 'render'
import { range } from 'ramda'

const flexStyle = { flex: 1 }

export default function NotFoundSearch({ term }) {
  return (
    <Fragment>
      <div className="vtex-search-not-found flex justify-center items-center h5">
        <div className="flex justify-end ttu f1 ph4 c-muted-3 ph9 b" style={flexStyle}>
          ops!
        </div>
        <div className="ph9" style={flexStyle}>
          <FormattedMessage
            id="search.empty-products"
            values={{
              term: <span className="c-action-primary">{term}</span>,
            }}
          >
            {(...textList) => (
              <span className="c-muted-1 b">
                {textList.map((text, index) => <Fragment key={index}>{text}</Fragment>)}
              </span>
            )}
          </FormattedMessage>
          <FormattedMessage id="search.what-do-i-do">
            {text => <p className="c-muted-2">{text}</p>}
          </FormattedMessage>
          <ul className="c-muted-2">
            {range(1, 5).map(id => (
              <FormattedMessage id={`search.what-to-do.${id}`}>
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
  term: PropTypes.string.isRequired,
}
