import React, { useState } from 'react';
import defaultClasses from '../MainPage/mainPage.module.css';
import Search from 'src/simi/BaseComponents/Icon/Search';
import { Link, useHistory } from 'react-router-dom';

const SearchBox = props => {
    const { categoryId = 0 } = props;
    const classes = defaultClasses;
    const [keyword, setKeyword] = useState('');
    const onChange = e => {
        setKeyword(e.target.value);
    };
    const history = useHistory();

    const handleSearch = () => {
        history.push(`/faqs/search/?category=${categoryId}&keyword=${keyword}`);
    };
    return (
        <div className={classes.searchBar}>
            <form className={classes.form}>
                <button className={classes.btnSubmit}>
                    <Link
                        className={classes.faqUrl}
                        to={`/faqs/search/?category=${categoryId}&keyword=${keyword}`}
                    >
                        <span className={classes.searchIcon}>
                            <Search
                                style={{
                                    width: 20,
                                    height: 20,
                                    display: 'inline-block'
                                }}
                                color={'#fff'}
                            />
                        </span>
                    </Link>
                </button>
                <input
                    value={keyword}
                    onChange={onChange}
                    type="text"
                    name="keyword"
                    onKeyPress={e => {
                        if (e.key === 'Enter') handleSearch();
                    }}
                />
            </form>
        </div>
    );
};

export default SearchBox;
