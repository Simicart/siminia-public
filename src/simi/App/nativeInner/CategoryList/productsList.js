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
   
    const items = childCate && childCate.products ? childCate.products.items : []
    const { formatMessage } = useIntl();
    const child = childCate && childCate.children ? childCate.children : [];
    const talonProps = useCategoryTile({
        item: props.childCate,
        storeConfig: props.storeConfig
    });
    const { handleClick } = talonProps;
    const classes = useStyle(defaultClasses, props.classes);

    const renderProductsList = () => {
        return items
            .filter((i, index) => index < 6)
            .map(item => {
                return (
                    <Link
                        to={`${item.url_key}${item.url_suffix}`}
                        className={classes.product}
                    >
                        <Image
                            alt={item.name}
                            classes={{
                                image: classes.image,
                                root: classes.imageContainer
                            }}
                            resource={item.image.url}
                            type={item.image.__typename}
                            width={IMAGE_WIDTH}
                        />
                        <span className={classes.productName}>{item.name}</span>
                    </Link>
                );
            });
    };
    const renderSubCate = () => {
        if (child.lenght === 0) {
            return '';
        } else {
            return child.map(cate => {
                return (
                    <Link
                        to={`${cate.url_path}${cate.url_suffix}`}
                        className={classes.product}
                    >
                        <Image
                            alt={cate.name}
                            classes={{
                                image: classes.image,
                                root: classes.imageContainer
                            }}
                            resource={cate.image}
                            type={cate.name}
                            width={IMAGE_WIDTH}
                        />
                        <span className={classes.productName}>{cate.name}</span>
                    </Link>
                );
            });
        }
    };
    return (
        <div className={classes.root}>
            <div className={classes.viewAll} onClick={handleClick}>
                <Link to={`${childCate.url_path}${childCate.url_suffix}`}>
                    <span className={classes.title}>
                        {formatMessage({
                            id: 'productList',
                            defaultMessage: `View All ${childCate.name}`
                        })}
                    </span>
                    <span className={classes.icon}>
                        <RiArrowRightSLine />
                    </span>
                </Link>
                
            </div>
            <div className={classes.wrapProductsList}>
                {renderProductsList()}
            </div>
            <div className={classes.subCategory}>
                <div className={classes.titleSubCate}>
                    {formatMessage({
                        id: 'titleSubCategory',
                        defaultMessage: 'Sub categories'
                    })}
                </div>
                <div className={classes.wrapSubCate}>{renderSubCate()}</div>
            </div>
        </div>
    );
};

export default ProductsList;
