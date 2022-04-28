import React from 'react';
import defaultClasses from './CategoryBlock.module.css';
import Articles from './Articles';
import { Link } from 'react-router-dom';
import { FaFileAlt } from 'react-icons/fa';
const CategoryBlock = props => {
    const { url_key, name, articles, icon } = props.data;
    const classes = defaultClasses;
    const percent = 100 / props.column;
    const width = `${percent}%`; //width of a category column

    return (
        <div className={classes.block} style={{ width: width }}>
            {/* <link href="https://use.fontawesome.com/releases/v5.0.2/css/all.css" rel="stylesheet"/> */}
            <div className={classes.category}>
                <h4>
                    <span className={classes.wrapIcon}>
                        <FaFileAlt />
                    </span>
                    <Link to={`/faq/category/${url_key}`}>
                        <i className={icon} />
                        &thinsp;{name}&thinsp;
                        <span>{`(${articles.items.length})`}</span>
                    </Link>
                    <hr />
                </h4>
            </div>
            <Articles
                articles={articles.items}
                searchInput={props.searchInput}
            />
        </div>
    );
};

export default CategoryBlock;
