import React, { useState } from 'react';
import { Check } from 'react-feather';
import { configColor } from 'src/simi/Config';
import Dropdownoption from '../../BaseComponents/Dropdownoption';
import { withRouter } from 'react-router-dom';
import { useIntl } from 'react-intl';
import { capitalizeEachWords, randomString } from 'src/simi/Helper/String';
require('./sortby.scss');

const Sortby = props => {
    const { history, location, sortByData, data, showingDropdown } = props;
    const { search } = location;
    const { formatMessage } = useIntl();
    const changedSortBy = (item)=> {
        if (item) {
            const queryParams = new URLSearchParams(search);
            queryParams.set('product_list_order', item.key);
            queryParams.set('product_list_dir', item.direction);
            history.push({ search: queryParams.toString() });
        }
    };

    parent = props.parent;
    let selections = [];
    let orders = [];
    if (
        data &&
        data.products &&
        data.products.sort_fields &&
        data.products.sort_fields.options
    ) {
        data.products.sort_fields.options.map(sort_field_opt => {
            if (sort_field_opt.value === 'position') {
                // do nothing
            } else {
                orders.push({
                    key: sort_field_opt.value,
                    value: sort_field_opt.label,
                    direction: 'asc'
                });
                orders.push({
                    key: sort_field_opt.value,
                    value: sort_field_opt.label,
                    direction: 'desc'
                });
            }
        });
    } else {
        orders = [
            {
                value: 'position',
                key: 'position',
                direction: 'asc',
                showDir: false
            },
            {
                value: 'relevance',
                key: 'relevance',
                direction: 'asc',
                showDir: false
            },
            { value: 'name', key: 'name', direction: 'asc', showDir: true },
            { value: 'name', key: 'name', direction: 'desc', showDir: true },
        ];
    }
    let sortByTitle = formatMessage({ id: 'sort by' });
    selections = orders.map((item) => {
        let itemCheck = '';
        let itemTitle = item.value;
        itemTitle = capitalizeEachWords(formatMessage({ id: itemTitle }));
        if (item.showDir) {
            itemTitle += formatMessage({ id: ': ' });
            itemTitle +=
                item.direction === 'asc'
                    ? formatMessage({ id: 'Low to High' })
                    : formatMessage({ id: 'High to Low' });
        }

        if (
            sortByData &&
            sortByData[`${item.key}`] === item.direction.toUpperCase()
        ) {
            itemTitle = (<span className="dir-title-active">{itemTitle}</span>)
            itemCheck = (
                <span className="is-selected">
                    <Check size={20} />
                </span>
            );
        }

        return (
            <div
                role="presentation"
                key={randomString(5)}
                className="dir-item"
                onClick={() => changedSortBy(item)}
            >
                <div className="dir-title">{itemTitle}</div>
                <div className="dir-check">{itemCheck}</div>
            </div>
        );
    });

    return (
        <div className="top-sort-by">
            {/* <div className={`${showingDropdown ? 'active' : 'unActive'}`}></div> */}
            {selections.length === 0 ? (
                <span />
            ) : (
                <div className="sort-by-select">
                    <Dropdownoption showingDropdown = {showingDropdown} >
                        {selections}
                    </Dropdownoption>
                </div>
            )}
        </div>
    );
};

export default withRouter(Sortby);
