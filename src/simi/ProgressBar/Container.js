import React from 'react'
import PropTypes from 'prop-types'

const Container = ({ children, isFinished, animationDuration }) => (
    <div style={{
        opacity: isFinished ? 0 : 1,
        pointerEvents: 'none',
        transition: `opacity ${animationDuration}ms linear`
    }}>{children}</div>
)

Container.propTypes = {
    animationDuration: PropTypes.number.isRequired,
    children: PropTypes.node.isRequired,
    isFinished: PropTypes.bool.isRequired,
}

export default Container;
