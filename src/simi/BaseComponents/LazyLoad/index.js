import React from 'react';
import { isBot, isRendertron } from 'src/simi/Helper/BotDetect';
import ReactLazyLoad from 'react-lazyload';

const LazyLoad = props => {
    if (isBot() || isRendertron()) {
        return props.children ? props.children : ''
    }
    return <ReactLazyLoad {...props}  />
}

export default LazyLoad;
