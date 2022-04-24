import React, { useState, useRef, useEffect } from 'react';
import { useParams } from 'react-router-dom';
// import Loader from '../Loader/Loader'
import Loader from '../../Loader';

import SearchBox from '../SearchBox/searchbox';
import Container from './components/Container';
import AdditionalInfo from './components/AdditionalInfo/AdditionalInfo';
import Autocomplete from '../AutocompleteSuggestions/Autocomplete';
import { Helmet } from 'react-helmet';
import { useArticle } from '../../talons/Faq/useArticle';
import { useCategoryList } from '../../talons/Faq/useCategoryList';
import CategoryBlock from '../FaqsListContainer/CategoryBlock';
// import '@fortawesome/fontawesome-free/css/fontawesome.min.css'

function useWindowDimensions() {
    const [width, setWidth] = useState(window.innerWidth);
    const [height, setHeight] = useState(window.innerHeight);

    const updateWidthAndHeight = () => {
        setWidth(window.innerWidth);
        setHeight(window.innerHeight);
    };

    useEffect(() => {
        window.addEventListener('resize', updateWidthAndHeight);
        return () => window.removeEventListener('resize', updateWidthAndHeight);
    });

    return {
        width,
        height
    };
}

const Article = props => {
    const { width, height } = useWindowDimensions();
    const { articleUrl = '' } = useParams();
    const { articleData, articleLoading, derivedErrorMessage } = useArticle({
        url_key: articleUrl
    });
    const {
        categoriesData,
        categoriesLoading,
        categoriesError
    } = useCategoryList();
    const inputEl = useRef(null);
    const [inputWidth, setInputWidth] = useState(0);

    const [activeSuggestion, setActiveSuggestion] = useState(0);
    const [filteredSuggestions, setFilteredSuggestions] = useState([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [userInput, setUserInput] = useState('');
    const [currentInput, setCurrentInput] = useState('');
    const [isChanged, setIsChanged] = useState(true); //determine if the current input is changed or not
    const [searchInput, setSearchInput] = useState('');
    const [loading, setLoading] = useState(false);

    const onSearch = () => {
        setLoading(true);
        setTimeout(() => {
            setLoading(false);
            setSearchInput(userInput);
        }, 500);
    };

    useEffect(() => {
        if (inputEl.current) {
            window.addEventListener(
                'resize',
                setInputWidth(inputEl.current && inputEl.current.clientWidth ? inputEl.current.clientWidth : '' )
            );
            return () =>
                window.removeEventListener(
                    'resize',
                    setInputWidth(inputEl.current && inputEl.current.clientWidth ? inputEl.current.clientWidth : '')
                );
        }
    });

    if (!articleData || !articleData.MpMageplazaFaqsGetArticles) {
        return <Loader />;
    }

    if (!categoriesData || !categoriesData.MpMageplazaFaqsCategoryList) {
        return <Loader />;
    }
    const data = articleData.MpMageplazaFaqsGetArticles.items[0] || [];
    const categories = categoriesData.MpMageplazaFaqsCategoryList.items;

    let articles = [];

    categories.map(category => {
        return (articles = articles.concat(category.articles.items));
    });

    const onChange = event => {
        setUserInput(event.target.value);
        setActiveSuggestion(0);
        if (event.target.value) {
            setShowSuggestions(true);
            setFilteredSuggestions(
                articles.filter(article =>
                    article.name
                        .toLowerCase()
                        .includes(event.target.value.toLowerCase())
                )
            );
        } else {
            setShowSuggestions(false);
        }
    };
    const onKeyDown = e => {
        if (filteredSuggestions.length === 0) return;
        if (e.keyCode != 13 && e.keyCode != 38 && e.keyCode != 40) {
            setIsChanged(true);
            setUserInput(e.currentTarget.value);
        }
        if (e.keyCode === 13) {
            // enter
            setActiveSuggestion(0);
            setShowSuggestions(false);
            setUserInput(filteredSuggestions[activeSuggestion].name);
            const { href } = window.location;
            window.location.href = `/faq/article/${
                filteredSuggestions[activeSuggestion].url_key
            }`;
        } else if (e.keyCode === 38) {
            //up arrow
            if (activeSuggestion === 0) {
                if (!isChanged) setUserInput(currentInput);
                if (currentInput == '') return;
            } else if (
                activeSuggestion === filteredSuggestions.slice(0, 3).length
            ) {
                setUserInput(currentInput);
            } else {
                setUserInput(filteredSuggestions[activeSuggestion - 1].name);
                setActiveSuggestion(activeSuggestion - 1);
            }
        } else if (e.keyCode === 40) {
            //down arrow
            if (
                activeSuggestion ===
                filteredSuggestions.slice(0, 3).length - 1
            ) {
                return;
            } else if (
                activeSuggestion === filteredSuggestions.slice(0, 3).length
            ) {
                setActiveSuggestion(0);
                setUserInput(filteredSuggestions[0].name);
            } else {
                if (activeSuggestion === 0 && isChanged) {
                    setCurrentInput(userInput);
                    setIsChanged(false);
                }
                setUserInput(filteredSuggestions[activeSuggestion + 1].name);
                setActiveSuggestion(activeSuggestion + 1);
            }
        }
    };

    const onClick = e => {
        setActiveSuggestion(0);
        setFilteredSuggestions([]);
        setShowSuggestions(false);
        setUserInput(e.currentTarget.innerText.trim());
    };

    const autocompleteLeft = `${(width - inputWidth) / 2 - 8.1}px`;
    const autocompleteWidth = `${inputWidth + 2}px`;

    return (
        <div>
            <Helmet>
                <meta charSet="utf-8" />
                <title>
                    {/* {data ? data.name : ''}  */}- Frequently Answer and
                    Question
                </title>
            </Helmet>
            <SearchBox
                onChange={onChange}
                ref={inputEl}
                userInput={userInput}
                onKeyDown={onKeyDown}
                onSearch={onSearch}
            />
            <Autocomplete
                activeSuggestion={activeSuggestion}
                filteredSuggestions={filteredSuggestions}
                showSuggestions={showSuggestions}
                onClick={onClick}
                setActiveSuggestion={setActiveSuggestion}
                userInput={userInput}
                left={autocompleteLeft}
                width={autocompleteWidth}
            />
            <Container loading={loading} data={data} />
            <AdditionalInfo data={data} articleUrl={articleUrl} />
        </div>
    );
};

export default Article;
