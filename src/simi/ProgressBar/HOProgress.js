import React from 'react'
import Progress from './Progress'
import { connect } from 'src/drivers';

const HOProgress = props => <Progress isAnimating={props.simiNProgressLoading} />

const mapStateToProps = ({ simireducers }) => {
    const { simiNProgressLoading } = simireducers
    return {
        simiNProgressLoading
    }
};

export default connect(mapStateToProps)(HOProgress);
