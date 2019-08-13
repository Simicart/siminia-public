import React from 'react';
import { Whitebtn } from 'src/simi/BaseComponents/Button'
//import {smoothScrollToView} from 'src/simi/Helper/Behavior'
import Identify from "src/simi/Helper/Identify";
import {configColor} from "src/simi/Config";
import Radio from '../OptionType/Radio';
import Select from '../OptionType/Select';
import Checkbox from '../OptionType/Checkbox';
import OptionBase from '../OptionBase'
import defaultClasses from './bundleoption.css'
import { formatPrice } from 'src/simi/Helper/Pricing';
import {Qty} from 'src/simi/BaseComponents/Input'

class BundleOption extends OptionBase {
    classes = defaultClasses
    showingOption = false
    state = {
        configPrice: {
            priceExclTax: 0,
            priceInclTax: 0,
        }
    }

    handleChangeBtn = ()=>{
        const obj = this
        $('.bundle-show-options').slideToggle('fast',function () {
            //smoothScrollToView($('.customize-price-bundle'))
            obj.showingOption = !obj.showingOption
            $(`#bundle-customize-n-addcart-btn`).html(obj.showingOption?Identify.__('Back to product details'):Identify.__('Customize & Add to Cart'))
        });
    };

    renderOptions = () => {
        const attributes = this.data.bundle_options.options;
        const objOptions = [];
        this.selected = this.data.bundle_options.selected;
        const selected = this.props.selected ? this.props.selected : null;
        for (const i in attributes) {
            const obj = attributes[i];
            let labelRequried = '';
            if (obj.isRequired === "1") {
                labelRequried = "*";
                this.required.push(i);
            }
            if (selected) {
                const values = selected[i];
                if (values && values.length) {
                    obj.values = values;
                }
            }
            const type = obj.type
            const element = this.renderAttribute(type,obj,i,labelRequried);
            objOptions.push(element);
        }
        return (<div>
            <form id="options">{objOptions}</form>
        </div>);
    };


    getTierPriceElement = (element) => {
        if(element.tierPrice && element.tierPrice.length > 0){
            for (const t in element.tierPrice) {
                const item = element.tierPrice[t];
                if(qty === parseInt(item.price_qty,10)){
                    return item;
                }
            }
        }
        return element
    }

    updatePrices = (selected = this.selected) =>{
        let priceInclTax = 0;
        let priceExclTax = 0;
        const attributes = this.data.bundle_options.options;
        for (const i in selected) {
            const values = selected[i];
            const option = attributes[i];
            const selections = option.selections;
            if (values) {
                const input = $('input.option-qty-'+i)
                if(values instanceof Array) { //multi select
                    for (const j in values) {
                        let element = selections[values[j]];
                        if (element && element.prices) {
                            const qty = input.val()?parseInt(input.val(), 10): element.qty;
                            element = this.getTierPriceElement(element)
                            priceExclTax += parseFloat(parseFloat(element.prices.basePrice.amount)*qty);
                            priceInclTax += parseFloat(parseFloat(element.prices.finalPrice.amount)*qty);
                        }
                    }
                } else { //single select
                    let element = selections[values];
                    if (element && element.prices) {
                        const qty = input.val()?parseInt(input.val(), 10): element.qty; 
                        element = this.getTierPriceElement(element)
                        priceExclTax += parseFloat(parseFloat(element.prices.basePrice.amount)*qty);
                        priceInclTax += parseFloat(parseFloat(element.prices.finalPrice.amount)*qty);
                    }
                }
            }
        }
        this.setState({configPrice: {priceInclTax, priceExclTax}})
    };

    renderAttribute = (type, obj, id, labelRequried) => {
        const {classes} = this
        const hidden = obj.isMulti || type === 'checkbox' ? 'hidden' : '';
        const {selected} = this
        const attributes = this.data.bundle_options.options;
        let customQty = false
        let defaultQty = 1

        if (attributes[id] && selected[id] && attributes[id]["selections"][selected[id]]) {
            defaultQty = attributes[id]["selections"][selected[id]].qty
            if (attributes[id]["selections"][selected[id]].customQty)
                customQty = parseInt(attributes[id]["selections"][selected[id]].customQty, 10)
        }

        return (
            <div key={id} className={classes["option-select"]}>
                <div className={classes["option-title"]} style={{fontSize : '18px',height : 30}}>
                    <span>{obj.title} <span style={{marginLeft:'5px',color :'red'}}>{labelRequried}</span></span>
                </div>
                <div className={classes["option-content"]} id="bundle-options">
                    <div className={classes["option-list"]} style={{marginBottom : '0'}}>
                        {this.renderContentAttribute(obj, type, id)}
                    </div>
                    {!hidden &&
                        <div className={`${classes['bundle-option-qty']} ${type}`} data-name={id} style={{
                            marginLeft : '25px',
                            fontWeight : 600
                        }}>
                            <span>{Identify.__('Quantity')}</span>
                            <Qty 
                                dataId={id}
                                key={selected[id]?selected[id]:id}
                                className={`${classes['option-qty']} option-qty option-qty-${id}`} 
                                value={defaultQty} 
                                inputStyle={{margin: '0 15px', borderRadius: 0, border: 'solid #eaeaea 1px', maxWidth: 50, color: customQty?'black':'#aeaeae'}} 
                                classes={classes}
                                onChange={() => this.updatePrices()}
                                disabled={!customQty}
                            />
                        </div>
                    }
                </div>
            </div>
        )
    }

