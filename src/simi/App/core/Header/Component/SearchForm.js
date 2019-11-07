import React, {useState} from 'react'
import Identify from "src/simi/Helper/Identify";
import Search from 'src/simi/BaseComponents/Icon/Search'
import defaultClasses from '../header.css'
import SearchAutoComplete from './searchAutoComplete/index'
import { mergeClasses } from 'src/classify'
require('./search.scss')

const SearchForm = props => {
    let searchField = null
    const [showAC, setShowAC] = useState(false)
    const [searchVal, setSearchVal] = useState('')

    const startSearch = () => {
        if (searchVal) {
            props.history.push(`/search.html?query=${searchVal}`)
        }
    }
    const handleSearchField = () => {
        if (searchField.value) {
            setShowAC(true)
            if (searchField.value !== searchVal)
                setSearchVal(searchField.value)
        } else {
            setShowAC(false)
        }
    }

    const classes = mergeClasses(defaultClasses, props.classes)

    return (
        <div className={classes['header-search-form']}>
            <label htmlFor="siminia-search-field" className="hidden">{Identify.__('Search')}</label>
            <input
                type="text"
                id="siminia-search-field"
                ref={(e) => {searchField = e}}
                placeholder={Identify.__('What are you looking for?')}
                onChange={() => handleSearchField()}
                onKeyPress={(e) => {if (e.key === 'Enter') startSearch()}}
            />
            <div role="button" tabIndex="0" className={`${classes['search-icon']} ${Identify.isRtl() ? 'search-icon-rtl' : ''}`} onClick={() => startSearch()} onKeyUp={() => startSearch()}>
                <Search style={{width: 30, height: 30, display: 'block'}} />
            </div>
            <SearchAutoComplete visible={showAC} setVisible={setShowAC} value={searchVal} />
        </div>
    );
}
export default SearchForm
