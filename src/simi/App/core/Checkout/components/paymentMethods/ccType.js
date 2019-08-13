import React, { useEffect, useState, useCallback, useRef } from 'react';

import defaultClass from './ccType.css';
import Identify from 'src/simi/Helper/Identify';
import CardHelper from 'src/simi/Helper/Card';
import Button from 'src/components/Button';
const $ = window.$;

const ccType = (props) => {
    const { onSuccess, cartCurrencyCode, cart, payment_method, paymentContent } = props;

    const numberRef = useRef();
    const monthRef = useRef();
    const yearRef = useRef();
    const cvcRef = useRef();

    const [errorMsg, setErrorMsg] = useState('');
    const [hasError, setHasError] = useState('');
    const secKey = paymentContent && paymentContent.public_key ? paymentContent.public_key : "";
    const test_3d_secure = paymentContent && paymentContent.hasOwnProperty('verify_3dsecure') ? parseInt(paymentContent.verify_3dsecure, 10) : 0;
    const initialValues = Identify.getDataFromStoreage(Identify.SESSION_STOREAGE, 'cc_card_data') ? Identify.getDataFromStoreage(Identify.SESSION_STOREAGE, 'cc_card_data') : '';

    const cartGrandTotals = () => {
        return cart && cart.totals && cart.totals.grand_total;
    }

    const getBaseUrl = () => {
        const storeConfig = Identify.getStoreConfig();
        return storeConfig && storeConfig.storeConfig && storeConfig.storeConfig.base_url
    }

    const onCCNUmberInput = e => {
        $(e.currentTarget).val(formatCC(e.currentTarget.value));
    };

    const formatCC = (value) => {
        let v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
        let cardByNUmber = CardHelper.detectCardType(v);

        let pattern = /\d{4,16}/g;
        let cardType = 'OT';
        /* if (cardByNUmber !== null) {
            pattern = cardByNUmber.cardFormatPattern;
            cardType = cardByNUmber.type;
            // auto pick Card Type By Number
            let paymentMethod = this.props.payment_item.payment_method;
            $('#' + paymentMethod).find('li.cc-item').each(function () {
                $(this).find('.check').hide();
                $(this).find('.uncheck').show();
            });
            let currentTarget = $('#' + cardByNUmber.type);
            currentTarget.find('.check').show();
            currentTarget.find('.uncheck').hide();
            currentTarget.parents('.lists-cc').find('input[name="cc_type"]').val(cardType);
            $('#cc_cid').attr('maxlength', cardByNUmber.cvcLength[0]).attr('placeholder', "*".repeat(cardByNUmber.cvcLength[0]));
        } */
        let regex = new RegExp(pattern, 'gi');
        let matches = v.match(regex);
        let match = (matches && matches[0]) ? matches[0] : '';
        let parts = [];

        for (let i = 0, len = match.length; i < len; i += 4) {
            parts.push(match.substring(i, i + 4))
        }

        if (parts.length) {
            return parts.join(' - ')
        } else {
            return value
        }
    };

    const responseToken = (card) => {
        const url = "https://api.stripe.com/v1/tokens";

        $.ajax({
            url: url, // Url to which the request is send
            headers: {
                Authorization: `Bearer ${secKey}`,
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            type: "POST",
            data: { card },
            success: function (data) {
                processData(data);

            },
            error: function (xhr, status, error) {
                const respondText = JSON.parse(xhr.responseText);
                if (respondText.error.message) {
                    setErrorMsg(respondText.error.message);
                }
                if (respondText.error.param) {
                    setHasError(respondText.error.param);
                }
            }
        });
    }

    const requestSource3D = (card) => {
        const url = "https://api.stripe.com/v1/sources";
        const payload = {
            'type': 'card',
            'currency': cartCurrencyCode,
            card
        }

        $.ajax({
            url: url, // Url to which the request is send
            headers: {
                Authorization: `Bearer ${secKey}`,
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            type: "POST",
            data: payload,
            success: function (data) {
                confirm3DSecure(data);
            },
            error: function (xhr, status, error) {
                const respondText = JSON.parse(xhr.responseText);
                if (respondText.error.message) {
                    setErrorMsg(respondText.error.message);
                }
                if (respondText.error.param) {
                    setHasError(respondText.error.param);
                }
            }
        });
    }

    const confirm3DSecure = (source_response) => {
        const url = "https://api.stripe.com/v1/sources";
        const { id } = source_response;
        const amount = parseFloat(cartGrandTotals(), 2) * 100;
        const return_url = getBaseUrl(); //window.location.origin.indexOf('localhost') > -1 ? "https://simicart-siminia-hsmrn.local.pwadev:8495/" : getBaseUrl();
        const payload = {
            type: 'three_d_secure',
            'three_d_secure[card]': id,
            'redirect[return_url]': return_url + 'checkout.html?confirmed_3d_secure=stripe',
            key: secKey,
            currency: cartCurrencyCode,
            amount
        };
        $.ajax({
            url, // Url to which the request is send
            headers: {
                Authorization: `Bearer ${secKey}`,
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            type: "POST",
            data: payload,
            success: function (data) {
                if (data instanceof Object && data.amount > 0) {
                    secureData(data);
                }
            },
            error: function (xhr, status, error) {
                const respondText = JSON.parse(xhr.responseText);
                if (respondText.error.message) {
                    setErrorMsg(respondText.error.message);
                }
                if (respondText.error.param) {
                    setHasError(respondText.error.param);
                }
            }
        });
    }

    const submitCC = async () => {
        let card = {};
        setErrorMsg('');
        setHasError('');

        card["number"] = numberRef.current.value;
        card["exp_month"] = monthRef.current.value;
        card["exp_year"] = yearRef.current.value;
        card["cvc"] = cvcRef.current.value;

        if (!numberRef.current.value || !monthRef.current.value || !yearRef.current.value || !cvcRef.current.value) {
            if (!numberRef.current.value) {
                setHasError('number');
                setErrorMsg(Identify.__('Your card\'s expiration number is invalid'));
                return;
            }
            if (!monthRef.current.value) {
                setHasError('exp_month');
                setErrorMsg(Identify.__('Your card\'s expiration month is invalid'));
                return;
            }
            if (!yearRef.current.value) {
                setHasError('exp_year');
                setErrorMsg(Identify.__('Your card\'s expiration year is invalid'));
                return;
            }
            if (!cvcRef.current.value) {
                setHasError('cvc');
                setErrorMsg(Identify.__('Your card\'s security code is invalid.'));
                return;
            }
        }

        Identify.storeDataToStoreage(Identify.SESSION_STOREAGE, 'cc_card_data', card);

        if (test_3d_secure) {
            requestSource3D(card);
        } else {
            responseToken(card);
        }
    }

    const processData = (data) => {
        const { card } = data;

        const paymentData = {
            cc_cid: "",
            cc_exp_month: card.exp_month,
            cc_exp_year: card.exp_year,
            cc_last4: card.last4,
            cc_number: "",
            cc_ss_issue: "",
            cc_ss_start_month: "",
            cc_ss_start_year: "",
            cc_token: data.id,
            cc_type: card.brand,
        };
        onSuccess(paymentData);
    }

    const secureData = (response) => {
        const { three_d_secure, redirect } = response;
        const paymentData = {
            cc_cid: "",
            cc_exp_month: three_d_secure.exp_month,
            cc_exp_year: three_d_secure.exp_year,
            cc_last4: three_d_secure.last4,
            cc_number: "",
            cc_ss_issue: "",
            cc_ss_start_month: "",
            cc_ss_start_year: "",
            cc_token: response.id,
            cc_type: three_d_secure.brand,
        };

        const dataSave = {
            code: payment_method,
            data: paymentData
        }
        Identify.storeDataToStoreage(Identify.SESSION_STOREAGE, 'cc_3DSecure_stripe', dataSave);
        window.location.replace(redirect.url);
    }

    return (
        <div className="container-cc_form">
            <div className={`cc-field form-group ${hasError === 'number' ? 'has-error' : ''}`}>
                <label htmlFor="cc_number">
                    {Identify.__('Credit Card Number')}
                    <span className="label-required">*</span>
                </label>
                <input name="cc_number" id="cc_number" ref={numberRef} defaultValue={initialValues && initialValues.hasOwnProperty('number') ? initialValues.number : ''} className="form-control" type="text" onInput={(e) => onCCNUmberInput(e)} placeholder="xxxx - xxxx - xxxx - xxxx" />
            </div>
            <div className={`cc-field form-group ${hasError === 'exp_month' ? 'has-error' : ''}`}>
                <label htmlFor="cc_month">
                    {Identify.__('Month')}
                    <span className="label-required">*</span>
                </label>
                <input name="cc_month" id="cc_month" ref={monthRef} defaultValue={initialValues && initialValues.hasOwnProperty('exp_month') ? initialValues.exp_month : ''} className="form-control" type="text" />
            </div>
            <div className={`cc-field form-group ${hasError === 'exp_year' ? 'has-error' : ''}`}>
                <label htmlFor="cc_year">
                    {Identify.__('Year')}
                    <span className="label-required">*</span>
                </label>
                <input name="cc_year" id="cc_year" ref={yearRef} defaultValue={initialValues && initialValues.hasOwnProperty('exp_year') ? initialValues.exp_year : ''} className="form-control" type="text" />
            </div>
            <div className={`cc-field form-group ${hasError === 'cvc' ? 'has-error' : ''}`}>
                <label htmlFor="cc_cvc">
                    {Identify.__('CVV')}
                    <span className="label-required">*</span>
                </label>
                <input name="cc_cvc" id="cc_cvc" ref={cvcRef} defaultValue={initialValues && initialValues.hasOwnProperty('cvc') ? initialValues.cvc : ''} className="form-control" type="text" />
            </div>
            {errorMsg && <div className={defaultClass["cc-msg-error"]}>{errorMsg}</div>}
            <Button
                className={defaultClass['submitCC']}
                style={{ marginTop: 10, marginBottom: 20 }}
                type="button"
                onClick={() => submitCC()}
            >{Identify.__('Use Card')}</Button>
        </div>
    );
}

export default ccType;
