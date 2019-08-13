import React from 'react';
import Identify from 'src/simi/Helper/Identify';
import Check from 'src/simi/BaseComponents/Icon/TapitaIcons/SingleSelect';
import {configColor} from "src/simi/Config";
import Dropdownoption from 'src/simi/BaseComponents/Dropdownoption/'
import { withRouter } from 'react-router-dom';


const Sortby = props => {
    const { history, location, sortByData } = props;
    const { search } = location;
    let dropdownItem = null

    const changedSortBy = (item) => {
        if (dropdownItem && item) {
            dropdownItem.handleToggle()
            const queryParams = new URLSearchParams(search);
            queryParams.set('product_list_order', item.key);
            queryParams.set('product_list_dir', item.direction);
            history.push({ search: queryParams.toString() });
        }
    }

    const {classes} = props
    parent = props.parent
    let selections = []
    const orders = [
        {"key":"name","value":"Product Name","direction":"asc"},
        {"key":"name","value":"Product Name","direction":"desc"},
        {"key":"price","value":"Price","direction":"asc"},
        {"key":"price","value":"Price","direction":"desc"},
    ];

    let sortByTitle = Identify.__('Sort by');

    selections = orders.map((item) => {
        let itemCheck = ''
        const itemTitle = `${item.value} (${item.direction})`
        if (sortByData && sortByData[`${item.key}`] === item.direction.toUpperCase()) {
            itemCheck = (
                <span className={classes["is-selected"]}>
                    <Check color={configColor.button_background} style={{width: 16, height: 16, marginRight: 4}}/>
                </span>
            )
            sortByTitle = itemTitle
        }
        return (
            <div 
                role="presentation"
                key={Identify.randomString(5)}
                className={classes["dir-item"]}
                onClick={()=>changedSortBy(item)}
            >
                <div className={classes["dir-title"]}>
                    {itemTitle}
                </div>
                <div className={classes["dir-check"]}>
                {itemCheck}
                </div>
            </div>
        );
    });

    return (
        <div className={classes["top-sort-by"]}>
            {
                selections.length === 0 ?
                <span></span> : 
                <div className={classes["sort-by-select"]}>
                    <Dropdownoption 
                        classes={classes}
                        title={sortByTitle}
                        ref={(item)=> {dropdownItem = item}}
                    >
                        {selections}
                    </Dropdownoption>
                </div>
            }
        </div>
    )
}

export default (withRouter)(Sortby);