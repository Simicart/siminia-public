import React, { Component } from 'react'
import { connect } from 'src/drivers';
import { compose } from 'redux';
import PageTitle from 'src/simi/App/core/Customer/Account/Components/PageTitle';
import ProfileForm from './ProfileForm';
import { toggleMessages } from 'src/simi/Redux/actions/simiactions';

import {
    getUserDetails,
} from 'src/actions/user';

class Profile extends Component {
    render() {
        const {classes} = this.props;
        return (
            <div className={classes['account-information-area']}>
                <PageTitle title={'Account Information'} classes={classes}/>
                <ProfileForm {...this.props}/>
            </div>
        )
    }
}

const mapDispatchToProps = {
    toggleMessages,
    getUserDetails,
};

export default compose(
    connect(
        null,
        mapDispatchToProps
    )
)(Profile);

// export default Profile;