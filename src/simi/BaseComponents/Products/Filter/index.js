import React from 'react';
import Dropdownplus from '../../../BaseComponents/Dropdownplus';
import Dropdownoption from '../../../BaseComponents/Dropdownoption';
import { useHistory, useLocation } from 'react-router-dom';
import RangeSlider from './RangeSlider';
import memoize from 'memoize-one';
import { useWindowSize } from '@magento/peregrine';
import { randomString } from 'src/simi/Helper/String';
import { useIntl } from 'react-intl';
import { CheckSquare, Square } from 'react-feather';
import Button from '@magento/venia-ui/lib/components/Button/button';
import { smoothScrollToView } from 'src/simi/Helper/Behavior';

require('./filter.scss');

const dropDownPlusClasses = {
    dropdownplus: 'dropdownplus',
    'dropdownplus-title': 'dropdownplus-title',
    'dropdownplus-inner': 'dropdownplus-inner'
};

const checkedIcon = <CheckSquare />;
const uncheckedIcon = <Square />;

const Filter = props => {
    const {
        data,
        filterData,
        total_count,
        maxPrice,
        minPrice,
        priceSeparator
    } = props;
    const history = useHistory();
    const location = useLocation();

    const { formatMessage } = useIntl();
    let filtersToApply = filterData ? filterData : {};
    let rowFilterAttributes = [];

    const windowSize = useWindowSize();
    const isPhone = windowSize.innerWidth < 1024;

    const renderFilterItemsOptions = memoize(item => {
        let options = [];
        if (item) {
            if (item.filter_items !== null) {
                options = item.filter_items.map(
                    function(optionItem) {
                        const name = (
                            <span className="filter-item-text">
                                <span
                                    className="filter-item-text"
                                    dangerouslySetInnerHTML={{
                                        __html: optionItem.label
                                    }}
                                />
                                {optionItem.items_count && (
                                    <span className="filter-item-count">
                                        ({optionItem.items_count})
                                    </span>
                                )}
                            </span>
                        );
                        return (
                            <label
                                role="presentation"
                                className="filter-item"
                                key={
                                    item.request_var +
                                    '_' +
                                    optionItem.value_string
                                }
                            >
                                <input
                                    type="checkbox"
                                    defaultChecked={
                                        filtersToApply[item.request_var] &&
                                        filtersToApply[
                                            item.request_var
                                        ].includes(optionItem.value_string)
                                    }
                                    onChange={() => {
                                        clickedFilter(
                                            item.request_var,
                                            optionItem.value_string
                                        );
                                    }}
                                />
                                <span className="filter-item-checked">
                                    {checkedIcon}
                                </span>
                                <span className="filter-item-unchecked">
                                    {uncheckedIcon}
                                </span>
                                <span className="filter-item-text">{name}</span>
                            </label>
                        );
                    },
                    this,
                    item
                );
            }
        }
        return options;
    });

    const renderRangePrices = memoize(filterData => {
        const from = minPrice;
        const to = maxPrice;
        let left = minPrice;
        let right = maxPrice;
        if (
            filterData &&
            filterData['price'] &&
            typeof filterData['price'] === 'string'
        ) {
            const activeRange = filterData['price'].split(priceSeparator);
            left = activeRange[0];
            right = activeRange[1];
        }

        return (
            <RangeSlider
                priceFrom={Number(from)}
                priceTo={Number(to)}
                clickedFilter={clickedFilter}
                leftPrice={Number(left)}
                rightPrice={Number(right)}
                location={location}
                filterData={filterData}
                priceSeparator={priceSeparator}
            />
        );
    });

    const renderFilterItems = () => {
        rowFilterAttributes = [];
        if (
            maxPrice &&
            minPrice !== undefined &&
            minPrice < maxPrice &&
            total_count > 0
        ) {
            rowFilterAttributes.push(
                <Dropdownplus
                    classes={dropDownPlusClasses}
                    key={randomString(5)}
                    title={formatMessage({ id: 'Price' })}
                    expanded={true}
                >
                    <div
                        id={`filter-option-items-price`}
                        className="filter-option-items"
                    >
                        {renderRangePrices(filterData)}
                    </div>
                </Dropdownplus>
            );
        }

        if (data && data.length !== 0) {
            data.map((item, index) => {
                const filterOptions = renderFilterItemsOptions(item);
                if (filterOptions.length > 0) {
                    rowFilterAttributes.push(
                        <Dropdownplus
                            classes={dropDownPlusClasses}
                            key={index}
                            title={item.name}
                            expanded={
                                filtersToApply[item.request_var] ? true : false
                            }
                        >
                            <div
                                id={`filter-option-items-${item.request_var}`}
                                className="filter-option-items"
                            >
                                {filterOptions}
                            </div>
                        </Dropdownplus>
                    );
                }
                return null;
            }, this);
        }
        return <div>{rowFilterAttributes}</div>;
    };

    const renderClearButton = () => {
        return props.filterData ? (
            <div className="clear-filter">
                <div
                    role="presentation"
                    onClick={() => clearFilter()}
                    className="action-clear"
                >
                    {formatMessage({ id: 'Clear all' })}
                </div>
            </div>
        ) : (
            <div className="clear-filter" />
        );
    };

    const clearFilter = () => {
        document
            .getElementById('root-product-list')
            .scrollIntoView({ behavior: 'smooth' });
        const { search } = location;
        const queryParams = new URLSearchParams(search);
        queryParams.delete('filter');
        history.push({ search: queryParams.toString() });
    };

    const applyFilter = () => {
        document
            .getElementById('root-product-list')
            .scrollIntoView({ behavior: 'smooth' });
        const { search } = location;
        const queryParams = new URLSearchParams(search);
        queryParams.set('page', 1);
        queryParams.set('filter', JSON.stringify(filtersToApply));
        history.push({ search: queryParams.toString() });
        smoothScrollToView(document.getElementById('root'));
    };

    const deleteFilter = attribute => {
        const { search } = location;
        const filterParams = filterData ? filterData : {};
        delete filterParams[attribute];
        const queryParams = new URLSearchParams(search);
        queryParams.set('filter', JSON.stringify(filterParams));
        history.push({ search: queryParams.toString() });
    };

    const clickedFilter = (attribute, value) => {
        const newFiltersToApply = filtersToApply;
        if (attribute === 'price') newFiltersToApply[attribute] = value;
        else {
            const existedValue = newFiltersToApply[attribute];
            if (!existedValue) newFiltersToApply[attribute] = [value];
            else {
                const index = existedValue.indexOf(value);
                if (index > -1) {
                    if (existedValue.length > 1)
                        newFiltersToApply[attribute].splice(index, 1);
                    else delete newFiltersToApply[attribute];
                } else newFiltersToApply[attribute].push(value);
            }
        }
        filtersToApply = newFiltersToApply;
    };

    const filterProducts =
        data && data.length ? (
            <div className="filter-products">
                {renderClearButton()}
                {renderFilterItems()}
                <Button onClick={() => applyFilter()} priority="high">
                    {formatMessage({ id: 'Apply' })}
                </Button>
            </div>
        ) : (
            ''
        );

    return isPhone ? (
        <Dropdownoption
            className="siminia-phone-filter"
            title={formatMessage({ id: 'Filter' })}
        >
            {filterProducts}
        </Dropdownoption>
    ) : (
        filterProducts
    );
};

export default Filter;
