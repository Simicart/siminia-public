import React from 'react';
import { LazyComponent } from 'src/simi/BaseComponents/LazyComponent';

const LazyNavCtn = props => {
    return (
        <LazyComponent
            component={() =>
                import(/* webpackChunkName: "LazyNav"*/ './navigation')
            }
            {...props}
        />
    );
};
//export default LazyNavCtn;
export {default } from './navigation';