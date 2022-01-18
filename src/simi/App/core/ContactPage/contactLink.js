import React from 'react';
import { useContactLink } from 'src/simi/talons/ContactPage';
import Shimmer from '@magento/venia-ui/lib/components/Shimmer';

const ContactLink = props => {
    const { children } = props;
    const talonProps = useContactLink();
    const { isEnabled, isLoading } = talonProps;

    if (!isEnabled && !isLoading) {
        return null;
    }

    if (isLoading) {
        return <Shimmer />;
    }

    return children;
};

export default ContactLink;
