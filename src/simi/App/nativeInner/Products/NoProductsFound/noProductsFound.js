import React from 'react';
import { number, string, shape } from 'prop-types';

import { mergeClasses } from 'src/classify';
import defaultClasses from './noProductsFound.module.css';
import { useIntl } from 'react-intl';

// TODO: get categoryUrlSuffix from graphql storeOptions when it is ready
import noProducts from '../Icon/noProducts.png'
const NoProductsFound = props => {
    const {search} = props;
    const classes = mergeClasses(defaultClasses, props.classes);
    const { formatMessage } = useIntl();

    return (
        <div className={classes.root}>
            <img className={classes.imgNoProducts} src={noProducts} alt='noProducts'/>
            <div className={classes.noProducts}>
                {formatMessage({ id: 'noProducts', defaultMessage: 'There are no products maching '})}
                <span className={classes.search}>{`"${search}"`}</span>
            </div>
        </div>
    );
};

export default NoProductsFound;

NoProductsFound.propTypes = {
    categoryId: number,
    classes: shape({
        root: string,
        title: string
    })
};
