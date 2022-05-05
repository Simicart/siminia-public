import React, { useState, Fragment } from 'react'
import defaultClasses from './giftCard.module.css'
import { useStyle } from '@magento/venia-ui/lib/classify';

const GiftCardInformationForm = props => {
    const {giftCardActions, giftCardData, giftCardProductData} = props

    const classes = useStyle(defaultClasses, props.classes);

    const {
        activeAmount,
        gcMessage,
        delivery,
        currentTemplate
    } = giftCardData

    const {
        setGcAmount,
        setActiveAmount,
        setGcPrice,
        setGcMessage,
        setGcFrom,
        setGcTo,
        setDelivery,
        setEmail,
        setPhone,
    } = giftCardActions

    const {
        allow_amount_range,
        min_amount,
        max_amount,
        gift_card_type,
        price_rate,
        amounts,
    } = giftCardProductData

    const hasFromAndToField = currentTemplate && Object.keys(currentTemplate).length > 0 ? typeof JSON.parse(currentTemplate.design).from !== "undefined" : null

    const onAmountBlur = (e) => {
        let value = e.target.value
        if(isNaN(value)) {
            e.target.value = ''
        }
        else if (value.length == 0) return;
        else {
            if (value < min_amount) {
                setGcAmount(min_amount)
                setGcPrice(min_amount*price_rate/100)
                e.target.value = min_amount
            } else if (value > max_amount) {
                e.target.value = max_amount
                setGcAmount(max_amount)
                setGcPrice(max_amount*price_rate/100)
            } else {
                setGcAmount(value)
                setGcPrice(value*price_rate/100)
            }
        }
    }
    const onMessageChange = (e) => {
        setGcMessage(e.target.value)
    }
    const onFromChange = (e) => {
        setGcFrom(e.target.value)
    }
    const onToChange = (e) => {
        setGcTo(e.target.value)
    }
    const onEmailChange = (e) => {
        setEmail(e.target.value)
    }
    const onPhoneChange = (e) => {
        setPhone(e.target.value)
    }

    return (
        <div style={{
            padding: '1.5rem 0',
            overflow: 'hidden'
        }}>
            <div className={classes['giftcard-information'] + ' ' + classes['giftcard-information-amount']}>
                <div className={classes['giftcard-field-label']}>Amount</div>
                <div className={classes['giftcard-field-wrapper']}>
                    <ul className={classes["giftcard-amount"]}>
                        {  
                            amounts.map(({amount, price}, i) => {
                                let active = '';
                                if(activeAmount === i) {
                                    active = classes.active
                                }
                                return (
                                    <li 
                                        className={classes["giftcard-design-button-container"]  + ' ' + active} 
                                        onClick={(e) => {
                                            setGcAmount(amount)
                                            setGcPrice(price)
                                            setActiveAmount(i)
                                        }}
                                        key={i}
                                    >
                                        <button type="button" className={classes["giftcard-design-button"]} >
                                            <span>${amount}.00</span>
                                        </button>
                                    </li>
                                )
                            })
                        }
                        { allow_amount_range ? 
                            <li className={classes["giftcard-design-input-container"]}>
                                <input 
                                    onFocus={() => setActiveAmount(amounts.length)}
                                    onBlur={onAmountBlur}
                                    placeholder='Enter Amount'
                                />
                            </li>
                            : null
                        }
                    </ul>
                </div>
            </div>
            <div className={classes['giftcard-information'] + ' ' + classes['giftcard-information-delivery']}>
                <div className={classes['giftcard-field-label']}>Delivery</div>
                <div className={classes['giftcard-field-wrapper']}>
                    <ul className={classes["giftcard-delivery"]}>
                        { gift_card_type === 1 &&
                            <Fragment>
                                <li className={`${classes["giftcard-design-button-container"]} ${delivery === 1 ? classes.active : ''}`}>
                                    <button 
                                        type="button" 
                                        className={classes["giftcard-design-button"]} 
                                        onClick={() => setDelivery(1)}
                                    >
                                        <span>Email</span>
                                    </button>
                                </li>
                                <li className={`${classes["giftcard-design-button-container"]} ${delivery === 2 ? classes.active : ''}`}>
                                    <button 
                                        type="button" 
                                        className={classes["giftcard-design-button"]} 
                                        onClick={() => setDelivery(2)}
                                    >
                                        <span>Text message</span>
                                    </button>
                                </li>
                            </Fragment>
                        }
                        { gift_card_type === 2 && 
                            <li className={`${classes["giftcard-design-button-container"]} ${delivery === 3 ? classes.active : ''}`}>
                                <button 
                                    type="button" 
                                    className={classes["giftcard-design-button"]}
                                    onClick={() => setDelivery(3)}
                                >
                                    <span>Print at home</span>
                                </button>
                            </li>
                        }
                        { gift_card_type === 3 && 
                            <li className={`${classes["giftcard-design-button-container"]} ${delivery === 4 ? classes.active : ''}`}>
                                <button 
                                    type="button" 
                                    className={classes["giftcard-design-button"]}
                                    onClick={() => setDelivery(4)}
                                >
                                    <span>Post Office</span>
                                </button>
                            </li>
                        }
                    </ul>
                </div>
            </div>
            <div className={classes["giftcard-information-delivery-content"] + ' ' + classes["fieldset"]}>
                <div className={classes["field"] + ' ' + classes["giftcard-information"] + ' ' + classes["giftcard-information-delivery-field"]}>
                    { (gift_card_type === 1 && delivery === 1) &&
                        <div className={classes["field"] + ' ' + classes["giftcard-information"] + ' ' + classes["giftcard-information-delivery-field"] + ' ' + classes["required"]}>
                            <label className={classes['giftcard-field-label'] + ' ' + classes['label']}>
                                <span for="email">Email</span>
                            </label>
                            <div className={classes['giftcard-field-wrapper']}>
                                <input type="email" placeholder="Recipient email" onChange={onEmailChange} required/>
                            </div>
                        </div>
                    }
                    { (gift_card_type === 1 && delivery === 2)&& 
                        <div className={classes["field"] + ' ' + classes["giftcard-information"] + ' ' + classes["giftcard-information-delivery-field"] + ' ' + classes["required"]}>
                            <label className={classes['giftcard-field-label'] + ' ' + classes['label']}>
                                <span for="phone number">Phone num.</span>
                            </label>
                            <div className={classes['giftcard-field-wrapper']}>
                                <input type="text" placeholder="Recipient phone number" onChange={onPhoneChange} required/>
                            </div>
                        </div>
                    }
                    { gift_card_type != 1 &&
                        <label className={classes['giftcard-field-label'] + ' ' + classes['label']}>
                            <span htmlFor="post_label"></span>
                        </label>
                    }
                    <div className={classes['giftcard-note-wrapper']}>
                        <p className={classes.note}>
                            {gift_card_type === 2 && <span >You can print gift card on the confirmation email or the Gift Card in your account.</span>}
                            {gift_card_type === 3 && <span >Please input shipping address when checking out.</span>}
                        </p>
                    </div>
                </div>
                { hasFromAndToField &&
                    <Fragment>
                        <div className={classes["field giftcard-information"] + ' ' + classes["giftcard-information-delivery-field"]}>
                            <label className={classes['giftcard-field-label'] + ' ' + classes['label']}>
                                <span>Sent From</span>
                            </label>
                            <div className={classes['giftcard-note-wrapper']}>
                                <input className={classes.from} placeholder='Sender name' onChange={onFromChange}/>
                            </div>
                        </div>
                        <div className={classes["field giftcard-information"] + ' ' + classes["giftcard-information-delivery-field"]}>
                            <label className={classes['giftcard-field-label'] + ' ' + classes['label']}>
                                <span>Sent To</span>
                            </label>
                            <div className={classes['giftcard-note-wrapper']}>
                                <input className={classes.to} placeholder='Recipient name' onChange={onToChange}/>
                            </div>
                        </div>
                    </Fragment>
                }
                <div className={classes["field giftcard-information"] + ' ' + classes["giftcard-information-delivery-field"]} id="delivery-message">
                    <label className={classes['giftcard-field-label'] + ' ' + classes['label']}>
                        <span htmlFor="message">Message</span>
                    </label>
                    <div className={classes['giftcard-note-wrapper']}>
                        <textarea name="message" maxLength="120" placeholder="" onChange={onMessageChange}></textarea>
                        <p className={classes.note}>
                            <span>{120-gcMessage.length} characters remaining</span>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default GiftCardInformationForm
