import React from 'react';
import { func, string } from 'prop-types';
import { showFogLoading, hideFogLoading } from 'src/simi/BaseComponents/Loading/GlobalLoading';
import { updateCoupon } from 'src/simi/Model/Cart';
import Identify from 'src/simi/Helper/Identify';
import { Whitebtn } from 'src/simi/BaseComponents/Button'
import Close from 'src/simi/BaseComponents/Icon/TapitaIcons/Close'
require ('./style.scss')

const Coupon = (props) => {
    const { value, toggleMessages, getCartDetails } = props;
    let clearCoupon = false;
    const handleCoupon = (type = '') => {
        let coupon = document.querySelector('#coupon_field').value;
        if (!coupon && type !== 'clear') {
            toggleMessages([{ type: 'error', message: 'Please enter coupon code', auto_dismiss: true }]);
            return null;
        }
        if(type === 'clear'){
            clearCoupon = true
            coupon = ''
        }
        showFogLoading()
        const params = {
            coupon_code: coupon
        }
        updateCoupon(processData, params)
    }

    const processData = (data) => {
        let text = '';
        let success = false;
        if (data.message) {
            const messages = data.message;
            for (let i in messages) {
                const msg = messages[i];
                text += msg + ' ';
            }
        }
        if (data.total && data.total.coupon_code) {
            success = true;
        }
        if(clearCoupon){
            clearCoupon = false
            success = true
            document.querySelector('#coupon_field').value = ''
        }
        if (text) toggleMessages([{ type: success ? 'success' : 'error', message: text, auto_dismiss: true }]);
        getCartDetails();
        hideFogLoading();
    }

    return <div className='coupon-code'>
        <div className="coupon-code-title">{Identify.__('Promo code')}</div>
        <div className="coupon-code-area-tablet">
            <input id="coupon_field" type="text" placeholder={Identify.__('enter code here')} defaultValue={value} />
            {value && <button className='btn-clear-coupon' onClick={()=>handleCoupon('clear')}>
                        <Close style={{width:15,height:15}}/>
                    </button>   }
        </div>
        <Whitebtn id="submit-coupon" className={`${Identify.isRtl() ? "submit-coupon-rtl" : 'submit-coupon'}`} onClick={() => handleCoupon()} text={Identify.__('Apply')} />
    </div>
}

Coupon.propTypes = {
    value: string,
    toggleMessages: func,
    getCartDetails: func
}
export default Coupon;
