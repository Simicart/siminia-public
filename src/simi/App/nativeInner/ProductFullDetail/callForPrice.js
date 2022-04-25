import React, { useState } from 'react';
import { configColor } from 'src/simi/Config';
import defaultClasses from './callForPrice.module.css';
import { useStyle } from '@magento/venia-ui/lib/classify';
import { GrClose } from 'react-icons/gr';
import { Form, Text } from 'informed';
import Field from '@magento/venia-ui/lib/components/Field';
import TextInput from '@magento/venia-ui/lib/components/TextInput';
import { SUBMIT_POPUP_FORM } from '../talons/CallForPrice/callForPrice.gql';
import { isRequired } from '@magento/venia-ui/lib/util/formValidators';
import { useUserContext } from '@magento/peregrine/lib/context/user';
import { Link } from 'react-router-dom';
import { useMutation, useQuery } from '@apollo/client';
import Loader from '../Loader'
import AlertMessages from '../ProductFullDetail/AlertMessages'
const CallForPrice = props => {
    const { data, wrapperPrice, item_id } = props;
    
    const [isPopupOpen, setOpenPopup] = useState(false);
    const classes = useStyle(defaultClasses, props.classes);

    const [alertMsg, setAlertMsg] = useState(-1)    

    const [mpCallForPriceRequest, { data: dataSubmit, loading }] = useMutation(
        SUBMIT_POPUP_FORM
    );
    const [{ isSignedIn }] = useUserContext();
    const showFields = data && data.show_fields ?  data.show_fields.split(',') : null
    const successMsg = `Request success !`;
    const handleSubmitReview = async formValue => {
        const { email, note, name, phone } = formValue;
        // console.log(formValue);
        await mpCallForPriceRequest({
            variables: {
                product_id: item_id,
                store_ids: data.store_ids,
                name : showFields?.includes('name') ? name : "*",
                phone: showFields?.includes('phone') ? phone : "*",
                email: showFields?.includes('email') ? email : "*",
                customer_note: showFields?.includes('customer_note') ? note : "*",
            }
        });
        setAlertMsg(true)
        setOpenPopup(false)
    };
    let topInsets = 0;
    let bottomInsets = 0;
    try {
        if (window.simicartRNinsets) {
            const simicartRNinsets = JSON.parse(window.simicartRNinsets);
            topInsets = parseInt(simicartRNinsets.top);
            bottomInsets = parseInt(simicartRNinsets.bottom);
        } else if (window.simpifyRNinsets) {
            const simpifyRNinsets = JSON.parse(window.simpifyRNinsets);
            topInsets = parseInt(simpifyRNinsets.top);
            bottomInsets = parseInt(simpifyRNinsets.bottom);
        }
    } catch (err) {}


    

    const form = (
        <Form onSubmit={handleSubmitReview}>
            {showFields?.includes('name') && <Field required={true}>
                <TextInput
                    placeholder="name"
                    field="name"
                    type="text"
                    validate={isRequired}
                />
            </Field>}
            {showFields?.includes('email') &&<Field required={true}>
                <TextInput
                    placeholder="email"
                    field="email"
                    type="email"
                    validate={isRequired}
                />
            </Field>}
            {showFields?.includes('phone') && <Field required={true}>
                <TextInput
                    placeholder="phone"
                    field="phone"
                    type="phone"
                    validate={isRequired}
                />
            </Field>}
            {showFields?.includes('customer_note') && <Field required={true}>
                <TextInput
                    placeholder="Customer note"
                    field="note"
                    type="text"
                    validate={isRequired}
                />
            </Field>}
            <div className={classes.submitBtnContainer}>
                <button
                    style={{
                        width: '100%',
                        marginTop: 10,
                        background: configColor.button_background,
                        color: configColor.button_text_color,
                        padding: 5,
                        borderRadius: 4
                    }}
                    className={classes.submitReviewBtn}
                    type="submit"
                >
                    submit
                </button>
            </div>
        </Form>
    );
    const renderPriceWithCallForPrice = callForPriceRule => {
        if (
            callForPriceRule &&
            callForPriceRule.action &&
            callForPriceRule.action === 'login_see_price'
        ) {
            if (!isSignedIn) {
                return (
                    <div
                        style={{
                            backgroundColor: configColor.button_background,
                            padding: '5px 10px',
                            color: configColor.button_text_color,
                            borderRadius: '2px',
                            margin: '10px 0px',
                            width: 'fit-content'
                        }}
                    >
                        <Link to="/sign-in">
                            {callForPriceRule.button_label}
                        </Link>
                    </div>
                );
            } else return <>{wrapperPrice}</>;
        } else if (
            callForPriceRule &&
            callForPriceRule.action &&
            callForPriceRule.action === 'popup_quote_form'
        ) {
            return (
                <>
                    <div
                        style={{
                            backgroundColor: configColor.button_background,
                            padding: '5px 10px',
                            color: configColor.button_text_color,
                            borderRadius: '2px',
                            margin: '10px 0px',
                            width: 'fit-content'
                        }}
                        onClick={() => setOpenPopup(true)}
                    >
                        {callForPriceRule.button_label}
                    </div>
                    <div>
                        {isPopupOpen ? (
                            <div
                                className={classes.modal}
                                onClick={() => setOpenPopup(false)}
                            />
                        ) : null}
                        {isPopupOpen ? (
                            <div className={classes.popup_form}>
                                <GrClose
                                    className="close-icon"
                                    onClick={() => setOpenPopup(false)}
                                />
                                {form}
                            </div>
                        ) : null}
                    </div>
                </>
            );
        } else if (
            callForPriceRule &&
            callForPriceRule.action &&
            callForPriceRule.action === 'redirect_url'
        ) {
            const redirect = () => {
                let url_redirect = callForPriceRule.url_redirect
                if (url_redirect.includes('http'))
                    window.location.href = url_redirect;
                else
                    history.push(url_redirect)
            }
            return (
                <div
                    style={{
                        backgroundColor: configColor.button_background,
                        padding: '5px 10px',
                        color: configColor.button_text_color,
                        borderRadius: '2px',
                        margin: '10px 0px',
                        width: 'fit-content'
                    }}
                    onClick={() => redirect()}
                >
                   {callForPriceRule.button_label}
                </div>
            );
        } else return <>{wrapperPrice}</>;
    };
    

    return <div>
        {loading ? <Loader /> : null}
        <AlertMessages
                message={successMsg}
                setAlertMsg={setAlertMsg}
                alertMsg={alertMsg}
                status="success"
                topInsets={topInsets}
            />
        {renderPriceWithCallForPrice(data)}
        </div>;
};

export default CallForPrice;
