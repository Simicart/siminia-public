import React, { Fragment, useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import SearchBox from '../SearchBox/searchbox.js';
// import Loader from '../Loader/Loader'
import Loader from '../../Loader';

import CategoriesList from '../FaqsListContainer/CategoriesList';
import { useCategoryListUrl } from '../../talons/Faq/useCategoryListUrl';
import { useCategoryList } from '../../talons/Faq/useCategoryList';
import { useIntl } from 'react-intl';

const Category = props => {
    const { categoryUrl = '' } = useParams();
    const { formatMessage } = useIntl();
    const {
        categoryData,
        categoryLoading,
        categoryErrorMessage
    } = useCategoryListUrl({ url_key: categoryUrl });
    const {
        categoriesData,
        categoriesLoading,
        categoriesError
    } = useCategoryList();
    const [userInput, setUserInput] = useState('');
    const [searchInput, setSearchInput] = useState('');
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(false);
    const [reRender, setReRender] = useState(false);
    useEffect(() => {
        if (categoryData) {
            const _category = categoryData.MpMageplazaFaqsCategoryList.items;
            setCategories(_category);
        }
    }, [reRender]);
    useEffect(() => {
        setTimeout(() => setReRender(true), 2000);
    });
    if (!categoryData || !categoryData.MpMageplazaFaqsCategoryList) {
        return <Loader />;
    }
    if (!categoriesData || !categoriesData.MpMageplazaFaqsCategoryList) {
        return <Loader />;
    }

    const onChange = e => {
        setUserInput(e.target.value);
    };
    const onSearch = () => {
        setLoading(true);
        setTimeout(() => {
            setLoading(false);
            if (userInput != '') {
                setCategories(categoriesData.MpMageplazaFaqsCategoryList.items);
            } else {
                setCategories(categoryData.MpMageplazaFaqsCategoryList.items);
            }
            setSearchInput(userInput);
        }, 500);
    };

    return (
        <div className="container">
            <Helmet>
                <meta charSet="utf-8" />
                <title>
                    {categories.length ? categories[0].name : ''}
                    {formatMessage({
                        id: 'answerAndQuestion',
                        defaultMessage: '- Frequently Answer and Question'
                    })}
                </title>
            </Helmet>
            <SearchBox
                onChange={onChange}
                userInput={userInput}
                onSearch={onSearch}
            />
            <CategoriesList
                loading={loading}
                categories={categories}
                searchInput={searchInput}
                reRender={reRender}
            />
        </div>
    );
};

export default Category;
