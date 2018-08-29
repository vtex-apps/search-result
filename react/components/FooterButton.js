import React from 'react'
import PropTypes from 'prop-types'

export default function FooterButton({ children, tag, ...props }) {
  const Tag = tag || 'button'

  return (
    <Tag {...props} className="vtex-footer-button link pointer f5 bg-dark-gray br1 white ba b--white pv2 ph7 hover-bg-white hover-dark-gray">
      {children}
    </Tag>
  )
}

FooterButton.propTypes = {
  children: PropTypes.node,
  tag: PropTypes.any,
}
