import React from 'react';
import {formatPrice} from "src/simi/Helper/Pricing";
import {configColor} from "src/simi/Config";

class OptionBase extends React.Component {
    constructor(props) {
        super(props);
        this.data = this.props.app_options?this.props.app_options:{};
        this.parentObj = this.props.parent;
        this.selected = {};
        this.required = [];
        this.params = {
            'product' : this.props.product_id
        };
        this.PriceComponent = this.parentObj.Price;
    }

    renderOptions =()=>{
        return <div></div>;
    };

    renderOptionPrice = (price) => {
        return <span className="price" style={{color : configColor.price_color,marginLeft:0,fontSize : 16}}>{formatPrice(price)}</span>
    };

    renderLabelRequired = (show = 1) => {
        if(show === 1){
            return <span className="required-label" style={{marginLeft : '5px', color : '#ff0000'}}>*</span>;
        }
        return null;
    };

    updatePrices=(selected = this.selected) =>{
        console.log(selected)
        return <div></div>;
    };

    updateOptions =(key,val)=>{
        this.selected[key] = val;
        this.updatePrices();
    };

    deleteOptions =(key)=>{
        if(this.selected[key]){
            delete this.selected[key];
            this.updatePrices();
        }
    }

    setParamOption = (keyOption = null) => {
        if(keyOption === null) return ;
        this.params[keyOption] = this.selected;
    };

    getProductType = () => {
        return this.parentObj.props.product.type_id;
    };

    /*
    *  get Params Add to Cart
    * */
    getParams = () => {
        return this.params;
    };

    checkOptionRequired =(selected = this.selected,required=this.required)=>{
        let check = true;
        for (const i in required){
            const requiredOptionId = required[i];
            if(!selected.hasOwnProperty(requiredOptionId) || !selected[requiredOptionId] || selected[requiredOptionId].length === 0){
                check = false;
                break;
            }
        }
        return check;
    }
}

export default OptionBase;