import React, { useMemo } from 'react';
import { arrayOf, string, shape } from 'prop-types';
import { Link } from 'react-router-dom';
import Price from '@simicart/siminia/src/simi/App/core/PriceWrapper/Price.js';
import { useCategoryTile } from '../talons/CategoryList/useCategoryTile';
import { useStyle } from '@magento/venia-ui/lib/classify';
import Image from '@magento/venia-ui/lib/components/Image';
import defaultClasses from './productsList.module.css';
import { useIntl } from 'react-intl';
import { RiArrowRightSLine } from 'react-icons/ri';

const IMAGE_WIDTH = 80;

const ProductsList = props => {
    const { childCate } = props;
    const {category_url_suffix} = props.storeConfig || {}
    const { formatMessage } = useIntl();
    const child = childCate && childCate.children ? childCate.children : [];
    const talonProps = useCategoryTile({
        item: props.childCate,
        storeConfig: props.storeConfig
    });
    const { image, item, handleClick } = talonProps;
    const classes = useStyle(defaultClasses, props.classes);
    
    const product =
        child && child[0] && child[0].products ? child[0].products.items : [];
    const renderProductsList = () => {
        return product
            .filter((i, index) => index < 6)
            .map(item => {
               return <Link to={`${item.url_key}${category_url_suffix}`} className={classes.product}>
                    <Image
                        alt={item.name}
                        classes={{ image: classes.image, root: classes.imageContainer }}
                        resource={item.image.url}
                        type={item.image.__typename}
                        width={IMAGE_WIDTH}
                    />
                    <span className={classes.price}> 
                    <Price currencyCode={item.price_range.minimum_price.final_price.currency} value={item.price_range.minimum_price.final_price.value} />
                    </span>
                </Link>
            });
    };
    return (
    <div className={classes.root}>
        <div className={classes.viewAll} onClick={handleClick}>
            <Link to={item.url} >
                <span className={classes.title}>
                {formatMessage({
                            id: 'productList',
                            defaultMessage:
                                `View All ${item.name}`
                        })}
                </span>
            </Link>
            <span className={classes.icon}><RiArrowRightSLine/></span>
        </div>
        <div className={classes.wrapProductsList}>
            {renderProductsList()}
        </div>
        
    </div>
    );
};

export default ProductsList;
