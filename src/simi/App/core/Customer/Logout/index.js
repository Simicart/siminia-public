import React from 'react'
import { connect } from 'src/drivers';
import { simiSignOut } from 'src/simi/Redux/actions/simiactions';
import Loading from 'src/simi/BaseComponents/Loading';

var loggingOut = false

const Logout = props => {
    const { simiSignOut, history, isSignedIn } = props
    if (isSignedIn) {
        if (!loggingOut) {
            loggingOut = true;
            simiSignOut({ history })
        } else {
            console.log('Already logging out')
        }
    } else
        history.push('/')
    return <Loading />
}

const mapStateToProps = ({ user }) => {
    const { isSignedIn } = user
    return {
        isSignedIn
    };
}


export default connect(mapStateToProps, { simiSignOut })(Logout);
