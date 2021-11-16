import React from 'react';
import { connect } from 'src/drivers';
import PageTitle from '../../Components/PageTitle';
import ProfileForm from './ProfileForm';
import { toggleMessages } from 'src/simi/Redux/actions/simiactions';

const Profile = props => {
    return (
        <div className='account-information-area'>
            <PageTitle title={'Account Information'} />
            <ProfileForm {...props} />
        </div>
    )
}


const mapDispatchToProps = {
    toggleMessages
};

export default connect(
    null,
    mapDispatchToProps
)(Profile);
