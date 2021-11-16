import React from 'react';
import { Whitebtn } from 'src/simi/BaseComponents/Button'
//import {smoothScrollToView} from 'src/simi/Helper/Behavior'
import Identify from "src/simi/Helper/Identify";
import { configColor } from "src/simi/Config";
import Radio from '../OptionType/Radio';
import Select from '../OptionType/Select';
import Checkbox from '../OptionType/Checkbox';
import OptionBase from '../OptionBase'
import { formatPrice } from 'src/simi/Helper/Pricing';
import { Qty } from 'src/simi/BaseComponents/Input'

require('./bundleoption.scss');
class BundleOption extends OptionBase {
    showingOption = false
    state = {
        configPrice: {
            priceExclTax: 0,
            priceInclTax: 0,
        }
    }

    handleChangeBtn = () => {
        const obj = this
        $('.bundle-show-options').slideToggle('fast', function () {
            //smoothScrollToView($('.customize-price-bundle'))
            obj.showingOption = !obj.showingOption
            $(`#bundle-customize-n-addcart-btn`).html(obj.showingOption ? Identify.__('Back to product details') : Identify.__('Customize & Add to Cart'))
        });
    };

    renderOptions = () => {
        const objOptions = [];
        const { data } = this;
        if (data && data.length) {
            for (const i in data) {
                const obj = data[i];
                let labelReq = '';
                if (obj.required) {
                    labelReq = "*";
                    this.required.push(i);
                }
                if (obj.options) {
                    const defaultItem = obj.options.find(({ is_default }) => is_default === true);
                    if (defaultItem && defaultItem.product && !this.selected[obj.option_id]) {
                        this.selected[obj.option_id] = this.selected.hasOwnProperty(`${obj.option_id}`) ? this.selected[obj.option_id] : ((obj.type === 'multi' || obj.type === 'checkbox') ? [defaultItem.id] : defaultItem.id);
                    }
                }
                const element = this.renderAttribute(obj.type, obj, obj.option_id, labelReq);
                objOptions.push(element);
            }
        }

        return <form id="options">{objOptions}</form>;
    };


    getTierPriceElement = (element) => {
        if (element.tierPrice && element.tierPrice.length > 0) {
            for (const t in element.tierPrice) {
                const item = element.tierPrice[t];
                if (qty === parseInt(item.price_qty, 10)) {
                    return item;
                }
            }
        }
        return element
    }

    updatePrices = (selected = this.selected) => {
        let priceInclTax = 0;
        let priceExclTax = 0;
        // const attributes = this.data.bundle_options.options;
        const { data } = this;
        for (const i in selected) {
            const values = selected[i];
            if (values) {
                const input = $('input.option-qty-' + i)
                const dataItem = data.find(({ option_id }) => option_id === Number(i));

                if (values instanceof Array) { //multi select
                    for (const j in values) {
                        if (dataItem && dataItem.options) {
                            const itemValue = dataItem.options.find(({ id }) => id === values[j]);
                            if (itemValue) {
                                const qty = input.val() ? parseInt(input.val(), 10) : itemValue.quantity;
                                const optionTarget = itemValue.product;
                                if (!optionTarget) return;
                                const targetPrice = optionTarget.tier_price ? optionTarget.tier_price : optionTarget.price_range.minimum_price.final_price.value;
                                priceExclTax += parseFloat(parseFloat(targetPrice) * qty);
                                priceInclTax += parseFloat(parseFloat(targetPrice) * qty);
                            }
                        }
                    }
                } else { //single select
                    if (dataItem && dataItem.options) {
                        const itemValue = dataItem.options.find(({ id }) => id === values);
                        if (itemValue) {
                            const qty = input.val() ? parseInt(input.val(), 10) : itemValue.quantity;
                            const optionTarget = itemValue.product;
                            if (!optionTarget) return;
                            const targetPrice = optionTarget.tier_price ? optionTarget.tier_price : optionTarget.price_range.minimum_price.final_price.value;
                            priceExclTax += parseFloat(parseFloat(targetPrice) * qty);
                            priceInclTax += parseFloat(parseFloat(targetPrice) * qty);
                        }
                    }
                }
            }
        }
        this.setState({ configPrice: { priceInclTax, priceExclTax } })
    };

