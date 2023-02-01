import React, { useState } from 'react';
import defaultClasses from '../MainPage/mainPage.module.css';
import Search from 'src/simi/BaseComponents/Icon/Search';
import { Link } from 'react-router-dom';

const SearchBox = props => {
    const { categoryId = 0 } = props;
    const classes = defaultClasses;
    const [keyword, setKeyword] = useState('');
    const onChange = e => {
        setKeyword(e.target.value);
    };
    return (
        <div className={classes.searchBar}>
            <form className={classes.form}>
                <button className={classes.btnSubmit}>
                    <Link
                        className={classes.faqUrl}
                        to={`/faqs/search/${categoryId}/${keyword}`}
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
                />
            </form>
        </div>
    );
};

export default SearchBox;
