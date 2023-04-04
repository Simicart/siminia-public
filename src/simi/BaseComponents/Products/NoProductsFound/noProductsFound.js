import React from 'react';
import { number, string, shape } from 'prop-types';

import { mergeClasses } from 'src/classify';
import defaultClasses from './noProductsFound.module.css';
import { useIntl } from 'react-intl';

// TODO: get categoryUrlSuffix from graphql storeOptions when it is ready

const NoProductsFound = props => {
    const classes = mergeClasses(defaultClasses, props.classes);
    const { formatMessage } = useIntl();

    return (
        <div className={classes.root}>
            <h2 className={classes.title}>
                {formatMessage({
                    id: `Sorry! We couldn't find any products.`,
                    defaultMessage: `Sorry! We couldn't find any products.`
                })}
            </h2>
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
