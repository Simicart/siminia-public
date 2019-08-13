import React from 'react';
import Identify from 'src/simi/Helper/Identify'
import defaultClasses from './filter.css';
import Checkbox from 'src/simi/BaseComponents/Checkbox'
import Dropdownplus from 'src/simi/BaseComponents/Dropdownplus'
import { mergeClasses } from 'src/classify'
import { withRouter } from 'react-router-dom';
import { formatPrice } from 'src/simi/Helper/Pricing';

class Filter extends React.Component {
    constructor(props) {
        super(props);
        const isPhone = window.innerWidth < 1024 ;
        this.state = {isPhone}
        this.rowFilterAttributes = []
        this.rowsActived = []
        this.filtersToApply = {}
        this.classes = mergeClasses(this.props.classes, defaultClasses)
        this.activedItems = {}
    }

    setIsPhone(){
        const obj = this;
        $(window).resize(function () {
            const width = window.innerWidth;
            const isPhone = width < 1024;
            if(obj.state.isPhone !== isPhone){
                obj.setState({isPhone})
            }
        })
    }

    componentDidMount(){
        this.setIsPhone();
    }

    renderActivedFilters() {
        const {props} = this
        const {filterData} = props
        if (props.data)
            this.items = props.data;

        if (this.items && this.items.length !== 0) {
            if (this.activedItems !== filterData && this.items && this.items.length !== 0) {
                this.activedItems = filterData;
                this.rowsActived = []
                this.items.map((item) => {
                    const is_price = item.request_var === 'price'
                    if (is_price) {
                        if (this.activedItems[item.request_var]) {
                            let filter_item_label = this.activedItems[item.request_var]
                            const splited_prices = filter_item_label.split('-')
                            if (splited_prices.length === 2) {
                                if (splited_prices[1])
                                    filter_item_label = <>{formatPrice(parseFloat(splited_prices[0]))} - {formatPrice(parseFloat(splited_prices[1]))}</>
                                else
                                    filter_item_label = <>{formatPrice(parseFloat(splited_prices[0]))} {Identify.__('and above')}</>
                            }
                            this.rowsActived.push(this.renderActivedFilterItem(item, filter_item_label))
                        }
                    } else if (item && item.request_var && item.filter_items && this.activedItems[item.request_var]) {
                        item.filter_items.map((filter_item)=> {
                            if (
                                (filter_item.value_string === String(this.activedItems[item.request_var]))
                            ) {
                                const filter_item_label = filter_item.label
                                this.rowsActived.push(this.renderActivedFilterItem(item, filter_item_label))
                            }
                        })
                    }
                })

                return (
                    <div>{this.rowsActived}</div>
                );
            }
        }
    }

    renderActivedFilterItem(item, filter_item_label) {
        const { classes } = this
        return (
            <div key={Identify.randomString(5)} className={classes["active-filter-item"]}>
                <div className={classes["filter-name"]}>
                    <span className={`${classes['filter-name-text']} ${classes['root-menu']}`}>{Identify.__(item.name)}</span>
                </div>
                {
                    <Checkbox
                        classes={this.classes}
                        key={Identify.randomString(5)}
                        className={classes["filter-item"]}
                        onClick={() => this.deleteFilter(item.request_var)}
                        label={filter_item_label}
                        selected={true}
                    /> 
                }
            </div>
        )
    }
    
