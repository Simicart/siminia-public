import React, { forwardRef } from 'react';
import Loader from '../Loader/Loader';
import defaultClasses from './searchbox.module.css';
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
// import { faSearch } from '@fortawesome/free-solid-svg-icons'
import { useSearchBox } from '../../talons/Faq/useSearchBox';
import Icon from '@magento/venia-ui/lib/components/Icon';
import { Search as SearchIcon } from 'react-feather';
import { FaSearch } from 'react-icons/fa';

const SearchBox = forwardRef((props, ref) => {
    const classes = defaultClasses;
    const {
        searchboxData,
        searchboxLoading,
        derivedErrorMessage
    } = useSearchBox();
    const { onClick, onKeyDown, userInput, onChange, onSearch } = props;

    if (!searchboxData || !searchboxData.MpMageplazaFaqsGetConfig) {
        return <Loader />;
    }

    const {
        title,
        description
    } = searchboxData.MpMageplazaFaqsGetConfig.general.search_box;

    return (
        <div className={classes.block}>
            <div className={classes.cardpanel}>
                <div className={classes.titleblock}>
                    <h1>{title}</h1>
                    <p>{description}</p>
                </div>
                <div className={classes.searchfield}>
                    {/* <FontAwesomeIcon className={classes.searchicon} icon={faSearch} /> */}
                    {/* <Icon src={SearchIcon} /> */}
                    <span className={classes.searchicon}>
                        <FaSearch size={25} />
                    </span>
                    <input
                        className={classes.inputfield}
                        type="text"
                        placeholder="How do we help?"
                        onKeyDown={onKeyDown}
                        value={userInput}
                        onChange={onChange}
                        ref={ref}
                    />
                    <div className={classes.searchaction}>
                        <a
                            className={classes.btn}
                            title="Search"
                            onClick={onSearch}
                        >
                            Search
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
});

export default SearchBox;
