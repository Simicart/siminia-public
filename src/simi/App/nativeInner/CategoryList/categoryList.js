import React, { useState } from 'react';
import { useIntl } from 'react-intl';
import { string, number, shape } from 'prop-types';
import { useCategoryList } from '@magento/peregrine/lib/talons/CategoryList/useCategoryList';

import { useStyle } from '@magento/venia-ui/lib/classify';
import { fullPageLoadingIndicator } from '@magento/venia-ui/lib/components/LoadingIndicator';
import ErrorView from '@magento/venia-ui/lib/components/ErrorView';
import defaultClasses from './categoryList.module.css';
import CategoryTile from './categoryTile';
import { GrUserFemale } from 'react-icons/gr';
import { GiNurseFemale, GiJerusalemCross } from 'react-icons/gi';
import { FiWatch } from 'react-icons/fi';
import { MdModelTraining } from 'react-icons/md';
import { FcNews } from 'react-icons/fc';

MdModelTraining;

FiWatch;
// map Magento 2.3.1 schema changes to Venia 2.0.0 proptype shape to maintain backwards compatibility
const mapCategory = categoryItem => {
    const { items } = categoryItem.productImagePreview;
    return {
        ...categoryItem,
        productImagePreview: {
            items: items.map(item => {
                const { small_image } = item;
                return {
                    ...item,
                    small_image:
                        typeof small_image === 'object'
                            ? small_image.url
                            : small_image
                };
            })
        }
    };
};

const CategoryList = props => {
    const { id, title } = props;
    const talonProps = useCategoryList({ id });
    const { childCategories, storeConfig, error, loading } = talonProps;
    const { formatMessage } = useIntl();
    const classes = useStyle(defaultClasses, props.classes);
    const [active, setActive] = useState(0);
    const listIcon = [
        <FcNews size={50} />,
        <GrUserFemale size={50} />,
        <GiNurseFemale size={50} />,
        <FiWatch size={50} />,
        <MdModelTraining size={50} />,
        <GiJerusalemCross size={50} />
    ];

    const header = title ? (
        <div className={classes.header}>
            <h2 className={classes.title}>
                <span>{title}</span>
            </h2>
        </div>
    ) : null;

    let child;

    if (!childCategories) {
        if (error) {
            if (process.env.NODE_ENV !== 'production') {
                console.error(error);
            }

            return <ErrorView />;
        } else if (loading) {
            child = fullPageLoadingIndicator;
        }
    } else {
        if (childCategories.length) {
            child = (
                <div className={classes.content}>
                    {childCategories.map((item, index) => (
                        <div
                            className={active === index ? classes.active : ''}
                            onClick={() => setActive(index)}
                        >
                            <CategoryTile
                                icon={listIcon[index]}
                                item={mapCategory(item)}
                                key={item.url_key}
                                storeConfig={storeConfig}
                            />
                        </div>
                    ))}
                </div>
            );
        } else {
            return (
                <ErrorView
                    message={formatMessage({
                        id: 'categoryList.noResults',
                        defaultMessage: 'No child categories found.'
                    })}
                />
            );
        }
    }

    return (
        <div className={classes.root}>
            {header}
            {child}
        </div>
    );
};

CategoryList.propTypes = {
    id: number.isRequired,
    title: string,
    classes: shape({
        root: string,
        header: string,
        title: string,
        content: string
    })
};

export default CategoryList;
