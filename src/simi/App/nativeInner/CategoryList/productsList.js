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
import { BsCartCheck } from 'react-icons/bs';
import { render } from 'react-dom';

const IMAGE_WIDTH = 80;
import { logoUrl } from 'src/simi/Helper/Url';
import CategoryDescription from './CategoryDescription';
const ProductsList = props => {
    const { childCate } = props;
    const { display_mode } = childCate;
    const total_count =
        (childCate && childCate.products && childCate.products.total_count) ||
        0;
    const items =
        childCate && childCate.products ? childCate.products.items : [];
    const { formatMessage } = useIntl();
    const child = childCate && childCate.children ? childCate.children : [];
    const talonProps = useCategoryTile({
        item: props.childCate,
        storeConfig: props.storeConfig
    });
    const placeHolder = logoUrl();
    const { handleClick } = talonProps;
    const classes = useStyle(defaultClasses, props.classes);

    const renderProductsList = () => {
        return items
            .filter((i, index) => index < 6)
            .map(item => {
                return (
                    <Link
                        key={item.url_key}
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
        if (child.length === 0) {
            return '';
        } else {
            return child.map(cate => {
                return (
                    <Link
                        key={cate.url_path}
                        to={`${cate.url_path}${cate.url_suffix}`}
                        className={classes.product}
                    >
                        <Image
                            alt={cate.name}
                            classes={{
                                image: classes.image,
                                root: classes.imageContainer
                            }}
                            resource={
                                cate.image ||
                                (cate &&
                                cate.products &&
                                cate.products.items &&
                                cate.products.items[0] &&
                                cate.products.items[0].image
                                    ? cate.products.items[0].image.url
                                    : placeHolder)
                            }
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
            {display_mode === 'PRODUCTS_AND_PAGE' || display_mode === 'PAGE' ? (
                <CategoryDescription childCate={childCate} />
            ) : (
                ''
            )}
            {display_mode === 'PRODUCTS_AND_PAGE' ||
            display_mode === 'PRODUCTS' ? (
                <div className={classes.viewAll} onClick={handleClick}>
                    {total_count > 0 ? (
                        <Link
                            to={`${childCate.url_path}${childCate.url_suffix}`}
                        >
                            <span className={classes.title}>
                                {formatMessage({
                                    id: `View all`,
                                    defaultMessage: `View All`
                                })}
                                <span className={classes.childCateName}>
                                    {formatMessage({
                                        id: `${childCate.name}`
                                    })}
                                </span>
                            </span>
                            <span className={classes.icon}>
                                <RiArrowRightSLine size={20} />
                            </span>
                        </Link>
                    ) : (
                        ''
                    )}
                </div>
            ) : (
                ''
            )}
            {display_mode === 'PRODUCTS_AND_PAGE' ||
            display_mode === 'PRODUCTS' ? (
                <div className={classes.wrapProductsList}>
                    {renderProductsList()}
                </div>
            ) : (
                ''
            )}
            {display_mode === 'PRODUCTS_AND_PAGE' ||
            display_mode === 'PRODUCTS' ? (
                <div className={classes.subCategory}>
                    {child.length === 0 ? (
                        ''
                    ) : (
                        <div className={classes.titleSubCate}>
                            {formatMessage({
                                id: 'Sub categories',
                                defaultMessage: 'Sub categories'
                            })}
                        </div>
                    )}
                    <div className={classes.wrapSubCate}>{renderSubCate()}</div>
                </div>
            ) : (
                ''
            )}
        </div>
    );
};

export default ProductsList;
