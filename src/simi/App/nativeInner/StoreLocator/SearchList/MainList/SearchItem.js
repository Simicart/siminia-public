import React from 'react';

import { useWindowSize } from '@magento/peregrine';
import {LARGE, UPPER_MEDIUM} from "../../untils/breakpoints";

const SearchItem = (props) => {
    const id = props ? props.id : null;
    const name = props ? props.name : null;
    const address = props ? props.address : null;
    const icon = props ? props.icon : null;
    const long = props ? props.long : null;
    const lat = props ? props.lat : null;
    const handleChooseSearch = props ? props.handleChooseSearch : null;

    const {innerWidth: width} = useWindowSize()


    return (
        <div style={{
            // border: '0.25px solid #555555',
            boxShadow: '2px 0px 2px #55555550',
            borderTop: '0.1px solid #55555520',
            borderBottom: '0.2px solid #55555540',
            paddingTop: width > LARGE ? 8 : 5,
            paddingBottom: width > LARGE ? 8 : 5,
            paddingLeft: width > LARGE ? 8 : 5,
            paddingRight: width > LARGE ? 8 : 5,
            width: width > UPPER_MEDIUM ? 'auto' : 240,
            cursor: 'pointer'
        }} onClick={() => {
            handleChooseSearch({
                long: long,
                lat: lat,
                name: name,
                address: address
            })
        }}>
            <div key={id} style={{
                display: "flex",
                flexDirection: "row"
            }}>
                <div style={{
                    marginRight: 5,
                }}>
                    <img alt={'img'} src={icon} style={{maxWidth: 10, maxHeight: 10}}/>
                </div>

                <div>
                    <h4 style={{
                        whiteSpace: "nowrap",
                        textOverflow: 'ellipsis',
                        overflow: 'hidden',
                        maxWidth: width > UPPER_MEDIUM ? '17rem' : '12.1rem'
                    }}>
                    <span style={{
                        fontSize: width > LARGE ? 16 : 14,
                        fontWeight: 600
                    }}>{name}</span>
                        <span>   </span>
                        <span style={{
                            fontSize: width > LARGE ? 16 : 14,
                            color: '#55555599'
                        }}>{address}</span>
                    </h4>
                </div>
            </div>
        </div>
    );
};

export default SearchItem;