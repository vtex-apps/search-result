import React from 'react'
import PropTypes from 'prop-types'
import Dropdown from '@vtex/styleguide/lib/Dropdown'
import { injectIntl } from 'react-intl'

class GalleryHeader extends React.Component {
  render() {
    console.log(this.context, 'context')
    console.log(this.props, 'props')
    return (
      <div className="flex justify-between mb7">
        <div className="outline w-25 pa3">
          <code>1</code>
        </div>
        <div className="outline w-25 pa3">
          <code>1</code>
        </div>
        <div className="outline w-20 pa3">
          <code>1</code>
        </div>
        <div className="w-20 pa3">
          <Dropdown
            size="large"
            options={[
              { value: 'chagall', label: 'Chagall' },
              { value: 'dali', label: 'Dali' },
              { value: 'goya', label: 'Goya' },
              { value: 'monet', label: 'Monet' },
              { value: 'picasso', label: 'Picasso' },
              { value: 'tolouseLautrec', label: 'Toulouse-Lautrec' },
            ]}
            value="tolouseLautrec"
            onChange={() => {}}
          />
        </div>
      </div>
    )
  }
}

GalleryHeader.contextTypes = {
  intl: PropTypes.object.isRequired,
}

GalleryHeader.propTypes = {
  /** Graphql data response. */
  query: PropTypes.shape({
    search: PropTypes.string.isRequired,
  }),
}

export default injectIntl(GalleryHeader)
