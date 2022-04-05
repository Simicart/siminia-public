import React from 'react';
import { number, string, shape } from 'prop-types';

import { mergeClasses } from 'src/classify';
import defaultClasses from './noWishList.module.css';
import { useIntl } from 'react-intl';

// TODO: get categoryUrlSuffix from graphql storeOptions when it is ready
import noWishList from './noWishList.png';

const NoWishList = props => {
    const classes = mergeClasses(defaultClasses, props.classes);
    const { formatMessage } = useIntl();
    return (
        <div className={classes.root}>
            <img
                className={classes.imgNoWishList}
                src={noWishList}
                alt="noWishList"
            />

            <div className={classes.noWishList}>
                {formatMessage({
                    id: 'noWishList',
                    defaultMessage: 'There are no wishlist matching'
                })}
            </div>
        </div>
    );
};

export default NoWishList;

NoWishList.propTypes = {
    categoryId: number,
    classes: shape({
        root: string,
        title: string
    })
};
