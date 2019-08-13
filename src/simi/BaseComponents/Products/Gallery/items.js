import React, { Component } from 'react';
import { arrayOf, number, shape } from 'prop-types';
import { GridItem } from 'src/simi/BaseComponents/GridItem';

const pageSize = 12;
const emptyData = Array.from({ length: pageSize }).fill(null);


class GalleryItems extends Component {
    static propTypes = {
        items: arrayOf(
            shape({
                id: number.isRequired
            })
        ).isRequired,
        pageSize: number
    };

    // map Magento 2.3.1 schema changes to Venia 2.0.0 proptype shape to maintain backwards compatibility
    mapGalleryItem(item) {
        const { small_image } = item;
        return {
            ...item,
            small_image:
                typeof small_image === 'object' ? small_image.url : small_image
        };
    }

    handleLink = (link) => {
        const {history} = this.props
        history.push(link)
    }

    render() {
        const { items } = this.props;

        if (items === emptyData) {
            return ''
        }

        return items.map(item => (
            <GridItem key={item.id} item={this.mapGalleryItem(item)} handleLink={this.handleLink.bind(this)} />
        ));
    }
}

export { GalleryItems as default, emptyData };
