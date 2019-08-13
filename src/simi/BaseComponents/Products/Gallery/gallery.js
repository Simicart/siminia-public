import React, { Component } from 'react';
import { string, shape, array, number } from 'prop-types';

import classify from 'src/classify';
import GalleryItems, { emptyData } from './items';
import defaultClasses from './gallery.css';
import Loading from 'src/simi/BaseComponents/Loading'

class Gallery extends Component {
    static propTypes = {
        classes: shape({
            filters: string,
            items: string,
            pagination: string,
            root: string
        }),
        data: array,
        pageSize: number
    };

    static defaultProps = {
        data: emptyData
    };

    render() {
        const { classes, data, pageSize, history } = this.props;
        const hasData = Array.isArray(data) && data.length;
        const items = hasData ? data : emptyData;
        
        return (
            <div className={classes.root}>
                {!hasData && <Loading />}
                <div className={classes.items}>
                    <GalleryItems items={items} pageSize={pageSize} history={history}/>
                </div>
            </div>
        );
    }
}

export default classify(defaultClasses)(Gallery);
