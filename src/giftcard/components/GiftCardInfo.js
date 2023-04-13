import React, { useState } from 'react';
import { useMutation } from '@apollo/client';
import TinySlider from 'tiny-slider-react';
import 'tiny-slider/dist/tiny-slider.css';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { Heart, ChevronLeft, ChevronRight } from 'react-feather';
import ADD_GIFT_CARD_TO_CART from '../talons/useAddGiftCardToCart';
import ADD_GIFT_CARD_TO_WISHLIST from '../talons/useAddGiftCardToWishlist';
import GiftCardPreview from './GiftCardPreview';
import StatusPopUp from './StatusPopUp';
import '../styles/styles.scss';
import { FormattedMessage } from 'react-intl'

import {
    handlePriceInput,
    handleSenderName,
    handleRecipientName,
    handleSenderEmail,
    handleRecipientEmail,
    handleMessage
} from '../functions/gift-card-info/HandleUserInput';
import {
    imgStyles,
    selectedImgStyles,
    settings,
} from '../functions/gift-card-info/CarouselConfig';

const GiftCardInfo = ({ giftCardData, timezoneData, storeConfigData }) => {
    const [priceTitle, setPriceTitle] = useState('$0.00'); //price title show when user type or click option
    const [priceError, setPriceError] = useState(false); //control price error state when submit
    const [showDynamic, setShowDynamic] = useState(false); //control show dynamic price when user click that option
    const [dynamicError, setDynamicError] = useState(false); //control dynamic price error when user type out of range
    const [dynamicText, setDynamicText] = useState(''); //control error message will be show (smaller or greater)
    const [dynamicPrice, setDynamicPrice] = useState(''); //get dynamic price when user type

    const [template, setTemplate] = useState(''); //template option click by user
    const [templatesError, setTemplatesError] = useState(false); //control template error state when submit
    const [showTemplates, setShowTemplates] = useState(false); //control template will be shown when user click
    const [imageId, setImageId] = useState(); //image id when user choose template
    const [templateText, setTemplateText] = useState('');

    //storage user input
    const [senderName, setSenderName] = useState('');
    const [recipientName, setRecipientName] = useState('');
    const [senderEmail, setSenderEmail] = useState('');
    const [recipientEmail, setRecipientEmail] = useState('');

    //control error when user type lack of fields
    const [seNameError, setSeNameError] = useState(false);
    const [reNameError, setReNameError] = useState(false);
    const [seEmailError, setSeEmailError] = useState(false);
    const [seEmailText, setSeEmailText] = useState('');
    const [reEmailError, setReEmailError] = useState(false);
    const [reEmailText, setReEmailText] = useState('');
    const [quantityError, setQuantityError] = useState(false);
    const [quantityText, setQuantityText] = useState('');

    //storage message, date option, quantity
    const [message, setMessage] = useState('');
    const [startDate, setStartDate] = useState(null);
    const [quantity, setQuantity] = useState(1);

    //control show preview
    const [showPreview, setShowPreview] = useState(false);

    //control status when user add gift card to cart
    const [showCartStatus, setShowCartStatus] = useState(false);
    const [cartStatus, setCartStatus] = useState('');
    const [cartButton, setCartButton] = useState('Add to Cart');

    //control status when user add gift card to wish list
    const [showWishlistStatus, setShowWishlistStatus] = useState(false);
    const [wishlistStatus, setWishlistStatus] = useState('');
    const [heartFill, setHeartFill] = useState('white');

    const [templateId, setTemplateId] = useState();
    
    const min_value =
        giftCardData.products.items[0]?.giftcard_options.dynamic_price
            .min_value;
    const max_value =
        giftCardData.products.items[0]?.giftcard_options.dynamic_price
            .max_value;
    const percentage_price_value =
        giftCardData.products.items[0]?.giftcard_options.dynamic_price
            .percentage_price_value;
    const priceInput = `(${min_value}-${max_value})`;
    const ListTemplate =
        giftCardData?.products?.items[0]?.giftcard_options?.template || [];
    const [codeColor, setCodeColor] = useState()
    const [messageColor, setMessageColor] = useState()

    const chooseAmount = 'Choose an amount...'
    const otherAmount = 'Other Amount...'
    const chooseTemplate = 'Choose a Template'
    const chooseTimezone = 'Choose a Timezone'

    const [listImage,setListImage] = useState() 
    // const imgs =
    //     giftCardData?.products?.items[0]?.giftcard_options?.template[
    //        0
    //     ]?.images;
    //auto scroll to review component
    const handleAutoScroll = () => {
        const element = document.querySelector('.gift-card-review-wrapper');
        element.scrollIntoView({
            behavior: 'smooth'
        });
    };

    //price submit
    const handlePriceSubmit = () => {
        const element = document.getElementById('val');

        if (element.value !== 'default' && element.value !== 'other') {
            setPriceTitle(
                `$${
                    giftCardData.products.items[0].giftcard_options.amount[
                        element.selectedIndex - 1
                    ].price
                }.00`
            );
            if (showDynamic) setShowDynamic(false);
        }

        if (element.value === 'other') {
            if (!showDynamic) setShowDynamic(true);
            if (priceTitle !== '$0.00') setPriceTitle('$0.00');
        }

        if (element.value === 'default') {
            setPriceTitle('$0.00');
            if (showDynamic) setShowDynamic(false);
        }
    };

    //template submit
    const handleTemplateOption = e => {
        const imageArray = ListTemplate.find(item=>item.template_id === Number(e.target.value))
       
        if (document.getElementById('gc').value !== 'default') {
            setTemplateId(Number(e.target.value));
            setListImage(imageArray?.images || [])
            setShowTemplates(true);
            setCodeColor(imageArray.code_color)
            setMessageColor(imageArray.message_color)
            //setTemplate(imgs[0].url)
        } else setShowTemplates(false);
    };

    //validate email function
    const validateEmail = email => {
        const result = email.match(
            /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        );
        if (result) {
            return true;
        } else return false;
    };

    //handle all wrong input case, auto scroll to false place, change error state
    const checkInput = () => {
        const element1 = document.getElementById('val');
        const element2 = document.getElementById('gc');
        const element3 = document.getElementById('se-name');
        const element4 = document.getElementById('re-name');
        const element5 = document.getElementById('se-email');
        const element6 = document.getElementById('re-email');
        const element7 = document.getElementById('input-price');
        const element8 = document.getElementById('quantity');

        if (element1.value === 'default') {
            element1.style.borderColor = 'red';
            setPriceError(true);
        } else {
            element1.style.borderColor = 'gray';
            setPriceError(false);
        }

        if (element1.value === 'other') {
            const tmp = Number(element7.value);
            if (!tmp || tmp < 0) {
                element7.style.borderColor = 'red';
                setDynamicText('Please enter a positive number.');
                setDynamicError(true);
            } else if (tmp > 0 && tmp < min_value) {
                element7.style.borderColor = 'red';
                setDynamicText(
                    `Please enter a value greater than or equal to ${min_value}`
                );
                setDynamicError(true);
            } else if (tmp > 0 && tmp > max_value) {
                element7.style.borderColor = 'red';
                setDynamicText(
                    `Please enter a value smaller than or equal to ${max_value}`
                );
                setDynamicError(true);
            } else {
                element7.style.borderColor = 'rgb(223, 225, 226)';
                element7.style.borderWidth = '1px';
                setDynamicError(false);
            }
        }

        if (element2.value === 'default') {
            element2.style.borderColor = 'red';
            setTemplatesError(true);
            setTemplateText('This is a required field.');
        } else if (element2.value !== 'default' && !imageId) {
            element2.style.borderColor = 'red';
            setTemplatesError(true);
            setTemplateText('Please select a gift card template');
        } else {
            element2.style.borderColor = 'rgb(223, 225, 226)';
            element2.style.borderWidth = '1px';
            setTemplatesError(false);
        }

        if (senderName === '') {
            element3.style.borderColor = 'red';
            setSeNameError(true);
        } else {
            element3.style.borderColor = 'rgb(223, 225, 226)';
            element3.style.borderWidth = '1px';
            setSeNameError(false);
        }

        if (recipientName === '') {
            element4.style.borderColor = 'red';
            setReNameError(true);
        } else {
            element4.style.borderColor = 'rgb(223, 225, 226)';
            element4.style.borderWidth = '1px';
            setReNameError(false);
        }

        if (senderEmail === '') {
            element5.style.borderColor = 'red';
            setSeEmailError(true);
            setSeEmailText('This is a required field.');
        } else if (!validateEmail(senderEmail)) {
            element5.style.borderColor = 'red';
            setSeEmailError(true);
            setSeEmailText(
                'Please enter a valid email form. For example: bssgroup@domain.com'
            );
        } else {
            element5.style.borderColor = 'rgb(223, 225, 226)';
            element5.style.borderWidth = '1px';
            setSeEmailError(false);
        }

        if (recipientEmail === '') {
            element6.style.borderColor = 'red';
            setReEmailError(true);
            setReEmailText('This is a required field.');
        } else if (!validateEmail(recipientEmail)) {
            element6.style.borderColor = 'red';
            setReEmailError(true);
            setReEmailText(
                'Please enter a valid email form. For example: bssgroup@domain.com'
            );
        } else {
            element6.style.borderColor = 'rgb(223, 225, 226)';
            element6.style.borderWidth = '1px';
            setReEmailError(false);
        }

        if (!Number(quantity)) {
            element8.style.borderColor = 'red';
            setQuantityError(true);
            setQuantityText('Please enter a valid number in this field.');
        } else if (
            Number(quantity) < 1 ||
            !Number.isInteger(Number(quantity))
        ) {
            element8.style.borderColor = 'red';
            setQuantityError(true);
            setQuantityText('Please enter a positive integer in this field.');
        } else {
            element8.style.borderColor = 'rgb(223, 225, 226)';
            element8.style.borderWidth = '1px';
            setQuantityError(false);
        }

        element1.style.boxShadow = 'none';
        element2.style.boxShadow = 'none';
        element3.style.boxShadow = 'none';
        element4.style.boxShadow = 'none';
        element5.style.boxShadow = 'none';
        element6.style.boxShadow = 'none';
        if (element7) element7.style.boxShadow = 'none';
        element8.style.boxShadow = 'none';

        if (element1.value === 'default') {
            const topHeight = element1.offsetTop - 450;
            window.scrollTo({
                top: topHeight,
                behavior: 'smooth'
            });
            element1.style.boxShadow = '0 0 10px #206dac';
        } else if (
            element1.value === 'other' &&
            (!Number(element7.value) ||
                Number(element7.value) < 0 ||
                (Number(element7.value) > 0 &&
                    Number(element7.value) < min_value) ||
                (Number(element7.value) > 0 &&
                    Number(element7.value) > max_value))
        ) {
            const topHeight = element1.offsetTop - 450;
            window.scrollTo({
                top: topHeight,
                behavior: 'smooth'
            });
            element7.style.boxShadow = '0 0 10px #206dac';
            element7.focus({ preventScroll: true });
        } else if (element2.value === 'default' || !imageId) {
            const topHeight = element2.offsetTop - 450;
            window.scrollTo({
                top: topHeight,
                behavior: 'smooth'
            });
            element2.style.boxShadow = '0 0 10px #206dac';
        } else if (senderName === '') {
            const topHeight = element3.offsetTop - 450;
            window.scrollTo({
                top: topHeight,
                behavior: 'smooth'
            });
            element3.style.boxShadow = '0 0 10px #206dac';
            element3.focus({ preventScroll: true });
        } else if (recipientName === '') {
            const topHeight = element4.offsetTop - 450;
            window.scrollTo({
                top: topHeight,
                behavior: 'smooth'
            });
            element4.style.boxShadow = '0 0 10px #206dac';
            element4.focus({ preventScroll: true });
        } else if (
            senderEmail === '' ||
            recipientEmail === '' ||
            !validateEmail(senderEmail) ||
            !validateEmail(recipientEmail)
        ) {
            const topHeight = element5.offsetTop - 450;
            window.scrollTo({
                top: topHeight,
                behavior: 'smooth'
            });
            if (senderEmail === '' || !validateEmail(senderEmail)) {
                element5.style.boxShadow = '0 0 10px #206dac';
                element5.focus({ preventScroll: true });
            }
            if (
                senderEmail !== '' &&
                validateEmail(senderEmail) &&
                (recipientEmail === '' || !validateEmail(recipientEmail))
            ) {
                element6.style.boxShadow = '0 0 10px #206dac';
                element6.focus({ preventScroll: true });
            }
        } else if (
            !Number(quantity) ||
            Number(quantity) < 1 ||
            !Number.isInteger(Number(quantity))
        ) {
            const topHeight = element8.offsetTop - 450;
            window.scrollTo({
                top: topHeight,
                behavior: 'smooth'
            });
            element8.style.boxShadow = '0 0 10px #206dac';
            element8.focus({ preventScroll: true });
        } else return true;
        return false;
    };

    //show preview after input true for all field
    const handlePreview = () => {
        const tmp = checkInput();
        if (tmp) setShowPreview(true);
    };

    //change template by user input
    const handleChoose = element => {
        setTemplate(element.url);
        setImageId(element.id);
    };

    //change quantity when user input
    const handleQuantity = e => {
        setQuantity(e.target.value);
    };

    //define addGiftCardToCart function
    const [
        addGiftCardToCart
    ] = useMutation(ADD_GIFT_CARD_TO_CART, {
        onCompleted: () => {
            setCartButton('Add to Cart');
            setCartStatus(
                `${giftCardData.products.items[0].name.toUpperCase()} was added to your shopping cart`
            );
            setShowCartStatus(true);
        },
        onError: () => {
            setCartButton('Add to Cart');
            setCartStatus('Some errors occurred. Please try again later');
            setShowCartStatus(true);
        }
    });

    //handle add to cart action
    const handleAddToCart = () => {
        if (!storeConfigData.bssGiftCardStoreConfig.active) {
            setCartStatus('Some errors occurred. Please try again later');
            setShowCartStatus(true);
        } else {
            const tmp = checkInput();
            const cart_id = JSON.parse(
                localStorage.getItem('M2_VENIA_BROWSER_PERSISTENCE__cartId')
            ).value;
            const index = document.getElementById('val').selectedIndex;

            if (tmp) {
                setCartButton('Adding...');
                addGiftCardToCart({
                    variables: {
                        cart_id: cart_id.slice(1, cart_id.length - 1),
                        sku: giftCardData.products.items[0].sku,
                        quantity: quantity,
                        bss_giftcard_amount: showDynamic
                            ? 'custom'
                            : giftCardData.products.items[0].giftcard_options
                                  .amount[index - 1].id,
                        ...(showDynamic && {
                            bss_giftcard_amount_dynamic: dynamicPrice
                        }),
                        bss_giftcard_delivery_date: document.getElementById(
                            'calendar'
                        ).value,
                        bss_giftcard_recipient_email: recipientEmail,
                        bss_giftcard_recipient_name: recipientName,
                        bss_giftcard_sender_email: senderEmail,
                        bss_giftcard_sender_name: senderName,
                        bss_giftcard_selected_image: imageId,
                        bss_giftcard_template:templateId,
                            // giftCardData.products.items[0].giftcard_options
                            //     .template[0].template_id,
                        bss_giftcard_message_email: message,
                        bss_giftcard_timezone: document.getElementById('tz')
                            .value
                    }
                });
            }
        }
    };

    //define addGiftCardToWishlist function
    const [
        addGiftCardToWishlist
    ] = useMutation(ADD_GIFT_CARD_TO_WISHLIST, {
        onCompleted: () => {
            setWishlistStatus(
                `${giftCardData.products.items[0].name.toUpperCase()} was added to your wishlist`
            );
            setShowWishlistStatus(true);
            setHeartFill('rgba(236, 91, 98, 1)');
        },
        onError: () => {
            setWishlistStatus('Some errors occurred. Please try again later');
            setShowWishlistStatus(true);
        }
    });

    //handle add to wish list action
    const handleAddToWishlist = () => {
        if (
            localStorage.getItem('M2_VENIA_BROWSER_PERSISTENCE__signin_token')
        ) {
            const tmp = checkInput();
            const index = document.getElementById('val').selectedIndex;

            if (tmp) {
                const wishlistId = 0;
                const wishlistItems = [
                    {
                        sku: giftCardData.products.items[0].sku,
                        quantity: quantity,
                        giftcard_options: {
                            bss_giftcard_amount: showDynamic
                                ? 'custom'
                                : giftCardData.products.items[0]
                                      .giftcard_options.amount[index - 1].id,
                            ...(showDynamic && {
                                bss_giftcard_amount_dynamic: dynamicPrice
                            }),
                            bss_giftcard_delivery_date: document.getElementById(
                                'calendar'
                            ).value,
                            bss_giftcard_recipient_email: recipientEmail,
                            bss_giftcard_recipient_name: recipientName,
                            bss_giftcard_sender_email: senderEmail,
                            bss_giftcard_sender_name: senderName,
                            bss_giftcard_selected_image: imageId,
                            bss_giftcard_template:templateId,
                                // giftCardData.products.items[0].giftcard_options
                                //     .template[0].template_id,
                            bss_giftcard_message_email: message,
                            bss_giftcard_timezone: document.getElementById('tz')
                                .value
                        },
                    }
                ];
                addGiftCardToWishlist({
                    variables: {
                        wishlistId: wishlistId,
                        wishlistItems: wishlistItems
                    }
                });
            }
        } else {
            setWishlistStatus(
                'Please sign-in to your Account to save items for later.'
            );
            setShowWishlistStatus(true);
        }
    };

    return (
        <>
            <div className="gift-card-info-wrapper">
                <div className="gift-card-image-wrapper">
                    <img
                        src={
                            template
                                ? template
                                : giftCardData.products.items[0]?.small_image
                                      .url
                        }
                        alt=""
                    />
                    <p>{giftCardData.products.items[0]?.sku}</p>
                </div>
                <div className="gift-card-details-wrapper">
                    <div className="gift-card-overview-wrapper">
                        <div style={{ textAlign: 'left', marginBottom: 30 }}>
                            <h1
                                style={{
                                    fontSize: 24,
                                    margin: 0,
                                    wordWrap: 'break-word'
                                }}
                            >
                                {giftCardData.products.items[0]?.name}
                            </h1>
                            <button
                                onClick={handleAutoScroll}
                                style={{ textAlign: 'left' }}
                            >
                                <p className="gift-card-nav-review">
                                    <FormattedMessage id='Be the first to review this product' defaultMessage='Be the first to review this product'></FormattedMessage>                       
                                </p>
                            </button>
                            <h1 style={{ fontSize: 20, fontWeight: 'bold' }}>
                                {priceTitle}
                            </h1>
                        </div>
                        <div style={{ paddingTop: 60, textAlign: 'right' }}>
                            <h3 style={{ fontWeight: 'bold', fontSize: 20 }}>
                                {storeConfigData.bssGiftCardStoreConfig.active
                                    ? giftCardData.products.items[0]?.stock_status
                                          .split('_')
                                          .join(' ')
                                    : 'OUT OF STOCK'}
                            </h3>
                            <p>
                                <FormattedMessage id={`SKU#: ${giftCardData.products.items[0]?.sku}`}
                                defaultMessage={`SKU#: ${giftCardData.products.items[0]?.sku}`}></FormattedMessage>
                                </p>
                            <p>
                                <FormattedMessage id={`Expires after: ${giftCardData.products.items[0]?.giftcard_options.expires_at} day(s)`}
                                defaultMessage={`Expires after: ${giftCardData.products.items[0]?.giftcard_options.expires_at} day(s)`}></FormattedMessage>
                                </p>
                        </div>
                    </div>

                    {(storeConfigData.bssGiftCardStoreConfig.active && ListTemplate.length > 0) ? (<div style={{ textAlign: 'left' }}>
                        <div style={{ marginTop: 20 }}>
                            <p style={{ fontWeight: 'bold', marginBottom: 5 }}>
                                <FormattedMessage id='Card value' defaultMessage='Card value'></FormattedMessage>
                                {' '}
                                <span style={{ color: 'red' }}>
                                    <FormattedMessage id='*' defaultMessage='*'></FormattedMessage>
                                </span>
                            </p>
                            <div
                                style={{
                                    display: 'flex',
                                    flexDirection: 'row'
                                }}
                            >
                                <div style={{ width: '48%', marginRight: 20 }}>
                                    <select
                                        name="value"
                                        id="val"
                                        style={{
                                            width: '100%',
                                            height: 36,
                                            paddingLeft: 10
                                        }}
                                        onChange={handlePriceSubmit}
                                    >
                                        <option value="default">
                                            {chooseAmount}
                                        </option>
                                        {giftCardData.products.items[0]
                                            ?.giftcard_options.amount &&
                                            giftCardData.products.items[0].giftcard_options.amount.map(
                                                (element, index) => (
                                                    <option
                                                        value={`val${index}`}
                                                    >
                                                        {`$${
                                                        element.value
                                                    }.00`}</option>
                                                )
                                            )}
                                        {giftCardData.products.items[0]
                                            ?.giftcard_options.dynamic_price
                                            .enable === 1 && (
                                            <option value="other">
                                                {otherAmount}
                                            </option>
                                        )}
                                    </select>
                                    {priceError && (
                                        <p
                                            style={{
                                                color: 'red',
                                                fontSize: 12,
                                                marginTop: 5
                                            }}
                                        >
                                            <FormattedMessage id='This is a required field.' defaultMessage='This is a required field.'></FormattedMessage>
                                        </p>
                                    )}
                                </div>
                                <div style={{ width: '48%', marginLeft: 20 }}>
                                    {showDynamic && (
                                        <div>
                                            <input
                                                style={{
                                                    width: '100%',
                                                    height: 36,
                                                    paddingLeft: 10
                                                }}
                                                placeholder={priceInput}
                                                onChange={e =>
                                                    handlePriceInput(
                                                        e,
                                                        setDynamicPrice,
                                                        setPriceTitle,
                                                        min_value,
                                                        max_value,
                                                        percentage_price_value
                                                    )
                                                }
                                                id="input-price"
                                                onFocus={() => {
                                                    document.getElementById(
                                                        'input-price'
                                                    ).style.boxShadow =
                                                        '0 0 10px #206dac';
                                                }}
                                                onBlur={() => {
                                                    document.getElementById(
                                                        'input-price'
                                                    ).style.boxShadow = 'none';
                                                }}
                                            />
                                            {dynamicError && (
                                                <p
                                                    style={{
                                                        color: 'red',
                                                        fontSize: 12,
                                                        marginTop: 5
                                                    }}
                                                >
                                                    {dynamicText}
                                                </p>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                        <div style={{ marginTop: 20 }}>
                            <p style={{ fontWeight: 'bold', marginBottom: 5 }}>
                                <FormattedMessage id='Template ' defaultMessage='Template '></FormattedMessage>
                                <span style={{ color: 'red' }}><FormattedMessage id='*' defaultMessage='*'></FormattedMessage></span>
                            </p>
                            <select
                                name="gift-card"
                                id="gc"
                                style={{
                                    width: '100%',
                                    height: 36,
                                    paddingLeft: 10
                                }}
                                onChange={e => handleTemplateOption(e)}
                            >
                                <option value="default">
                                    {chooseTemplate}
                                </option>
                                {/* <option
                                    value={giftCardData.products.items[0]?.name}
                                >
                                    {giftCardData.products.items[0]?.name}
                                </option> */}
                                {ListTemplate.map(template => {
                                    return (
                                        <option
                                            key={template.template_id}
                                            value={template.template_id}
                                        >
                                            {template.name}
                                        </option>
                                    );
                                })}
                            </select>
                            {templatesError && (
                                <p
                                    style={{
                                        color: 'red',
                                        fontSize: 12,
                                        marginTop: 5
                                    }}
                                >
                                    {templateText}
                                </p>
                            )}
                            {showTemplates && (
                                <>
                                    <div style={{ textAlign: 'center' }}>
                                        <button className="gift-card-prev-template">
                                            <ChevronLeft />
                                        </button>
                                        <button className="gift-card-next-template">
                                            <ChevronRight />
                                        </button>
                                    </div>
                                    <TinySlider settings={settings}>
                                        {listImage.map((el, index) => (
                                            <div key={index}>
                                                <button style={{width: '100%'}} onClick={() => handleChoose(el)}>
                                                <img
                                                    className={`tns-lazy-img`}
                                                    src={el.url}
                                                    data-src={el.url}
                                                    alt=""
                                                    style={
                                                        template &&
                                                        el.url === template
                                                            ? //(!template && index === 0)
                                                              selectedImgStyles
                                                            : imgStyles
                                                    }/>
                                                </button>
                                            </div>
                                        ))}
                                    </TinySlider>
                                </>
                            )}
                        </div>
                        <div style={{ marginTop: 20 }}>
                            <p style={{ fontWeight: 'bold', marginBottom: 5 }}>
                                <FormattedMessage id='Sender name' defaultMessage='Sender name'></FormattedMessage>
                                {' '}
                                <span style={{ color: 'red' }}>
                                    <FormattedMessage id='*' defaultMessage='*'></FormattedMessage>
                                </span>
                            </p>
                            <input
                                id="se-name"
                                style={{
                                    width: '100%',
                                    height: 36,
                                    paddingLeft: 10
                                }}
                                onChange={e =>
                                    handleSenderName(e, setSenderName)
                                }
                                onFocus={() => {
                                    document.getElementById(
                                        'se-name'
                                    ).style.boxShadow = '0 0 10px #206dac';
                                }}
                                onBlur={() => {
                                    document.getElementById(
                                        'se-name'
                                    ).style.boxShadow = 'none';
                                }}
                            />
                            {seNameError && (
                                <p
                                    style={{
                                        color: 'red',
                                        fontSize: 12,
                                        marginTop: 5
                                    }}
                                >
                                    <FormattedMessage id='This is a required field'
                                    defaultMessage='This is a required field'></FormattedMessage>
                                </p>
                            )}
                        </div>
                        <div style={{ marginTop: 20 }}>
                            <p style={{ fontWeight: 'bold', marginBottom: 5 }}>
                                <FormattedMessage id='Recipient name' defaultMessage='Recipient name'></FormattedMessage>
                                {' '}
                                <span style={{ color: 'red' }}>
                                <FormattedMessage id='*' defaultMessage='*'></FormattedMessage>
                                </span>
                            </p>
                            <input
                                id="re-name"
                                style={{
                                    width: '100%',
                                    height: 36,
                                    paddingLeft: 10
                                }}
                                onChange={e =>
                                    handleRecipientName(e, setRecipientName)
                                }
                                onFocus={() => {
                                    document.getElementById(
                                        're-name'
                                    ).style.boxShadow = '0 0 10px #206dac';
                                }}
                                onBlur={() => {
                                    document.getElementById(
                                        're-name'
                                    ).style.boxShadow = 'none';
                                }}
                            />
                            {reNameError && (
                                <p
                                    style={{
                                        color: 'red',
                                        fontSize: 12,
                                        marginTop: 5
                                    }}
                                >
                                    <FormattedMessage id='This is a required field'
                                    defaultMessage='This is a required field'></FormattedMessage>
                                </p>
                            )}
                        </div>
                        <div className="gift-card-email-input">
                            <div className="gift-card-sender-email">
                                <p
                                    style={{
                                        fontWeight: 'bold',
                                        marginBottom: 5
                                    }}
                                >
                                    <FormattedMessage id='Sender email' defaultMessage='Sender email'></FormattedMessage>
                                    {' '}
                                    <span style={{ color: 'red' }}>
                                    <FormattedMessage id='*' defaultMessage='*'></FormattedMessage>
                                    </span>
                                </p>
                                <input
                                    id="se-email"
                                    style={{
                                        width: '100%',
                                        height: 36,
                                        paddingLeft: 10
                                    }}
                                    onChange={e =>
                                        handleSenderEmail(e, setSenderEmail)
                                    }
                                    onFocus={() => {
                                        document.getElementById(
                                            'se-email'
                                        ).style.boxShadow = '0 0 10px #206dac';
                                    }}
                                    onBlur={() => {
                                        document.getElementById(
                                            'se-email'
                                        ).style.boxShadow = 'none';
                                    }}
                                />
                                {seEmailError && (
                                    <p
                                        style={{
                                            color: 'red',
                                            fontSize: 12,
                                            marginTop: 5
                                        }}
                                    >
                                        {seEmailText}
                                    </p>
                                )}
                            </div>
                            <div className="gift-card-recipient-email">
                                <p
                                    style={{
                                        fontWeight: 'bold',
                                        marginBottom: 5
                                    }}
                                >
                                    <FormattedMessage id='Recipient email' defaultMessage='Recipient email'></FormattedMessage>{' '}
                                    <span style={{ color: 'red' }}>
                                    <FormattedMessage id='*' defaultMessage='*'></FormattedMessage>
                                    </span>
                                </p>
                                <input
                                    id="re-email"
                                    style={{
                                        width: '100%',
                                        height: 36,
                                        paddingLeft: 10
                                    }}
                                    onChange={e =>
                                        handleRecipientEmail(
                                            e,
                                            setRecipientEmail
                                        )
                                    }
                                    onFocus={() => {
                                        document.getElementById(
                                            're-email'
                                        ).style.boxShadow = '0 0 10px #206dac';
                                    }}
                                    onBlur={() => {
                                        document.getElementById(
                                            're-email'
                                        ).style.boxShadow = 'none';
                                    }}
                                />
                                {reEmailError && (
                                    <p
                                        style={{
                                            color: 'red',
                                            fontSize: 12,
                                            marginTop: 5
                                        }}
                                    >
                                        {reEmailText}
                                    </p>
                                )}
                            </div>
                        </div>
                        <div style={{ marginTop: 20 }}>
                            <p style={{ fontWeight: 'bold', marginBottom: 5 }}>
                            <FormattedMessage id='Message' defaultMessage='Message'></FormattedMessage>
                            </p>
                            <textarea
                                id="msg"
                                style={{
                                    width: '100%',
                                    height: 100,
                                    fontFamily: 'Roboto',
                                    fontSize: 16,
                                    resize: 'none',
                                    paddingLeft: 10,
                                    paddingTop: 10
                                }}
                                onChange={e => handleMessage(e, setMessage)}
                                onFocus={() => {
                                    document.getElementById(
                                        'msg'
                                    ).style.boxShadow = '0 0 10px #206dac';
                                }}
                                onBlur={() => {
                                    document.getElementById(
                                        'msg'
                                    ).style.boxShadow = 'none';
                                }}
                            />
                        </div>
                        <div style={{ marginTop: 20 }}>
                            <p style={{ fontWeight: 'bold', marginBottom: 5 }}>
                            <FormattedMessage id='Delivery Date' defaultMessage='Delivery Date'></FormattedMessage>
                            </p>
                            <DatePicker
                                id="calendar"
                                selected={startDate}
                                onChange={date => setStartDate(date)}
                                className="gift-card-date-input"
                                placeholderText="Select Delivery Date"
                                minDate={new Date()}
                                showPopperArrow={false}
                                onFocus={() => {
                                    document.getElementById(
                                        'calendar'
                                    ).style.boxShadow = '0 0 10px #206dac';
                                }}
                                onBlur={() => {
                                    document.getElementById(
                                        'calendar'
                                    ).style.boxShadow = 'none';
                                }}
                            />
                        </div>
                        <div style={{ marginTop: 20 }}>
                            <p style={{ fontWeight: 'bold', marginBottom: 5 }}>
                            <FormattedMessage id='Timezone' defaultMessage='Timezone'></FormattedMessage>
                            </p>
                            <select
                                name="time-zone"
                                id="tz"
                                style={{
                                    width: '50%',
                                    height: 36,
                                    paddingLeft: 10
                                }}
                                onFocus={() => {
                                    document.getElementById(
                                        'tz'
                                    ).style.boxShadow = '0 0 10px #206dac';
                                }}
                                onBlur={() => {
                                    document.getElementById(
                                        'tz'
                                    ).style.boxShadow = 'none';
                                }}
                            >
                                <option value="">{chooseTimezone}</option>
                                {timezoneData.bssGetListTimezone.map(
                                    element => (
                                        <option value={element.value}>
                                            {element.label}
                                        </option>
                                    )
                                )}
                            </select>
                        </div>
                        <button
                            className="gift-card-preview-button"
                            onClick={handlePreview}
                        >
                            <FormattedMessage id='Preview' defaultMessage='Preview'></FormattedMessage>
                        </button>
                        <GiftCardPreview
                            open={showPreview}
                            setShowPreview={setShowPreview}
                            template={template}
                            senderName={senderName}
                            recipientName={recipientName}
                            message={message}
                            codeColor={codeColor}
                            messageColor={messageColor}
                            value={priceTitle}
                        />
                        <p style={{ fontWeight: 'bold', marginBottom: 5 }}>
                        <FormattedMessage id='Quantity' defaultMessage='Quantity'></FormattedMessage>
                        </p>
                        <div style={{ display: 'flex', flexDirection: 'row' }}>
                            <div className="gift-card-input-quantity">
                                <input
                                    id="quantity"
                                    type="text"
                                    value={quantity}
                                    style={{
                                        width: '100%',
                                        height: 50,
                                        textAlign: 'center'
                                    }}
                                    onChange={handleQuantity}
                                    onFocus={() => {
                                        document.getElementById(
                                            'quantity'
                                        ).style.boxShadow = '0 0 10px #206dac';
                                    }}
                                    onBlur={() => {
                                        document.getElementById(
                                            'quantity'
                                        ).style.boxShadow = 'none';
                                    }}
                                />
                            </div>
                            <div
                                className={
                                    cartButton === 'Adding...'
                                        ? 'gift-card-add-cart-loading-button'
                                        : 'gift-card-add-cart-button'
                                }
                            >
                                <button
                                    style={{ width: '100%', height: '100%' }}
                                    onClick={handleAddToCart}
                                >
                                    {cartButton}
                                </button>
                            </div>
                        </div>
                        {quantityError && (
                            <p
                                style={{
                                    color: 'red',
                                    fontSize: 12,
                                    marginTop: 5
                                }}
                            >
                                {quantityText}
                            </p>
                        )}
                        <div className="gift-card-add-wishlist-button">
                            <div style={{ marginRight: 15, cursor: 'pointer' }}>
                                <Heart
                                    size={28}
                                    onClick={handleAddToWishlist}
                                    fill={heartFill}
                                />
                            </div>
                            <div>
                                <p style={{ marginTop: 5 }}>
                                <FormattedMessage id='Add to Favorites' defaultMessage='Add to Favorites'></FormattedMessage>
                                </p>
                            </div>
                        </div>
                    </div>) : <></>}
                </div>
                {showCartStatus && (
                    <StatusPopUp
                        status={cartStatus}
                        showStatus={showCartStatus}
                        setShowStatus={setShowCartStatus}
                    />
                )}
                {showWishlistStatus && (
                    <StatusPopUp
                        status={wishlistStatus}
                        showStatus={showWishlistStatus}
                        setShowStatus={setShowWishlistStatus}
                    />
                )}
            </div>
        </>
    );
};

export default GiftCardInfo;
