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
import {BsCartCheck} from 'react-icons/bs'


const CategoryList = props => {
    const { id, title } = props;
    const talonProps = useCategoryList({ id });
    const { childCategories, storeConfig, error, loading } = talonProps;
    const { formatMessage } = useIntl();
    const classes = useStyle(defaultClasses, props.classes);
    const [active, setActive] = useState(0);
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
        if(!childCategories){
            if (error) {
                if (process.env.NODE_ENV !== 'production') {
                    console.error(error);
                }
    
                return <ErrorView />;
            } else if (loading) {
                return fullPageLoadingIndicator;
            }
        }
        else {
            if(childCategories.length){
                return childCategories.map((item, index) => {
                    return (
                        <div
                            className={
                                active === index ? classes.active : classes.unActive
                            }
                            onClick={() => setActive(index)}
                        >
                            <span className={classes.icon}>{listIcon[index]}</span>
                            <span className={classes.name}>{item.name}</span>
                        </div>
                    );
                });
            }else {
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
        if(!childCategories){
            if (error) {
                if (process.env.NODE_ENV !== 'production') {
                    console.error(error);
                }
    
                return <ErrorView />;
            } else if (loading) {
                return fullPageLoadingIndicator;
            }
        }
        else {
            if(childCategories.length){
                return (
                    <div className={classes.wrapProductsList}>
                        {childCategories
                            .filter((i, key) => key === active)
                            .map((childCate, index) => (
                                <div>
                                    <ProductsList
                                        icon={listIcon[index]}
                                        childCate={childCate}
                                        key={childCate.url_key}
                                        storeConfig={storeConfig}
                                    />
                                </div>
                            ))}
                    </div>
                );
            }
            else {
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
        <div className={classes.root}>
            {header}
            <div className={classes.mainContent}>
                <div className={classes.leftContent}>{renderLeftContent()}</div>
                <div className={classes.rightContent}>
                    {renderRightContent()}
                </div>
            </div>
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
