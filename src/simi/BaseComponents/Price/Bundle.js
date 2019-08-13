import React from 'react';
import Abstract from './Abstract';
import Identify from 'src/simi/Helper/Identify';

class BundlePrice extends Abstract {

    showConfiguredPrice =(element,price,label = null)=>{
      $(function () {
          if(price) {
              $(element).show();
              $(element).children('.price').html(Identify.formatPrice(price));
              $(element).children('.label-price').html(label);
          }
      })
    };

    renderView=()=>{
        const {classes} = this.props
        
        let product_from_label = <div></div>;
        let from_price_excluding_tax = <div></div>;
        let from_price_including_tax = <div></div>;
        let product_to_label = <div></div>;
        let to_price_excluding_tax = <div></div>;
        let to_price_including_tax = <div></div>;

        if (this.prices.show_ex_in_price && this.prices.show_ex_in_price === 1) {
            product_from_label = <div>{Identify.__('From')}:</div>;
            from_price_excluding_tax =
                <div>{Identify.__('Excl. Tax')}: {this.formatPrice(this.prices.minimalPrice.excl_tax_amount.value)}</div>
            from_price_including_tax =
                <div>{Identify.__('Incl. Tax')}: {this.formatPrice(this.prices.minimalPrice.amount.value)}</div>

            product_to_label = <div>{Identify.__('To')}:</div>;
            to_price_excluding_tax =
                <div>{Identify.__('Excl. Tax')}: {this.formatPrice(this.prices.maximalPrice.excl_tax_amount.value)}</div>
            to_price_including_tax =
                <div>{Identify.__('Incl. Tax')}: {this.formatPrice(this.prices.maximalPrice.amount.value)}</div>
        } else {
            product_from_label =
                <div>{Identify.__('From')}: {this.formatPrice(this.prices.minimalPrice.amount.value)}</div>;
            product_to_label =
                <div>{Identify.__('To')}: {this.formatPrice(this.prices.maximalPrice.amount.value)}</div>;
        }
        
        return (
            <div className={`${classes['product-prices']} small`}>
                {product_from_label}
                {from_price_excluding_tax}
                {from_price_including_tax}
                {product_to_label}
                {to_price_excluding_tax}
                {to_price_including_tax}
            </div>
        );
    }

    render(){
        return super.render();
    }
}
export default BundlePrice;