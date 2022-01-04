import React from 'react';
import Loadable from 'react-loadable'
import PropTypes from 'prop-types'
import RootShimmerComponent from '@magento/venia-ui/lib/RootComponents/Shimmer';

export const LazyComponent = (props) => {
    if (!props.component)
        return ''
    const Component = Loadable({
        loader: props.component,
        loading: () => <RootShimmerComponent />,
    });

    return <Component {...props} />;
};
LazyComponent.contextTypes = {
    component: PropTypes.func
}

