import React, { useState, useEffect } from 'react';
import * as Icon from 'react-feather';
import defaultClasses from './applyGiftCard.module.css';
import { useCartContext } from '@magento/peregrine/lib/context/cart';
import { checkGiftCardCode } from '../talons/checkGiftCardCode';
import { setGiftCardCodeToCart } from '../talons/setGiftCardCodeToCart';
import { setGiftCardCreditToCart } from '../talons/setGiftCardCreditToCart';
import { removeGiftCardCodeFromCart } from '../talons/removeGiftCardCodeFromCart';
import Loading from '../images/loading.jpg';
import { useResizeDetector } from 'react-resize-detector';
import { useGiftCardList } from '../talons/useGiftCardList';
import { useStyle } from '@magento/venia-ui/lib/classify';
import { useIntl } from 'react-intl';

const GiftCardDiscount = props => {
    const { giftCardConfig, refetchCartPage, setIsCartUpdating } = props;
    const { formatMessage } = useIntl();

    const classes = useStyle(defaultClasses, props.classes);

    const [isSavedListClosed, setIsSavedListClosed] = useState(false);
    const [isApplyCreditClosed, setIsApplyCreditClosed] = useState(false);
    const [gcCode, setGcCode] = useState('');
    const [isSetCodeMsgDisplayed, setIsSetCodeMsgDisplayed] = useState(false);
    const [isRemoveCodeMsgDisplayed, setIsRemoveCodeMsgDisplayed] = useState(
        false
    );
    const [isSetCreditMsgDisplayed, setIsSetCreditMsgDisplayed] = useState(
        false
    );
    const [isInformationDisplayed, setIsInformationDisplayed] = useState(false);
    const [creditValue, setCreditValue] = useState(0);

    const [{ cartId }] = useCartContext();
    const { checkCode, checkCodeLoading, checkCodeData } = checkGiftCardCode();

    const {
        setGiftCardCode,
        setCodeLoading,
        setCodeData,
        setCodeErrorMessage
    } = setGiftCardCodeToCart();

    const {
        setGiftCardCredit,
        setCreditLoading,
        setCreditData,
        setCreditErrorMessage
    } = setGiftCardCreditToCart();

    const {
        removeGiftCardCode,
        removeCodeLoading,
        removeCodeData,
        removeCodeErrorMessage
    } = removeGiftCardCodeFromCart();

    const {
        giftCardListData,
        giftCardListLoading,
        derivedErrorMessage
    } = useGiftCardList();

    let giftCardList = [];
    if (giftCardListData && giftCardListData.mpGiftCardDashboardConfig) {
        const list = giftCardListData.mpGiftCardDashboardConfig.giftCardLists;
        list.map(({ code, balance, status_label }) => {
            const giftcard = {
                code: code,
                balance: balance
            };
            if (status_label === 'Active') giftCardList.push(giftcard);
        });
    }

    useEffect(() => {
        setIsCartUpdating(true);
        setTimeout(() => {
            refetchCartPage();
            setIsCartUpdating(false);
        }, 1000);
    }, [setCreditLoading, setCodeLoading, removeCodeLoading]);

    const displayLoading =
        setCodeLoading ||
        setCreditLoading ||
        removeCodeLoading ||
        checkCodeLoading;

    const {
        width: containerWidth,
        height: containerHeight,
        ref
    } = useResizeDetector();

    const { creditUsed, giftCardUsed, listGiftCard, maxUsed } =
        giftCardConfig || {};

    const onCodeChange = e => {
        setGcCode(e.target.value);
    };
    const onCheckCodeClick = () => {
        setGcCode(gcCode.toUpperCase().trim());
        checkCode({ variables: { code: gcCode.toUpperCase().trim() } });
        setIsInformationDisplayed(true);
    };
    const onCreditChange = e => {
        setCreditValue(e.target.value);
    };
    const handleSetCode = code => {
        setGcCode(code.toUpperCase().trim());
        setGiftCardCode({
            variables: { cartId: cartId, code: code.toUpperCase().trim() }
        })
            .then(res => void 0)
            .catch(err => void 0);
        setIsSetCodeMsgDisplayed(true);
        setIsSetCreditMsgDisplayed(false);
        setTimeout(() => {
            setIsSetCodeMsgDisplayed(false);
        }, 8000);
    };
    const handleRemoveCode = code => {
        removeGiftCardCode({
            variables: { cartId: cartId, code: code.toUpperCase().trim() }
        })
            .then(res => void 0)
            .catch(err => void 0);
        setIsRemoveCodeMsgDisplayed(true);
        setIsSetCodeMsgDisplayed(false);
        setIsSetCreditMsgDisplayed(false);
        setTimeout(() => {
            setIsRemoveCodeMsgDisplayed(false);
        }, 8000);
    };
    const handleSetCredit = e => {
        let value = e.target.value;
        if (isNaN(value) || value.length == 0 || value < 0) {
            e.target.value = 0;
            setCreditValue(0);
            setGiftCardCredit({
                variables: { cartId: cartId, amount: e.target.value }
            });
        } else if (value > maxUsed) {
            e.target.value = maxUsed;
            setCreditValue(maxUsed);
            setGiftCardCredit({
                variables: { cartId: cartId, amount: e.target.value }
            });
        } else {
            setCreditValue(Number(value));
            setGiftCardCredit({
                variables: { cartId: cartId, amount: e.target.value }
            });
        }
        setIsSetCreditMsgDisplayed(true);
        setIsSetCodeMsgDisplayed(false);
        setTimeout(() => {
            setIsSetCreditMsgDisplayed(false);
        }, 8000);
    };

    const setCodeMessage = (
        <div className={classes['message-container']}>
            {isSetCodeMsgDisplayed && !setCodeErrorMessage && !setCodeLoading && (
                <div className={classes['message-success']}>
                    <Icon.Check className={classes['message-icon']} />
                    
                    {formatMessage({
                                    id: 'Your gift card was successfully applied.',
                                    defaultMessage: 'Your gift card was successfully applied.'
                                })}
                </div>
            )}
            {isSetCodeMsgDisplayed && setCodeErrorMessage && !setCodeLoading && (
                <div className={classes['message-error']}>
                    <Icon.X className={classes['message-icon']} />
                    {/* {setCodeErrorMessage} */}
                    {formatMessage({
                        id: 'The gift card code is not exits.',
                        defaultMessage:
                            `${setCodeErrorMessage}`
                    })}
                </div>
            )}
        </div>
    );
    const removeCodeMessage = (
        <div className={classes['message-container']}>
            {isRemoveCodeMsgDisplayed &&
                !removeCodeErrorMessage &&
                !removeCodeLoading && (
                    <div className={classes['message-success']}>
                        <Icon.Check className={classes['message-icon']} />
                    
                        {formatMessage({
                                    id: 'Your gift card was successfully applied.',
                                    defaultMessage: 'Your gift card was successfully applied.'
                                })}
                    </div>
                )}
            {isRemoveCodeMsgDisplayed &&
                removeCodeErrorMessage &&
                !removeCodeLoading && (
                    <div className={classes['message-error']}>
                        <Icon.X className={classes['message-icon']} />
                        {removeCodeErrorMessage}
                    </div>
                )}
        </div>
    );
    const setCreditMessage = (
        <div className={classes['message-container']}>
            {isSetCreditMsgDisplayed &&
                !setCreditErrorMessage &&
                !setCreditLoading && (
                    <div className={classes['message-success']}>
                        <Icon.Check className={classes['message-icon']} />
                        {formatMessage({
                                    id: 'Set gift card credit successfully.',
                                    defaultMessage: 'Set gift card credit successfully.'
                                })}
                        
                    </div>
                )}
            {isSetCreditMsgDisplayed &&
                setCreditErrorMessage &&
                !setCreditLoading && (
                    <div className={classes['message-error']}>
                        <Icon.X className={classes['message-icon']} />
                        {/* {setCreditErrorMessage} */}
                        {formatMessage({
                        id: 'The gift card code is not exits.',
                        defaultMessage:
                            `${setCreditErrorMessage}`
                    })}
                    </div>
                )}
        </div>
    );

    return (
        <div className={classes['block-gift-card-discount']} ref={ref}>
            <div
                className={classes.loading}
                style={{
                    display: displayLoading ? 'flex' : 'none',
                    height: containerHeight,
                    width: containerWidth
                }}
            >
                <img src={Loading} />
            </div>
            <div className={classes.content}>
                {setCodeMessage}
                {removeCodeMessage}
                {setCreditMessage}
                <div className={classes['giftcard-apply']}>
                    <div className={classes['apply-gift-card-field']}>
                        <input
                            type="text"
                            className={classes['input-code']}
                            placeholder={formatMessage({
                                id: 'Enter gift card code',
                                defaultMessage: 'Enter gift card code'
                            })}
                            value={gcCode}
                            onChange={onCodeChange}
                        />
                        <button
                            className={classes['action']}
                            onClick={() => handleSetCode(gcCode)}
                        >
                            <span>
                                {formatMessage({
                                    id: 'Apply',
                                    defaultMessage: 'Apply'
                                })}
                            </span>
                        </button>
                    </div>
                    <div className={classes['gift-card-used']}>
                        {giftCardUsed.map(data => {
                            return (
                                <div className={classes['gift-card-used-item']}>
                                    <a
                                        href={void 0}
                                        onClick={() =>
                                            handleRemoveCode(data.code)
                                        }
                                    >
                                        <Icon.X
                                            className={classes['close-icon']}
                                        />
                                    </a>
                                    <span
                                        className={
                                            classes['gift-card-used-item-code']
                                        }
                                    >{`${data.code} (-$${data.amount})`}</span>
                                </div>
                            );
                        })}
                    </div>
                    <div className={classes['gift-card-saved-list']}>
                        <div
                            className={classes['saved-list-title']}
                            onClick={() =>
                                setIsSavedListClosed(!isSavedListClosed)
                            }
                        >
                            
                            {formatMessage({
                                    id: 'Choose from saved list',
                                    defaultMessage: 'Choose from saved list'
                                })}
                            {!isSavedListClosed && (
                                <Icon.ChevronDown className={classes.icon} />
                            )}
                            {isSavedListClosed && (
                                <Icon.ChevronUp className={classes.icon} />
                            )}
                        </div>
                        <div
                            className={classes['saved-list-content-container']}
                            style={{
                                display: isSavedListClosed
                                    ? 'inline-flex'
                                    : 'none'
                            }}
                        >
                            <div className={classes['saved-list-content']}>
                                <select
                                    id={classes['gift-card-saved-list']}
                                    onChange={e => {
                                        if (e.target.value != 0)
                                            handleSetCode(e.target.value);
                                    }}
                                >
                                    <option value="0">
                                       
                                        {formatMessage({
                                    id: 'Please select',
                                    defaultMessage: ' -- Please Select --'
                                })}
                                    </option>
                                    {giftCardList.map(({ code, balance }) => {
                                        return (
                                            <option
                                                value={code}
                                            >{`${code} ($${balance})`}</option>
                                        );
                                    })}
                                </select>
                            </div>
                            <button className={classes['action']}>
                                <span> {formatMessage({
                                    id: 'Apply',
                                    defaultMessage: 'Apply'
                                })}</span>
                            </button>
                        </div>
                    </div>
                    {checkCodeData && checkCodeData.mpGiftCardCheckCode && (
                        <div
                            className={classes['gift-card-check-code']}
                            style={{
                                display: isInformationDisplayed
                                    ? 'block'
                                    : 'none'
                            }}
                        >
                            <div className={classes['fieldset']}>
                                <div className={classes['field']}>
                                    <label className={classes['label']}>
                                        <span>Status</span>
                                    </label>
                                    <div className={classes['control']}>
                                        <span>
                                            {
                                                checkCodeData
                                                    .mpGiftCardCheckCode
                                                    .status_label
                                            }
                                        </span>
                                    </div>
                                </div>
                                <div className={classes['field']}>
                                    <label className={classes['label']}>
                                        <span>Balance</span>
                                    </label>
                                    <div
                                        className={classes['control']}
                                        dangerouslySetInnerHTML={{
                                            __html:
                                                checkCodeData
                                                    .mpGiftCardCheckCode
                                                    .balance_formatted
                                        }}
                                    />
                                </div>
                                <div className={classes['field']}>
                                    <label className={classes['label']}>
                                        <span>Expired At</span>
                                    </label>
                                    <div className={classes['control']}>
                                        <span>
                                            {
                                                checkCodeData
                                                    .mpGiftCardCheckCode
                                                    .expired_at
                                            }
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                    <button
                        className={classes['action']}
                        onClick={onCheckCodeClick}
                    >
                        <span>
                        {formatMessage({
                                    id: 'Check',
                                    defaultMessage: 'Check'
                                })}
                        </span>
                    </button>
                </div>
                {maxUsed ? (
                    <React.Fragment>
                        <div
                            className={classes['credit-title']}
                            onClick={() =>
                                setIsApplyCreditClosed(!isApplyCreditClosed)
                            }
                        >
                           
                            {formatMessage({
                                    id: 'Use Gift Credit',
                                    defaultMessage: 'Use Gift Credit'
                                })}
                            {!isApplyCreditClosed && (
                                <Icon.ChevronDown className={classes.icon} />
                            )}
                            {isApplyCreditClosed && (
                                <Icon.ChevronUp className={classes.icon} />
                            )}
                        </div>
                        <div
                            className={classes.content + ' ' + classes.credit}
                            style={{
                                display: isApplyCreditClosed ? 'flex' : 'none'
                            }}
                        >
                            <div className={classes['gift-credit-slider']}>
                                <input
                                    type="range"
                                    min="0"
                                    max={maxUsed}
                                    step="0.01"
                                    value={creditValue || creditUsed}
                                    onChange={e => {
                                        setCreditValue(e.target.value);
                                    }}
                                    onMouseUp={handleSetCredit}
                                />
                            </div>
                            <div className={classes['gift-credit-label']}>
                                <span>
                                {formatMessage({
                                    id: 'You are using',
                                    defaultMessage: 'You are using'
                                })}
                                     </span>
                                <input
                                    id={classes['gift-card-credit-input']}
                                    onChange={onCreditChange}
                                    value={creditValue || creditUsed}
                                    onBlur={handleSetCredit}
                                />
                            </div>
                        </div>
                    </React.Fragment>
                ) : null}
            </div>
        </div>
    );
};

export default GiftCardDiscount;
