import React from 'react';
import Identify from 'src/simi/Helper/Identify';
import Price from 'src/simi/BaseComponents/Price'
import OptionBase from '../OptionBase'
import {Qty} from 'src/simi/BaseComponents/Input'

require('./groupedoptions.scss')

class GroupOptions extends OptionBase {
    renderOptions =()=>{
        const attributes = this.data;
        const objOptions = [];

        for (const i in attributes) {
            const attribute = attributes[i];
            const element = this.renderContentAttribute(attribute);
            objOptions.push(element);
        }
        const header = (
            <div className="row product-options-group-header">
                <div className={`col-sm-8 col-xs-8 ${Identify.isRtl()? 'pull-right' : ''}`} style={{textAlign: Identify.isRtl() ? 'right' : 'left',textTransform : 'uppercase',fontWeight : 600}}>
                    {Identify.__('Product')}
                </div>
                <div className={`col-sm-4 col-xs-4 ${Identify.isRtl()? 'pull-right' : ''}`} style={{textAlign: "center",textTransform : 'uppercase',fontWeight : 600,paddingLeft : 30}}>
                    {Identify.__('Qty')}
                </div>
            </div>
        );
        return (
            <div key={Identify.randomString(5)}>
                <form id="groupOption">
                    {(objOptions && objOptions.length > 0)?header:''}
                    {objOptions}
                </form>
            </div>);
    };

    renderContentAttribute = (attribute) => {
        const id = attribute.product.id
        const qty = attribute.qty;
        return (
            <div id={`attribute-${id}`} key={Identify.randomString(5)} className={`row product-options-group-item`}>
                <div className={`col-sm-8 col-xs-8 ${Identify.isRtl()? 'pull-right' : ''}`}>
                    <div className="option-title" style={{fontWeight : 500}}>{attribute.product.name}</div>
                    <Price type={attribute.product.type_id} prices={attribute.product.price}/>
                </div>
                <div className={`col-sm-4 col-xs-4 text-center ${Identify.isRtl()? 'pull-right' : ''}`}>
                    {
                        <Qty 
                            dataId={id}
                            key={id}
                            value={qty} 
                            className={`option-number option-qty option-qty-${id}`} 
                            inputStyle={{margin: '0 15px', borderRadius: 0, border: 'solid #eaeaea 1px', maxWidth: 50}} 
                            onChange={() => this.updatePrices()}
                        />
                    }
                </div>
            </div>);
    }

    setParamQty =(keyQty = null)=>{
        const json = {};
        const qty = $('input.option-qty');
        qty.each(function () {
            const val = $(this).val();
            const id = $(this).attr('data-id');
            json[id] = val;
        });
        this.params[keyQty] = json;
    };

    getParams = () => {
        this.setParamQty('super_group');
        return this.params;
    }

    render(){
        return (
            <div className="grouped-options">
                {this.renderOptions()}
            </div>
        )
    }
}
export default GroupOptions;