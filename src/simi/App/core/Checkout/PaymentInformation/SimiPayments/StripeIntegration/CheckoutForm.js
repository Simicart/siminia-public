import React, { useState, useMemo } from 'react';
import { useStripe, useElements, CardElement } from '@stripe/react-stripe-js';
import Identify from 'src/simi/Helper/Identify';
import { showToastMessage } from 'src/simi/Helper/Message'
import { GET_SAVED_CARDS } from './stripeIntegration.gql'
import { useUserContext } from '@magento/peregrine/lib/context/user';
import { simiUseQuery as useQuery } from 'src/simi/Network/Query';
import Checkbox from 'src/simi/BaseComponents/CheckboxInformed';
import Add from "src/simi/BaseComponents/Icon/Add";
import { useFieldState } from 'informed';


import CardSection from './CardSection';

const CheckoutForm = props => {
    const { classes } = props
    const stripe = useStripe();
    const elements = useElements();
    const [{ isSignedIn }] = useUserContext();
    const [selectedCard, setSelectedCard] = useState(0)
    let savedCards = []
    const { data } = useQuery(GET_SAVED_CARDS, {
        fetchPolicy: "no-cache",
        skip: !isSignedIn
    });
    if (data && data.simistripesavedcards) {
        savedCards = data.simistripesavedcards
    }
    const { value: saveNewCard } = useFieldState('stripe_save_new_card');

    const handleSubmit = async (event) => {
        // Block native form submission.
        //event.preventDefault();

        if (!stripe || !elements) {
            // Stripe.js has not loaded yet. Make sure to disable
            // form submission until Stripe.js has loaded.
            return;
        }

        // Get a reference to a mounted CardElement. Elements knows how
        // to find your CardElement because there can only ever be one of
        // each type of element.
        const cardElement = elements.getElement(CardElement);

        // Use your card Element with other Stripe.js APIs
        const { error, paymentMethod } = await stripe.createPaymentMethod({
            type: 'card',
            card: cardElement,
        });

        if (error) {
            console.log('[error]', error);
        } else {
            console.log('[PaymentMethod]', paymentMethod);
            if (paymentMethod && paymentMethod.card && paymentMethod.id) {
                const stripeData = { ...paymentMethod }
                stripeData.saveNewCard = saveNewCard ? true : false
                Identify.storeDataToStoreage(Identify.SESSION_STOREAGE, 'simi_stripe_js_integration_customer_data', stripeData)
                showToastMessage(Identify.__('Data saved!'))
            } else {
                showToastMessage(Identify.__('Sorry, we cannot validate your card'))
            }
        }
    };

    const cardOptions = useMemo(() => {
        const options = []
        savedCards.map(savedCard => {
            const { brand, exp_month, exp_year, last4 } = savedCard
            options.push(
                <div
                    key={savedCard.id}
                    role="presentation"
                    className={`${classes.stripe_saved_card_option} ${selectedCard === savedCard.id ? classes.stripe_cardselected : ''}`}
                    onClick={() => {
                        setSelectedCard(savedCard.id)
                        Identify.storeDataToStoreage(Identify.SESSION_STOREAGE, 'simi_stripe_js_integration_customer_data', {
                            isSavedCard: true,
                            id: savedCard.id,
                            card: {
                                brand,
                                last4
                            }
                        });
                    }}>
                    <img src={require(`../Images/${brand}.svg`)} alt={brand} />
                    <span className={classes.stripe_card_brand}>{Identify.__(brand)}</span>
                    <span className={classes.stripe_card_last4}>{last4}</span>
                    <div className={classes.stripe_card_exp}>{Identify.__('Ext.')} {exp_month}/{exp_year}</div>
                </div >
            )
        })
        options.push(
            <div
                key={0}
                role="presentation"
                className={`${classes.stripe_saved_card_option} ${selectedCard === 0 ? classes.stripe_cardselected : ''}`}
                onClick={() => setSelectedCard(0)}>
                <span className={classes.stripe_new_card_label}>{Identify.__('Use a new card')}</span>
                <Add className={classes.stripe_new_card_plus} />
            </div>
        )
        return (
            <div className={classes.stripe_saved_card_options}>
                {options}
            </div>
        )
    }, [savedCards, classes, selectedCard])

    return (
        <div className={classes.stripe_checkout_form}>
            {(savedCards && savedCards.length) ? cardOptions : ''}
            <div className={classes.stripe_card_section} style={{ display: selectedCard === 0 ? 'block' : 'none' }}>
                <CardSection />
                {
                    isSignedIn ?
                        <Checkbox
                            label={Identify.__(' Save card for future purchases')}
                            field="stripe_save_new_card"
                        /> : ''
                }
                <button disabled={!stripe} className={classes.stripe_use_card_btn} onClick={() => handleSubmit()}>{Identify.__('Use Card')}</button>
            </div>
        </div>
    );
}
export default CheckoutForm