    renderFilterItems() {
        const {props, classes} = this

        if (props.data)
            this.items = props.data;
        if (this.items && this.items.length !== 0) {
            if (this.filterAttributes !== this.items) {
                this.filterAttributes = this.items
                this.rowFilterAttributes = []
                this.filterAttributes.map((item, index) => {
                    const styles = {}
                    if (index === 0 && !this.items.layer_state)
                        styles.marginTop = 0 
                    const name = <span className={`${classes['filter-name-text']} ${classes['root-menu']}`}>{Identify.__(item.name)}</span>
                    const filterOptions = this.renderFilterItemsOptions(item)
                    if (filterOptions.length > 0 && !this.activedItems[item.request_var]) {
                        this.rowFilterAttributes.push(
                            this.state.isPhone?
                            <Dropdownplus 
                                key={Identify.randomString(5)}
                                classes={this.classes}
                                title={Identify.__(item.name)}
                                expanded={this.filtersToApply[item.request_var]?true:false}
                            >
                                <div 
                                    id={`filter-option-items-${item.request_var}`} 
                                    className={classes["filter-option-items"]}>
                                    {this.renderFilterItemsOptions(item)}
                                </div>
                            </Dropdownplus>
                            :
                            <div key={Identify.randomString(5)}>
                                <div className={classes["filter-name"]} style={styles}>{name}</div>
                                <div className={classes["filter-option-items"]}>{this.renderFilterItemsOptions(item)}</div>
                            </div>
                        )
                    }
                    return null
                }, this);
            }
            return (
                <div>{this.rowFilterAttributes}</div>
            );
        }
    }

    renderFilterItemsOptions(item)
    {
        const { classes} = this
        let options= [];
        if(item){
            if(item.filter_items !== null){
                options = item.filter_items.map(function (optionItem) {
                    const name = <span className={classes["filter-item-text"]}>
                        {$("<div/>").html(Identify.__(optionItem.label)).text()}
                        </span>;
                    return (
                        <Checkbox
                            key={Identify.randomString(5)}
                            id={`filter-item-${item.request_var}-${optionItem.value_string}`}
                            className={classes["filter-item"]}
                            classes={classes}
                            onClick={()=>{
                                this.clickedFilter(item.request_var, optionItem.value_string);
                            }}
                            label={name}
                            selected={this.filtersToApply[item.request_var] === optionItem.value_string}
                        />
                    );
                }, this, item);
            }
        }
        return options
    };
    
    renderClearButton() {
        const { classes, props} = this
        const {filterData} = props
        
        return this.state.isPhone?'':
        (filterData)
        ? (<div className={classes["action-clear"]}>
                <div 
                    role="presentation"
                    onClick={() => this.clearFilter()}
                    className={classes["clear-filter"]}>{Identify.__('Clear all')}</div>
            </div>
        ) : <div className={classes["clear-filter"]}></div>
    }

    clearFilter() {
        const {history, location} = this.props
        const { search } = location;
        const queryParams = new URLSearchParams(search);
        queryParams.delete('filter');
        history.push({ search: queryParams.toString() });
    }

    deleteFilter(attribute) {
        const {history, location, filterData} = this.props
        const { search } = location;
        const filterParams = filterData?filterData:{}
        delete filterParams[attribute]
        const queryParams = new URLSearchParams(search);
        queryParams.set('filter', JSON.stringify(filterParams));
        history.push({ search: queryParams.toString() });
    }
    
    clickedFilter(attribute, value) {
        const {history, location, filterData} = this.props
        const { search } = location;
        const filterParams = filterData?filterData:{}
        filterParams[attribute] = value
        const queryParams = new URLSearchParams(search);
        queryParams.set('page', 1);
        queryParams.set('filter', JSON.stringify(filterParams));
        history.push({ search: queryParams.toString() });
    }
    
    render() {
        const {props, classes} = this
        const {filterData} = props
        this.items = props.data?this.props.data:null;
        const activeFilter = filterData?
            (
                <div className={classes["active-filter"]}>
                    {this.renderActivedFilters()}
                </div>
            ):
            ''
        const filterProducts = 
                <div className={`${classes['filter-products']}`}>
                    {this.renderClearButton()}
                    {activeFilter}
                    {this.renderFilterItems()}
                </div>
        if (this.rowsActived.length === 0 && this.rowFilterAttributes.length === 0)
                return ''
                
        return this.state.isPhone?
        <Dropdownplus
            className={classes["siminia-phone-filter"]}
            title={Identify.__('Filter')}
            classes={classes}
        >
            {filterProducts}
        </Dropdownplus>
        :filterProducts;
    }
}

export default (withRouter)(Filter);