import React, { useState } from 'react';
import { useIntl } from 'react-intl';
import { string, number, shape } from 'prop-types';
import { useCategoryList } from '../talons/CategoryList/useCategoryList';

import { useStyle } from '@magento/venia-ui/lib/classify';
import { fullPageLoadingIndicator } from '@magento/venia-ui/lib/components/LoadingIndicator';
import ErrorView from '@magento/venia-ui/lib/components/ErrorView';
import defaultClasses from './categoryList.module.css';
import ProductsList from './productsList';
import { GrUserFemale } from 'react-icons/gr';
import { GiNurseFemale, GiJerusalemCross } from 'react-icons/gi';
import { FiWatch } from 'react-icons/fi';
import { MdModelTraining } from 'react-icons/md';
import { FcNews } from 'react-icons/fc';
import { BsCartCheck } from 'react-icons/bs';
import { logoUrl } from 'src/simi/Helper/Url';

const CategoryList = props => {
    const { id, title } = props;
    const talonProps = useCategoryList({ id });
    const { childCategories, storeConfig, error, loading } = talonProps;
    const { formatMessage } = useIntl();
    const classes = useStyle(defaultClasses, props.classes);
    const [active, setActive] = useState(0);
    const placeHolderImg = logoUrl();
    const isMobileSite = window.innerWidth <= 768;

    const listIcon = [
        <BsCartCheck size={30} />,
        <BsCartCheck size={30} />,
        <BsCartCheck size={30} />,
        <BsCartCheck size={30} />,
        <BsCartCheck size={30} />,
        <BsCartCheck size={30} />
    ];

    const header = title ? (
        <div className={classes.header}>
            <h2 className={classes.title}>
                <span>{title}</span>
            </h2>
        </div>
    ) : null;

    const renderLeftContent = () => {
        if (!childCategories) {
            if (error) {
                if (process.env.NODE_ENV !== 'production') {
                    console.error(error);
                }

                return <ErrorView />;
            } else if (loading) {
                return fullPageLoadingIndicator;
            }
        } else {
            if (childCategories.length) {
                return (
                    <div className={classes.leftContent}>
                        {childCategories.map((item, index) => {
                            return (
                                <div
                                    className={
                                        active === index
                                            ? classes.active
                                            : classes.unActive
                                    }
                                    key={index}
                                    onClick={() => setActive(index)}
                                >
                                    {/* <span className={classes.icon}>{listIcon[index]}</span> */}
                                    <img
                                        className={classes.imgLogo}
                                        src={item.image || placeHolderImg}
                                        alt="logo"
                                    />
                                    <span className={classes.name}>
                                        {item.name}
                                    </span>
                                </div>
                            );
                        })}
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
    };

    const renderRightContent = () => {
        if (!childCategories) {
            if (error) {
                if (process.env.NODE_ENV !== 'production') {
                    console.error(error);
                }

                return <ErrorView />;
            } else if (loading) {
                return fullPageLoadingIndicator;
            }
        } else {
            if (childCategories.length) {
                return (
                    <div className={classes.wrapProductsList}>
                        {childCategories
                            .filter((i, key) => key === active)
                            .map((childCate, index) => (
                                <div key={childCate.url_key}>
                                    <ProductsList
                                        icon={listIcon[index]}
                                        childCate={childCate}
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
    };
    return (
        <div className={`${classes.root} ${!isMobileSite ? 'container' : ''}`}>
            {header}
            <div className={classes.mainContent}>
                {renderLeftContent()}
                <div className={classes.rightContent}>
                    {renderRightContent()}
                </div>
            </div>
        </div>
    );
};

CategoryList.propTypes = {
    id: number,
    title: string,
    classes: shape({
        root: string,
        header: string,
        title: string,
        content: string
    })
};

export default CategoryList;