    renderAttribute = (type, obj, id, labelRequried) => {
        const hidden = type === 'checkbox'|| type === 'multi' ? 'hidden' : '';
        const { selected, data } = this;
        let customQty = false;
        let defaultQty = 1;

        // if (attributes[id] && selected[id] && attributes[id]["selections"][selected[id]]) {
        //     defaultQty = attributes[id]["selections"][selected[id]].qty
        //     if (attributes[id]["selections"][selected[id]].customQty)
        //         customQty = parseInt(attributes[id]["selections"][selected[id]].customQty, 10)
        // }

        let bundleContent = null;
        const dataItem = data.find(({ option_id }) => option_id === id);
        if (dataItem && dataItem.hasOwnProperty('options')) {
            const { options } = dataItem;
            const defaultItem = options.find(({ is_default }) => is_default === true);
            if (defaultItem) {
                defaultQty = defaultItem.quantity;
            }
            const foundSled = options.find(item => item && item.id === Number(selected[id]));
            if (selected[id] && foundSled) {
                customQty = foundSled.can_change_quantity;
            }
            bundleContent = <div className="option-list" style={{ marginBottom: '0' }}>
                {this.renderContentAttribute(obj, type, id)}
            </div>;
        }

        return (
            <div key={id} className="option-select">
                <div className="option-title" style={{ fontSize: '18px', height: 30 }}>
                    <span>{obj.title} <span style={{ marginLeft: '5px', color: 'red' }}>{labelRequried}</span></span>
                </div>
                <div className="option-content" id="bundle-options">
                    <div className="option-list" style={{ marginBottom: '0' }}>
                        {bundleContent}
                    </div>
                    {!hidden &&
                        <div className={`bundle-option-qty ${type}`} data-name={id} style={{
                            marginLeft: '25px',
                            fontWeight: 600
                        }}>
                            <span>{Identify.__('Quantity')}</span>
                            <Qty
                                dataId={id}
                                key={selected[id] ? selected[id] : id}
                                className={`option-qty option-qty option-qty-${id}`}
                                value={defaultQty}
                                inputStyle={{ margin: '0 15px', borderRadius: 0, border: 'solid #eaeaea 1px', maxWidth: 50, color: customQty ? 'black' : '#aeaeae' }}
                                onChange={() => this.updatePrices()}
                                disabled={!customQty}
                            />
                        </div>
                    }
                </div>
            </div>
        )
    }

    renderMultiCheckbox = (ObjOptions, id = '0') => {
        const { options } = ObjOptions;
        const objM = [];
        for (const i in options) {
            const item = options[i];
            let selected = false;
            if (item.is_default) {
                selected = true;
            }
            let title = item.product.name;
            if (!item.can_change_quantity) {
                title = `${item.quantity} x ${title}`;
            }
            const element = (
                <div key={Identify.randomString(5)} className="option-row">
                    <Checkbox title={title} item={item} id={id} selected={selected} value={item.id} parent={this} type_id='bundle' />
                </div>);

            objM.push(element);
        }
        return objM;
    };

    renderContentAttribute = (ObjOptions, type = 'checkbox', id = '0') => {
        if (type === 'select') {
            return <Select data={ObjOptions} id={id} parent={this} type_id='bundle' />
        }
        if (type === 'multi' || type === 'checkbox') {
            return this.renderMultiCheckbox(ObjOptions, id)
        }
        return <Radio data={ObjOptions} id={id} parent={this} type_id='bundle' />
    }

    setParamQty = (keyQty = null) => {
        const obj = this;
        const { selected, data } = obj;
        const json = {};
        const qty = $('input.option-qty');
        qty.each(function () {
            const val = $(this).val();
            const id = $(this).attr('data-id');
            if (selected[id]) {
                json[id] = val;
            }
        });
        if (keyQty === 'bundle_option_qty' && Object.keys(json).length !== Object.keys(selected).length && data && data.length) {
            for (let k in selected) {
                if (!json.hasOwnProperty(k) || !json[k]) {
                    const optionFound = data.find(({ option_id }) => option_id === Number(k));
                    if (optionFound && (optionFound.type === "checkbox" || optionFound.type === "multi") && selected[k] instanceof Array) {
                        const { options } = optionFound;
                        const childOptFound = options.find(({ id }) => selected[k].indexOf(id) !== -1);
                        if (childOptFound) {
                            json[k] = childOptFound.quantity;
                        }
                    }
                }
            }
        }
        this.params[keyQty] = json;
    };

