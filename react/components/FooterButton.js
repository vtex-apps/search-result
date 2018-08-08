import React from 'react'
import PropTypes from 'prop-types'

export default function FooterButton({ children, ...props }) {
  return (
    <button {...props} className="vtex-footer-button pointer f5 bg-dark-gray br1 white ba b--white pv2 ph7">
      {children}
    </button>
  )
}

FooterButton.propTypes = {
  children: PropTypes.node,
}
