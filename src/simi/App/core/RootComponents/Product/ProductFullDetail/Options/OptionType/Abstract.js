import React from 'react';
import {configColor} from "src/simi/Config";
class Abstract extends React.Component {
    constructor(props) {
        super(props);
        this.parent = this.props.parent;
        this.key = this.props.id;
        this.selected = this.parent.selected;
        this.configColor = configColor;
        this.type_id = props.type_id?props.type_id:this.parent.getProductType()
    }

    setDefaultSelected = (val,multi=true)=>{
        const selectedKey = this.selected[this.key];
        if (!multi) {
            if (this.type_id === 'bundle') {
                return Number(selectedKey);
            }
            if (selectedKey && selectedKey.length > 0) {
                return parseInt(selectedKey[0], 10);
            }
            return 0;
        }
        if (selectedKey) {
            if (selectedKey instanceof Array ) {
                if (selectedKey.indexOf(val) > -1){
                    return true;
                }else{
                    return false;
                }
            }else {
                return val === Number(selectedKey);
            }
        }
        return false;
    };

    updateForBundle =(value,type)=> {
        if(this.parent.getProductType() === 'bundle'){
            const {data} = this.props;
            const item = data.options.find(({ id }) => id === value);
            const input = $(`.bundle-option-qty.`+type+' input');
            if(item){
                const qty = item.quantity;
                input.val(qty);
                input.attr('data-value', value);
                if (!item.can_change_quantity) {
                    input.attr('readonly', 'readonly');
                } else {
                    input.removeAttr('readonly')
                }
                $('#tier-prices-' + type + '-' + this.key + '').html(item.product.tier_price);
                return;
            }
            input.attr('data-value',0);
            $(`.bundle-option-qty.`+type+' input').removeAttr('readonly');
            $(`.bundle-option-qty.`+type+' input').val(0);
            $('#tier-prices-'+type+'').html('');
        }
    };

    updateSelected =(key,val)=>{
        this.parent.updateOptions(key,val);
    };

    deleteSelected =(key = this.key) => {
        this.parent.deleteOptions(key);
    };
}
export default Abstract;