    getParams = () => {
        const { data, selected } = this;
        for (const i in data) {
            const attribute = data[i];
            if (attribute.type === 'radio' || attribute.type === 'select') {
                if (selected[i] && (selected[i] instanceof Array)) {
                    selected[i] = selected[i][0]
                }
            }
        }

        this.setParamOption('bundle_option');
        this.setParamQty('bundle_option_qty');
        const qty = $('input.bundle-qty').val();
        this.params['qty'] = qty;
        return this.params;
    };

    renderBtnCustomize = () => {
        return (
            <div role="presentation" className="" onClick={() => this.handleChangeBtn()}>
                <Whitebtn
                    style={{
                        paddingLeft: 20,
                        paddingRight: 20,
                        paddingBottom: 20,
                        marginBottom: 10
                    }}
                    id={`bundle-customize-n-addcart-btn`}
                    text={Identify.__('Customize & Add to Cart')}
                />
            </div>
        )
    }

    renderSummary = () => {
        const { selected, data } = this;

        let htmlSummary = null;
        if (data instanceof Array && data.length && selected instanceof Object && Object.keys(selected).length) {
            let arrayFound = [];
            for (let keySelected in selected) {
                const dataFound = data.find(({ option_id }) => Number(option_id) === Number(keySelected));
                const input = $('input.option-qty-' + keySelected);
                if (dataFound) {
                    const { options } = dataFound;
                    let listOptions = null;
                    if (selected[keySelected] && selected[keySelected] instanceof Array && options && options.length) {
                        listOptions = selected[keySelected].map((ick, ind) => {
                            const optFound = options.find(({ id }) => id === Number(ick));
                            if (!optFound) return null;
                            return <div key={ind}>{(input && input.length ? input.val() : optFound.quantity) + ' x ' + optFound.label}</div>
                        });
                    } else {
                        const optFound = options && options.length && selected.hasOwnProperty(keySelected) ? options.find(({ id }) => Number(id) === Number(selected[keySelected])) : null;
                        listOptions = optFound ? <div>{(input && input.length ? input.val() : optFound.quantity) + ' x ' + optFound.label}</div> : null;
                    }

                    arrayFound.push(<li key={keySelected}>
                        <b>{dataFound.title}</b>
                        {listOptions}
                    </li>)
                }
            }

            if (arrayFound.length) {
                htmlSummary = <React.Fragment>{arrayFound}</React.Fragment>;
            }

        }

        if (!htmlSummary) return null;

        return <div className="customer-customize-summary">
            <h4 className="summary-title">{Identify.__("Summary")}</h4>
            <ul className="summary-content">
                {htmlSummary}
            </ul>
        </div>
    }

    render() {
        const { state } = this
        const { configPrice } = state
        const { priceInclTax, priceExclTax } = configPrice
        const price_style = {
            color: configColor.price_color,
        }

        return (
            <div className="bundle-option-container">
                <div className="btn-bundle">
                    {this.renderBtnCustomize()}
                </div>
                <div className={`bundle-show-options bundle-show-options`} style={{ display: 'none' }}>
                    {this.renderOptions()}
                    {parseInt(priceInclTax, 10) ?
                        <React.Fragment>
                            <div className="your-customize-title">{Identify.__('Your Customization')}</div>
                            <div
                                className={`customize-price-bundle customize-price-bundle`}
                                id={`customize-price-bundle`}
                                style={{ display: (priceInclTax && priceExclTax) ? 'block' : 'none' }}>
                                <div className="configured_price_in">
                                    <span className={`label-price`}>
                                        {
                                            (priceExclTax && priceExclTax !== priceInclTax) && Identify.__('Incl. Tax')
                                        }
                                    </span>
                                    <span className="price" style={price_style}>
                                        {formatPrice(priceInclTax)}
                                    </span>
                                </div>
                                {
                                    (priceExclTax && priceExclTax !== priceInclTax) &&
                                    <div className="configured_price_ex">
                                        <span className={`label-price`}>{Identify.__('Excl. Tax')}</span>
                                        <span className="price" style={price_style}>
                                            {formatPrice(priceExclTax)}
                                        </span>
                                    </div>
                                }
                            </div>
                            {priceInclTax && priceExclTax ? this.renderSummary() : ''}
                        </React.Fragment> : ''
                    }
                </div>
            </div>
        )
    }
}
export default BundleOption;
