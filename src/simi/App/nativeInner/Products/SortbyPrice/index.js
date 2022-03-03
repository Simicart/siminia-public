import React, { useState } from 'react';
import { Check, ChevronDown, ChevronUp } from 'react-feather';
import { configColor } from 'src/simi/Config';
import Dropdownoption from '../../BaseComponents/Dropdownoption';
import { withRouter } from 'react-router-dom';
import { useIntl } from 'react-intl';
import { capitalizeEachWords, randomString } from 'src/simi/Helper/String';
import { useEventListener } from '@magento/peregrine';
require('./sortbyPrice.scss');

let count = 0
const SortbyPrice = props => {
    const { history, location, sortByData, data } = props;
    const { search } = location;
    const { formatMessage } = useIntl();
    
    let asc = {
        value: 'price',
        key: 'price',
        direction: 'asc',
        showDir: true
    };
    let desc = {
        value: 'price',
        key: 'price',
        direction: 'desc',
        showDir: true
    };

    const clickSortByPrice = () => { 
        if(count % 2 !== 0){
            if (asc) {
                const queryParams = new URLSearchParams(search);
                queryParams.set('product_list_order', asc.key);
                queryParams.set('product_list_dir', asc.direction);
                history.push({ search: queryParams.toString() });
            }
        } else{
            if (desc) {
                const queryParams = new URLSearchParams(search);
                queryParams.set('product_list_order', desc.key);
                queryParams.set('product_list_dir', desc.direction);
                history.push({ search: queryParams.toString() });
            }
        }
        count++;
    };
    return (
        <>
            <div className="wrap-top">
                <span className="label"  onClick={() => clickSortByPrice()}>
                    {formatMessage({
                        id: 'sortByPrice',
                        defaultMessage: 'Price'
                    })}
                </span>
                <span className="icon-dropdown">
                    {count % 2 === 0 ? (
                        <ChevronDown size={15} />
                    ) : (
                        <ChevronUp size={15} />
                    )}
                </span>
            </div>
            {count > 0  ? <div className="activeSortbyPrice"></div> : ''}
        </>
    );
};

export default withRouter(SortbyPrice);
