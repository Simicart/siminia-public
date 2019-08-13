import React from 'react';
import Loadable from 'react-loadable';
import Loading from 'src/simi/BaseComponents/Loading';

import {Route} from 'react-router';

export const LazyRoute = (props) => {
    const component = Loadable({
        loader: props.component,
        loading: () => <div><Loading className="loading"/></div>,
    });

    return <Route {...props} component={component} />;
};

export const LazyComponent = (props) => {
    const Component = Loadable({
        loader: props.component,
        loading: () => <div><Loading className="loading"/></div>,
    });

    return <Component {...props} />;
};