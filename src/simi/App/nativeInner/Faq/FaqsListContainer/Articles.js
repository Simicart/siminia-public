import React, { useState, Fragment } from 'react';
import defaultClasses from './Articles.module.css';
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
// import { faFileAlt } from '@fortawesome/free-regular-svg-icons'
// import { faAngleDoubleUp, faAngleDoubleDown } from '@fortawesome/free-solid-svg-icons'
import { Link } from 'react-router-dom';

import Icon from '@magento/venia-ui/lib/components/Icon';
// import { Search as SearchIcon } from 'react-feather';
import { FaFileAlt, FaAngleDoubleDown, FaAngleDoubleUp } from 'react-icons/fa';
const Articles = props => {
    const classes = defaultClasses;
    const { articles } = props;
    const [viewAll, setViewAll] = useState(false);
    const onClick = () => {
        setViewAll(!viewAll);
    };

    const extendArticles = articles.slice(3, articles.length).map(article => {
        return (
            <li key={article.article_id}>
                <div className={classes.header}>
                    <span>
                        <Link to={`/faq/article/${article.url_key}`}>
                            {/* <FontAwesomeIcon className={classes.icon} icon={faFileAlt}/> */}
                            {/* <Icon src={SearchIcon} /> */}
                            <span className={classes.wrapIcon}>
                                <FaFileAlt size={25} />
                            </span>
                            {article.name}
                        </Link>
                    </span>
                </div>
            </li>
        );
    });

    return (
        <ul className={classes.articles}>
            {articles.slice(0, 3).map(article => {
                return (
                    <li key={article.article_id}>
                        <div className={classes.header}>
                            <span>
                                <Link to={`/faq/article/${article.url_key}`}>
                                    {/* <FontAwesomeIcon className={classes.icon} icon={faFileAlt}/> */}
                                    <span className={classes.wrapIcon}>
                                        <FaFileAlt />
                                    </span>
                                    {article.name}
                                </Link>
                            </span>
                        </div>
                    </li>
                );
            })}
            {articles.length <= 3 ? null : viewAll ? (
                <Fragment>
                    {articles.slice(3, articles.length).map(article => {
                        return (
                            <li key={article.article_id}>
                                <div className={classes.header}>
                                    <span>
                                        <Link
                                            to={`/faq/article/${
                                                article.url_key
                                            }`}
                                        >
                                            {/* <FontAwesomeIcon className={classes.icon} icon={faFileAlt}/> */}
                                            <span className={classes.wrapIcon}>
                                                <FaFileAlt />
                                            </span>
                                            {article.name}
                                        </Link>
                                    </span>
                                </div>
                            </li>
                        );
                    })}
                    <a className={classes.extend} onClick={onClick}>
                        {/* <FontAwesomeIcon className={classes.arrow} icon={faAngleDoubleUp}/> */}
                        <FaAngleDoubleUp />
                        Show less
                    </a>
                </Fragment>
            ) : (
                <a className={classes.extend} onClick={onClick}>
                    {/* <FontAwesomeIcon className={classes.arrow} icon={faAngleDoubleDown}/> */}
                    <FaAngleDoubleDown />
                    View all
                </a>
            )}
        </ul>
    );
};

export default Articles;