    renderMultiCheckbox =(ObjOptions, id = '0')=>{
        const {classes} = this
        const options = ObjOptions.selections;
        const values = ObjOptions.values;
        const objs = [];
        for (const i in options) {
            const item = options[i];
            let selected = false;
            if (values && values.indexOf(i.toString()) >= 0) {
                selected = true;
            }
            let title = item.name
            if (!parseInt(item.customQty, 10)) {
                title = `${item.qty} x ${item.name}`
            }
            const element = (
                <div key={Identify.randomString(5)} className={classes["option-row"]}>
                    <Checkbox title={title} item={item} id={id} selected={selected} value={i} parent={this} classes={classes} type_id='bundle'/>
                </div>);

            objs.push(element);
        }
        return objs;
    };

    renderContentAttribute = (ObjOptions, type = 'checkbox', id = '0') => {
        const {classes} = this
        const key = id;
        if(type === 'select'){
            return <Select data={ObjOptions} id={key} parent={this} classes={classes} type_id='bundle'/>
        }
        if (ObjOptions.isMulti) {
            return this.renderMultiCheckbox(ObjOptions, id)
        }
        return <Radio data={ObjOptions} id={key} parent={this} classes={classes} type_id='bundle'/>
    }

    setParamQty =(keyQty = null)=>{
        const obj = this;
        const json = {};
        const qty = $('input.option-qty');
        qty.each(function () {
            const val = $(this).val();
            const id = $(this).attr('data-id');
            if(obj.selected[id]){
                json[id] = val;
            }
        });
        this.params[keyQty] = json;
    };

    getParams = ()=>{
        const selected = this
        const attributes = this.data.bundle_options.options
        //handle single option bundle
        for (const i in attributes) {
            const attribute = attributes[i];
            if (!attribute.isMulti || !parseInt(attribute.isMulti)) {
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

    renderBtnCustomize =()=>{
        return(
            <div role="presentation" className="" onClick={()=>this.handleChangeBtn()}>
                <Whitebtn
                    style={{
                        paddingLeft: 20,
                        paddingRight: 20,
                        paddingBottom: 20,
                        marginBottom : 10
                    }}
                    id={`bundle-customize-n-addcart-btn`}
                    text={Identify.__('Customize & Add to Cart')}
                />
            </div>
        )
    }

    render(){
        const {classes, state} = this
        const {configPrice} = state
        const {priceInclTax, priceExclTax} = configPrice
        const price_style = {
            color : configColor.price_color,
        }

        return (
            <div className={classes["bundle-option-container"]}>
                <div className={classes["btn-bundle"]}>
                    {this.renderBtnCustomize()}
                </div>
                <div className={`${classes["bundle-show-options"]} bundle-show-options`} style={{display : 'none'}}>
                    {this.renderOptions()}
                    {   parseInt(priceInclTax, 10) ?
                        <React.Fragment>
                            <div className={classes["your-customize-title"]}>{Identify.__('Your Customization')}</div>
                            <div 
                                className={`${classes["customize-price-bundle"]} customize-price-bundle`} 
                                id={`customize-price-bundle`} 
                                style={{display : (priceInclTax && priceExclTax)?'block':'none'}}>
                                    <div className={classes["configured_price_in"]}>
                                        <span className={`${classes['label-price']}`}>
                                            {
                                                (priceExclTax && priceExclTax !== priceInclTax) && Identify.__('Incl. Tax')
                                            }
                                        </span>
                                        <span className={classes["price"]} style={price_style}>
                                            {formatPrice(priceInclTax)}
                                        </span>
                                    </div>
                                {
                                    (priceExclTax && priceExclTax !== priceInclTax) &&
                                    <div className={classes["configured_price_ex"]}>
                                        <span className={`${classes['label-price']}`}>{Identify.__('Excl. Tax')}</span>
                                        <span className={classes["price"]} style={price_style}>
                                            {formatPrice(priceExclTax)}
                                        </span>
                                    </div>
                                }
                            </div>
                        </React.Fragment> : ''
                    }
                </div>
            </div>
        )
    }
}
export default BundleOption;