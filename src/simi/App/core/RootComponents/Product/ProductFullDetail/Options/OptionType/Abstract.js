import React from 'react';
import {configColor} from "src/simi/Config";
class Abstract extends React.Component {
    constructor(props){
        super(props);
        this.parent = this.props.parent;
        this.key = this.props.id;
        this.selected = this.parent.selected;
        this.configColor = configColor;
        this.type_id = props.type_id?props.type_id:this.parent.getProductType()
    }
    
    setDefaultSelected = (val,multi=true)=>{
        const selectedKey = this.selected[this.key];
        if(!multi){
            if(selectedKey && selectedKey.length > 0){
                return parseInt(selectedKey[0],10);
            }
            return 0;
        }
        if(selectedKey){
            if(selectedKey.indexOf(val) > -1){
                return true;
            }
        }
        return false;
    };

    updateForBundle =(value,type)=>{
        const {classes} = this.props
        if(this.parent.getProductType() === 'bundle'){
            const {data} = this.props;
            const item = data.selections[value];
            const input = $(`.${classes['bundle-option-qty']}.`+type+' input');
            if(item){
                const qty = item.qty;
                input.val(qty);
                input.attr('data-value',value);
                const customQty = parseInt(item.customQty,10);
                if(customQty === 0){
                    input.attr('readonly','readonly');
                }else{
                    input.removeAttr('readonly')
                }
                $('#tier-prices-'+type+'-'+this.key+'').html(item.tierPriceHtml);
                return;
            }
            input.attr('data-value',0);
            $(`.${classes['bundle-option-qty']}.`+type+' input').removeAttr('readonly');
            $(`.${classes['bundle-option-qty']}.`+type+' input').val(0);
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