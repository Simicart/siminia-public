import React from 'react'
import { withNProgress } from '@tanem/react-nprogress';
import PropTypes from 'prop-types'
import Bar from './Bar'
import Container from './Container'

const Progress = ({ isFinished, progress, animationDuration }) => (
    <Container isFinished={isFinished} animationDuration={animationDuration}>
        <Bar progress={progress} animationDuration={animationDuration} />
    </Container>
)

Progress.propTypes = {
    animationDuration: PropTypes.number.isRequired,
    isFinished: PropTypes.bool.isRequired,
    progress: PropTypes.number.isRequired,
}

export default withNProgress(Progress)
