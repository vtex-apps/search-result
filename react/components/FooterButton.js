import React from 'react'
import PropTypes from 'prop-types'
import { useCssHandles } from 'vtex.css-handles'

const CSS_HANDLES = ['footerButton']

export default function FooterButton({ children, tag, ...props }) {
  const handles = useCssHandles(CSS_HANDLES)
  const Tag = tag || 'button'

  return (
    <Tag
      {...props}
      className={`${handles.footerButton} no-underline pointer t-action--small bg-base--inverted br1 c-on-base--inverted ba b--muted-5 pv2 ph7 hover-bg-muted-5 hover-c-action-primary`}
    >
      {children}
    </Tag>
  )
}

FooterButton.propTypes = {
  children: PropTypes.node,
  tag: PropTypes.any,
}
