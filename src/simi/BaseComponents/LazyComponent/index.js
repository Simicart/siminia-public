import React from 'react';
import Loadable from 'react-loadable'
import PropTypes from 'prop-types'

export const LazyComponent = (props) => {
    if (!props.component)
        return ''
    const Component = Loadable({
        loader: props.component,
        loading: () => <div></div>,
    });

    return <Component {...props} />;
};
LazyComponent.contextTypes = {
    component: PropTypes.func
}

