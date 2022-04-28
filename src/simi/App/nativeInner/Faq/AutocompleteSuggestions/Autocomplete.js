import React, { useState, Fragment } from 'react';
import PropTypes from 'prop-types';
// import { useCategoryList } from '@faq/faq/src/talons/useCategoryList'
import defaultClasses from './Autocomplete.module.css';
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
// import { faFileAlt } from '@fortawesome/free-regular-svg-icons'
import { FaFileAlt } from 'react-icons/fa';
import { useIntl } from 'react-intl';

const Autocomplete = props => {
    const propTypes = {};
    const classes = defaultClasses;
    const {
        activeSuggestion,
        filteredSuggestions,
        showSuggestions,
        userInput,
        setActiveSuggestion
    } = props;
    const { formatMessage } = useIntl();

    let suggestionsListComponent;
    if (showSuggestions && userInput) {
        if (filteredSuggestions.length) {
            suggestionsListComponent = (
                <Fragment>
                    {filteredSuggestions
                        .slice(0, 3)
                        .map((suggestion, index) => {
                            let className = `${classes.suggestion}`;
                            if (activeSuggestion === index) {
                                className += ` ${classes.selected}`;
                            }
                            return (
                                <a
                                    href={`/faq/article/${suggestion.url_key}`}
                                    key={index}
                                    onClick={props.onClick}
                                    onMouseOver={() =>
                                        setActiveSuggestion(index)
                                    }
                                    className={className}
                                    tabIndex={index}
                                >
                                    &thinsp;&thinsp;
                                    {/* <FontAwesomeIcon className={classes.icon} icon={faFileAlt} /> */}
                                    <FaFileAlt />
                                    <span>
                                        &thinsp;&thinsp;{suggestion.name}
                                    </span>
                                </a>
                            );
                        })}
                </Fragment>
            );
        } else {
            suggestionsListComponent = (
                <div className={classes.noSuggestion}>
                    {formatMessage({
                        id: 'noResult',
                        defaultMessage: 'No result'
                    })}
                </div>
            );
        }
    }

    const display = showSuggestions ? 'block' : 'none';
    let style = {
        display: display,
        width: props.width,
        left: props.left
    };

    return (
        <div className={classes.container} style={style}>
            {suggestionsListComponent}
        </div>
    );
};
export default Autocomplete;
