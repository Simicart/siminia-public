import React, {useCallback, useState} from 'react';
import {useSearch} from "../../talons/useSearch";
import SearchItem from "./SearchItem";
import {md_hash} from "../../untils/mdHash";

import { useWindowSize } from '@magento/peregrine';
import { LARGE } from "../../untils/breakpoints";

const MainSearchList = (props) => {
    const query = props ? props.query : null;
    const setQuery = props ? props.setQuery : null;
    const setShowLeftFilter = props ? props.setShowLeftFilter : null;
    const keyMap = props ? props.keyMap : null;
    const _handleChooseSearch = props ? props.handleChooseSearch : null;

    const {innerWidth: width} = useWindowSize()

    const handleChooseSearch = useCallback((x) => {
        _handleChooseSearch(x)
        if (x && x.name) {
            setQuery(x.name)
        }
    }, [_handleChooseSearch, setQuery])

    const [shouldShowSearchResult, setShowSearchResult] = useState(false)

    const {data, loading} = useSearch({
        key: keyMap,
        query: query
    })

    //TODO: handle case enter before finish loading
    const submitCurrentQuery = useCallback((e) => {
        const predictedData = (data && data.length > 0) ? {
            lat: data[0].lat,
            long: data[0].long,
            name: data[0].name,
            address: data[0].address
        } : null
        handleChooseSearch(predictedData)
        setShowSearchResult(false)
    }, [handleChooseSearch, query, data])


    const submitCurrentQueryWithEnter = useCallback((e) => {
        if (e.key === 'Enter') {
            submitCurrentQuery(e)
            return true
        } else {
            setShowSearchResult(true)
            return false
        }
    }, [submitCurrentQuery])

    const searchBar = (
        <>
            <button style={{
                position: "absolute",
                marginLeft: 12,
                marginTop: 12
            }} onClick={() => {
                setShowLeftFilter(true)
            }}>
                <img src={require('../../icons/icon-menu.png')}/>
            </button>

            <input type={'text'}
                   placeholder={'Enter a location'}
                   onChange={event => setQuery(event.target.value)}
                   style={{
                       height: 50,
                       paddingLeft: width > LARGE ? 45 : 40,
                       paddingRight: width > LARGE ? 35 : 40,
                       width: '100%',
                       fontSize: width > LARGE ? 18 : 14
                   }}
                   value={query}
                   onKeyUp={submitCurrentQueryWithEnter}
                   onFocus={() => setShowSearchResult(true)}
                   onBlur={() => setTimeout(() => setShowSearchResult(false), 150)} //time for press option
            />

            <button style={{
                position: "absolute",
                marginLeft: -25,
                marginTop: 15,
            }}
                    onClick={submitCurrentQuery}>
                <img src={require('../../icons/icon-search.png')}/>
            </button>
        </>
    )

    return (
        <div style={{
            backgroundColor: '#fff',
        }}>
            {searchBar}
            {!!data && (shouldShowSearchResult) && (
                <div style={{
                    marginLeft: 40,
                    marginRight: 40,
                    position: 'absolute',
                    backgroundColor: 'white',
                }}
                >
                    {data.map((x, index) => {
                        return (
                            <SearchItem key={md_hash(x)}
                                        {...x}
                                        handleChooseSearch={handleChooseSearch}
                            />
                        )
                    })}
                </div>
            )}
        </div>
    );
};

export default MainSearchList;