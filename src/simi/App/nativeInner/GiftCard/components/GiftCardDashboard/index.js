import React, { Fragment, useState, useEffect } from 'react';
import { useMutation } from '@apollo/client';
import defaultClasses from './giftCardDashboard.module.css';
import { useStyle } from '@magento/venia-ui/lib/classify.js';
import { useGiftCardDashboard } from '../../talons/useGiftCardDashboard.js';
import { redeemGiftCard } from '../../talons/redeemGiftCard';
import { removeGiftCardFromList } from '../../talons/removeGiftCardFromList';
import { addGiftCardToList } from '../../talons/addGiftCardToList';
import { checkGiftCardCode } from '../../talons/checkGiftCardCode';
import { SAVE_NOTIFICATIONS } from '../../talons/GiftCard.gql';
import { FormattedMessage, useIntl } from 'react-intl';
import * as Icon from 'react-feather';
import { fullPageLoadingIndicator } from '@magento/venia-ui/lib/components/LoadingIndicator';
import { Title } from '@magento/venia-ui/lib/components/Head';
import { Price } from '@magento/peregrine';
import LeftMenu from 'src/simi/App/core/LeftMenu';

const GiftCardDashboard = props => {
    const [gcCode, setGcCode] = useState('');
    const { formatMessage } = useIntl();
    const [isChecked, setIsChecked] = useState(false);
    const [
        isCheckCodeMessageDisplayed,
        setIsCheckCodeMessageDisplayed
    ] = useState(false);
    const [isAddGcMsgDisplayed, setIsAddGcMsgDisplayed] = useState(false);
    const [isRedeemMsgDisplayed, setIsRedeemMsgDisplayed] = useState(false);
    const [isRemoveGcMsgDisplayed, setIsRemoveGcMsgDisplayed] = useState(false);
    const [isSaveNotiMsgDisplayed, setIsSaveNotiMsgDisplayed] = useState(false);
    const [activeGCView, setActiveGCView] = useState(999);
    const [showOverlay, setShowOverlay] = useState(false);
    const [codesArray, setCodesArray] = useState([]);

    const classes = useStyle(defaultClasses, props.classes);

    const {
        gcDashboardData,
        gcDashboardLoading,
        derivedErrorMessage,
        gcDashboardRefetch
    } = useGiftCardDashboard();

    const {
        checkCode,
        checkCodeLoading,
        checkCodeData,
        checkCodeErrorMessage
    } = checkGiftCardCode();

    const {
        redeem,
        redeemLoading,
        redeemData,
        redeemErrorMessage
    } = redeemGiftCard();

    const {
        addGiftCard,
        addGcLoading,
        addGcData,
        addGcErrorMessage
    } = addGiftCardToList();

    const {
        removeGiftCard,
        removeGcLoading,
        removeGcData,
        removeGcErrorMessage
    } = removeGiftCardFromList();

    const [
        saveNotifications,
        { loading: saveNotificationsLoading, error: saveNotificationsError }
    ] = useMutation(SAVE_NOTIFICATIONS);

    useEffect(() => {
        setTimeout(() => {
            gcDashboardRefetch();
        }, 0);
    }, [
        checkCodeLoading,
        redeemLoading,
        addGcLoading,
        removeGcLoading,
        saveNotificationsLoading
    ]);

    let initialCodesArray = [];

    useEffect(() => {
        setCodesArray(initialCodesArray);
    }, [gcDashboardLoading]);

    if (!gcDashboardData || !gcDashboardData.mpGiftCardDashboardConfig) {
        return fullPageLoadingIndicator;
    }

    const {
        balance,
        isEnableCredit,
        notification,
        giftCardLists,
        transactions
    } = gcDashboardData.mpGiftCardDashboardConfig;
    giftCardLists.map(giftcard => {
        initialCodesArray.push(giftcard['hidden_code']);
    });

    const onInputChange = e => {
        setGcCode(e.target.value);
        setIsChecked(false);
        setIsCheckCodeMessageDisplayed(false);
    };
    const onCheckCodeClick = () => {
        setGcCode(gcCode.toUpperCase().trim());
        checkCode({ variables: { code: gcCode.toUpperCase().trim() } });
        setIsChecked(true);
        setIsCheckCodeMessageDisplayed(true);
        setTimeout(() => {
            setIsCheckCodeMessageDisplayed(false);
        }, 5000);
    };
    const handleAddGiftCard = () => {
        addGiftCard({ variables: { code: gcCode } })
            .then(res => void 0)
            .catch(err => void 0);
        setIsAddGcMsgDisplayed(true);
        setIsRedeemMsgDisplayed(false);
        setIsCheckCodeMessageDisplayed(false);
        setIsRemoveGcMsgDisplayed(false);
        setIsSaveNotiMsgDisplayed(false);
        setTimeout(() => {
            setIsAddGcMsgDisplayed(false);
        }, 8000);
    };
    const handleRedeemGiftCard = gcCode => {
        redeem({ variables: { code: gcCode } })
            .then(res => void 0)
            .catch(err => void 0);
        setIsRedeemMsgDisplayed(true);
        setIsAddGcMsgDisplayed(false);
        setIsCheckCodeMessageDisplayed(false);
        setIsRemoveGcMsgDisplayed(false);
        setIsSaveNotiMsgDisplayed(false);
        setTimeout(() => {
            setIsRedeemMsgDisplayed(false);
        }, 8000);
    };
    const handleRemoveGiftCard = code => {
        removeGiftCard({ variables: { code: code } })
            .then(res => void 0)
            .catch(err => void 0);
        setIsRemoveGcMsgDisplayed(true);
        setIsRedeemMsgDisplayed(false);
        setIsAddGcMsgDisplayed(false);
        setIsCheckCodeMessageDisplayed(false);
        setIsSaveNotiMsgDisplayed(false);
        setTimeout(() => {
            setIsRemoveGcMsgDisplayed(false);
        }, 8000);
    };
    const handleSetNotificationsLoading = () => {
        setIsSaveNotiMsgDisplayed(true);
        setIsRemoveGcMsgDisplayed(false);
        setIsRedeemMsgDisplayed(false);
        setIsAddGcMsgDisplayed(false);
        setIsCheckCodeMessageDisplayed(false);
        setTimeout(() => {
            setIsSaveNotiMsgDisplayed(false);
        }, 8000);
    };

    const handleEscGCView = () => {
        setActiveGCView(999);
        setShowOverlay(false);
    };

    const checkCodeMessage = !checkCodeLoading ? (
        <div
            className={classes['message-container']}
            style={{ maxHeight: isCheckCodeMessageDisplayed ? '200px' : '0px' }}
        >
            {checkCodeData &&
                checkCodeData.mpGiftCardCheckCode.status_label === 'Active' && (
                    <div className={classes['message-success']}>
                        <Icon.Check className={classes['message-icon']} />
                        {`Gift Card "${gcCode}" is available.`}
                        <table>
                            <tbody>
                                <tr>
                                    <td>
                                        {formatMessage({
                                            id: 'Code',
                                            defaultMessage: 'Code'
                                        })}
                                    </td>
                                    <td>{gcCode}</td>
                                </tr>
                                <tr>
                                    <td>
                                        {formatMessage({
                                            id: 'Active Balance',
                                            defaultMessage: 'Active Balance'
                                        })}
                                    </td>
                                    <td
                                        dangerouslySetInnerHTML={{
                                            __html:
                                                checkCodeData
                                                    .mpGiftCardCheckCode
                                                    .balance_formatted
                                        }}
                                    />
                                </tr>
                                <tr>
                                    <td>
                                        {formatMessage({
                                            id: 'Status',
                                            defaultMessage: 'Status'
                                        })}
                                    </td>
                                    <td>
                                        {
                                            checkCodeData.mpGiftCardCheckCode
                                                .status_label
                                        }
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                )}
            {(!checkCodeData ||
                !checkCodeData.mpGiftCardCheckCode ||
                checkCodeData.mpGiftCardCheckCode.status_label != 'Active') && (
                <div className={classes['message-error']}>
                    <Icon.X className={classes['message-icon']} />
                    {formatMessage({
                        id: `${checkCodeErrorMessage}`,
                        defaultMessage: `${checkCodeErrorMessage}`
                    })}
                </div>
            )}
        </div>
    ) : null;

    const addGcMessage = !addGcLoading ? (
        <div
            className={classes['message-container']}
            style={{ maxHeight: isAddGcMsgDisplayed ? '200px' : '0px' }}
        >
            {!addGcErrorMessage && !addGcLoading && (
                <div className={classes['message-success']}>
                    <Icon.Check className={classes['message-icon']} />
                    {`Gift Card "${gcCode}" added successfully.`}
                </div>
            )}
            {addGcErrorMessage && !addGcLoading && (
                <div className={classes['message-error']}>
                    <Icon.X className={classes['message-icon']} />
                    {formatMessage({
                        id: `${addGcErrorMessage}`,
                        defaultMessage: `${addGcErrorMessage}`
                    })}
                </div>
            )}
        </div>
    ) : null;

    const redeemMessage = !redeemLoading ? (
        <div
            className={classes['message-container']}
            style={{ maxHeight: isRedeemMsgDisplayed ? '200px' : '0px' }}
        >
            {!redeemErrorMessage && !addGcLoading && (
                <div className={classes['message-success']}>
                    <Icon.Check className={classes['message-icon']} />
                    {`Gift Card redeemed successfully.`}
                </div>
            )}
            {redeemErrorMessage && !addGcLoading && (
                <div className={classes['message-error']}>
                    <Icon.X className={classes['message-icon']} />
                    {formatMessage({
                        id: `${redeemErrorMessage}`,
                        defaultMessage: `${redeemErrorMessage}`
                    })}
                </div>
            )}
        </div>
    ) : null;

    const removeGcMessage = !removeGcLoading ? (
        <div
            className={classes['message-container']}
            style={{ maxHeight: isRemoveGcMsgDisplayed ? '200px' : '0px' }}
        >
            {!removeGcErrorMessage && !removeGcLoading && (
                <div className={classes['message-success']}>
                    <Icon.Check className={classes['message-icon']} />
                    {`Gift Card removemed successfully.`}
                </div>
            )}
            {removeGcErrorMessage && !removeGcLoading && (
                <div className={classes['message-error']}>
                    <Icon.X className={classes['message-icon']} />
                    {formatMessage({
                        id: `${removeGcMessage}`,
                        defaultMessage: `${removeGcMessage}`
                    })}
                </div>
            )}
        </div>
    ) : null;

    const saveNotiMessage = !saveNotificationsLoading ? (
        <div
            className={classes['message-container']}
            style={{ maxHeight: isSaveNotiMsgDisplayed ? '200px' : '0px' }}
        >
            {!saveNotificationsError && !saveNotificationsLoading && (
                <div className={classes['message-success']}>
                    <Icon.Check className={classes['message-icon']} />
                    {`Saved notifications successfully`}
                </div>
            )}
            {saveNotificationsError && !saveNotificationsLoading && (
                <div className={classes['message-error']}>
                    <Icon.X className={classes['message-icon']} />
                    {formatMessage({
                        id: `${saveNotificationsError}`,
                        defaultMessage: `${saveNotificationsError}`
                    })}
                </div>
            )}
        </div>
    ) : null;

    const currentBalanceBlock = (
        <div className={classes['block-content']}>
            <div className={classes['box-information']}>
                <div className={classes['box-title']}>
                    <strong>
                        {formatMessage({
                            id: 'My current balance',
                            defaultMessage: 'My current balance'
                        })}
                    </strong>
                </div>
                <div className={classes['box-content']}>
                    <Price currencyCode="USD" value={balance} />
                </div>
            </div>
            <div className={classes['box-information']}>
                <div className={classes['box-title']}>
                    <strong>
                        {formatMessage({
                            id: 'Check/Redeem Gift Card',
                            defaultMessage: 'Check/Redeem Gift Card'
                        })}
                    </strong>
                    <br />
                </div>
                <div className={classes['gift-code-input-field']}>
                    <Icon.Gift className={classes['gift-icon']} />
                    <input
                        className={classes['check-code-field']}
                        value={gcCode}
                        onChange={onInputChange}
                    />
                </div>
                <div className={classes['action-buttons']}>
                    {isChecked &&
                    checkCodeData &&
                    checkCodeData.mpGiftCardCheckCode.status_label ===
                        'Active' ? (
                        <Fragment>
                            <button
                                className={classes['action-button']}
                                type="button"
                                onClick={() => handleRedeemGiftCard(gcCode)}
                            >
                                {formatMessage({
                                    id: 'Redeem',
                                    defaultMessage: 'Redeem'
                                })}
                            </button>
                            <button
                                className={classes['action-button']}
                                type="button"
                                onClick={handleAddGiftCard}
                            >
                                {formatMessage({
                                    id: 'Add to list',
                                    defaultMessage: 'Add to list'
                                })}
                            </button>
                        </Fragment>
                    ) : (
                        <button
                            className={classes['action-button']}
                            type="button"
                            onClick={onCheckCodeClick}
                        >
                            {formatMessage({
                                id: 'Check',
                                defaultMessage: 'Check'
                            })}
                        </button>
                    )}
                </div>
                {checkCodeMessage}
            </div>
        </div>
    );

    const cardListTableRows = giftCardLists.map((giftcard, i) => {
        return (
            <Fragment>
                <tr>
                    <th
                        className={classes.code}
                        onClick={() => {
                            let triggeredCodesArray = [...codesArray];
                            triggeredCodesArray.splice(
                                i,
                                1,
                                triggeredCodesArray[i] ===
                                    giftcard['hidden_code']
                                    ? giftcard['code']
                                    : giftcard['hidden_code']
                            );
                            setCodesArray(triggeredCodesArray);
                        }}
                    >
                        {codesArray[i]}
                    </th>
                    <th
                        className={classes.balance}
                        dangerouslySetInnerHTML={{
                            __html: giftcard['balance_formatted']
                        }}
                    />
                    <th className={classes.status}>
                        {giftcard['status_label']}
                    </th>
                    <th className={classes['expired-at']}>
                        {giftcard['expired_at_formatted']}
                    </th>
                    <th className={classes.actions}>
                        <a
                            href={void 0}
                            onClick={() => {
                                setActiveGCView(i);
                                setShowOverlay(true);
                            }}
                        >
                            <span>
                                {formatMessage({
                                    id: 'View',
                                    defaultMessage: 'View'
                                })}
                            </span>
                        </a>
                        {giftcard.can_redeem && (
                            <a
                                href={void 0}
                                onClick={() =>
                                    handleRedeemGiftCard(giftcard.code)
                                }
                            >
                                <span>
                                    {formatMessage({
                                        id: 'Redeem',
                                        defaultMessage: 'Redeem'
                                    })}
                                </span>
                            </a>
                        )}
                        <a
                            href={void 0}
                            onClick={() => handleRemoveGiftCard(giftcard.code)}
                        >
                            <span>
                                {formatMessage({
                                    id: 'Remove',
                                    defaultMessage: 'Remove'
                                })}
                            </span>
                        </a>
                    </th>
                </tr>
            </Fragment>
        );
    });
    const giftCardViews = giftCardLists.map((giftcard, i) => {
        return (
            <div
                className={classes['modal-inner-wrap']}
                style={{
                    transform:
                        activeGCView == i
                            ? 'translateY(0)'
                            : 'translateY(-1500px)'
                }}
            >
                <header className={classes['modal-header']}>
                    <h1>{giftcard.code}</h1>
                    <button
                        className={classes['action-close']}
                        onClick={handleEscGCView}
                    >
                        <Icon.X />
                    </button>
                </header>
                <div
                    className={`${classes['modal-content']} ${
                        classes['block-gift-card']
                    }`}
                >
                    <div className={classes['gift-card-view']}>
                        <div className={classes['gift-card-view-detail']}>
                            <table
                                className={classes['table-gift-card-detail']}
                            >
                                <tbody>
                                    <tr>
                                        <td>
                                            {formatMessage({
                                                id: 'Balance',
                                                defaultMessage: 'Balance'
                                            })}
                                        </td>
                                        <td
                                            dangerouslySetInnerHTML={{
                                                __html:
                                                    giftcard[
                                                        'balance_formatted'
                                                    ]
                                            }}
                                        />
                                    </tr>
                                    <tr>
                                        <td>
                                            {formatMessage({
                                                id: 'Status',
                                                defaultMessage: 'Status'
                                            })}
                                        </td>
                                        <td>{giftcard['status_label']}</td>
                                    </tr>
                                    <tr>
                                        <td>
                                            {formatMessage({
                                                id: 'Expired Date',
                                                defaultMessage: 'Expired Date'
                                            })}
                                        </td>
                                        <td>
                                            {giftcard['expired_at_formatted']}
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                    <div className={classes['block-history']}>
                        <div className={classes['block-title']}>
                            {formatMessage({
                                id: 'History',
                                defaultMessage: 'History'
                            })}
                        </div>
                        <div className={classes['block-content']}>
                            <table>
                                <thead
                                    style={{
                                        borderBottom: '1px solid #cccccc'
                                    }}
                                >
                                    <tr>
                                        <th>
                                            {formatMessage({
                                                id: 'Date',
                                                defaultMessage: 'Date'
                                            })}
                                        </th>
                                        <th>
                                            {formatMessage({
                                                id: 'Action',
                                                defaultMessage: 'Action'
                                            })}
                                        </th>
                                        <th>
                                            {formatMessage({
                                                id: 'Amount',
                                                defaultMessage: 'Amount'
                                            })}
                                        </th>
                                        <th>
                                            {formatMessage({
                                                id: 'Status',
                                                defaultMessage: 'Status'
                                            })}
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {giftcard.histories.map(history => {
                                        return (
                                            <tr>
                                                <th>
                                                    {
                                                        history[
                                                            'created_at_formatted'
                                                        ]
                                                    }
                                                </th>
                                                <th>
                                                    {history['action_label']}
                                                </th>
                                                <th
                                                    dangerouslySetInnerHTML={{
                                                        __html:
                                                            history[
                                                                'amount_formatted'
                                                            ]
                                                    }}
                                                />
                                                <th>
                                                    {history['status_label']}
                                                </th>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        );
    });

    const cardListTable = giftCardLists.length ? (
        <table className={classes['table-giftcard']}>
            <thead>
                <tr>
                    <th scope="col" className="col code">
                        {formatMessage({
                            id: 'Code',
                            defaultMessage: 'Code'
                        })}
                    </th>
                    <th scope="col" className="col balance">
                        {formatMessage({
                            id: 'Balance',
                            defaultMessage: 'Balance'
                        })}
                    </th>
                    <th scope="col" className="col status">
                        {formatMessage({
                            id: 'Status',
                            defaultMessage: 'Status'
                        })}
                    </th>
                    <th scope="col" className="col expired_at">
                        {formatMessage({
                            id: 'Expired Date',
                            defaultMessage: 'Expired Date'
                        })}
                    </th>
                    <th scope="col" className="col actions">
                        &nbsp;
                    </th>
                </tr>
            </thead>
            <tbody>{cardListTableRows}</tbody>
        </table>
    ) : (
        <>
            {formatMessage({
                id: 'You have no saved gift card',
                defaultMessage: 'You have no saved gift card'
            })}
        </>
    );

    const transactionsTableRows = transactions.map(transaction => {
        return (
            <tr>
                <th className={classes.id}>{transaction['transaction_id']}</th>
                <th className={classes.date}>
                    {transaction['created_at_formatted']}
                </th>
                <th className={classes.action}>
                    {transaction['action_label']}
                </th>
                <th
                    className={classes.amount}
                    dangerouslySetInnerHTML={{
                        __html: transaction['amount_formatted']
                    }}
                />
                <th className={classes.detail}>
                    {transaction['action_detail']}
                </th>
            </tr>
        );
    });
    const transactionsTable = (
        <table className={classes['table-giftcard']}>
            <thead>
                <tr>
                    <th scope="col" className="col id">
                        #
                    </th>
                    <th scope="col" className="col date">
                        {formatMessage({
                            id: 'Date',
                            defaultMessage: 'Date'
                        })}
                    </th>
                    <th scope="col" className="col action">
                        {formatMessage({
                            id: 'Action',
                            defaultMessage: 'Action'
                        })}
                    </th>
                    <th scope="col" className="col amount">
                        {formatMessage({
                            id: 'Amount',
                            defaultMessage: 'Amount'
                        })}
                    </th>
                    <th scope="col" className="col detail">
                        {formatMessage({
                            id: 'Detail',
                            defaultMessage: 'Detail'
                        })}
                    </th>
                </tr>
            </thead>
            <tbody>{transactionsTableRows}</tbody>
        </table>
    );

    const settingNotifications = (
        <div className={classes['notification-block']}>
            <div className={classes['choice-field']}>
                <input
                    type="checkbox"
                    name="giftcard-notification"
                    className={classes['checkbox']}
                    defaultChecked={notification.giftcardNotification}
                    onClick={() => {
                        saveNotifications({
                            variables: {
                                gc_noti: !notification.giftcardNotification
                            }
                        });
                        handleSetNotificationsLoading();
                    }}
                />
                <label
                    className={classes['label']}
                    htmlFor="giftcard-notification"
                >
                    {formatMessage({
                        id: 'Gift Card Update Notification',
                        defaultMessage: 'Gift Card Update Notification'
                    })}
                </label>
            </div>
            <div className={classes['choice-field']}>
                <input
                    type="checkbox"
                    name="credit-notification"
                    className={classes['checkbox']}
                    defaultChecked={notification.creditNotification}
                    onClick={() => {
                        saveNotifications({
                            variables: {
                                credit_noti: !notification.creditNotification
                            }
                        });
                        handleSetNotificationsLoading();
                    }}
                />
                <label
                    className={classes['label']}
                    htmlFor="credit-notification"
                >
                    {formatMessage({
                        id: 'Update Balance Notification',
                        defaultMessage: 'Update Balance Notification'
                    })}
                </label>
            </div>
        </div>
    );

    return (
        <div className={`${classes.root} container`}>
            <Title>
                {formatMessage({
                    id: 'My Gift Cards',
                    defaultMessage: 'My Gift Cards'
                })}
            </Title>
            <div className={classes.wrapper}>
                <LeftMenu label="My Gift Cards" />
                <div>
                    <div
                        className={classes.wrapperContent}
                        style={{
                            margin: 'auto',
                            outline: 'none'
                        }}
                        tabIndex="0"
                        onKeyDown={handleEscGCView}
                    >
                        <div className={classes['page-title-wrapper']}>
                            <h1 className={classes['page-title']}>
                                {formatMessage({
                                    id: 'My Gift Cards',
                                    defaultMessage: 'My Gift Cards'
                                })}
                            </h1>
                        </div>
                        {addGcMessage}
                        {redeemMessage}
                        {removeGcMessage}
                        {saveNotiMessage}
                        <div className={classes['giftcard-container']}>
                            <div className={classes['messages']} />
                            <div className={classes['block-gift-card']}>
                                {currentBalanceBlock}
                            </div>
                            <div className={classes['block-gift-card']}>
                                <div className={classes['block-title']}>
                                    {formatMessage({
                                        id: 'My Saved Gift Cards',
                                        defaultMessage: 'My Saved Gift Cards'
                                    })}
                                </div>
                                {cardListTable}
                            </div>
                            <div className={classes['block-gift-card']}>
                                <div className={classes['block-title']}>
                                    {formatMessage({
                                        id: 'Transactions',
                                        defaultMessage: 'Transactions'
                                    })}
                                </div>
                                {transactionsTable}
                            </div>
                            <div className={classes['block-gift-card']}>
                                <div className={classes['block-title']}>
                                    {formatMessage({
                                        id: 'Notification',
                                        defaultMessage: 'Notification'
                                    })}
                                </div>
                                {settingNotifications}
                            </div>
                        </div>
                    </div>
                    {giftCardViews}
                    <div
                        className={classes.overlay}
                        style={{
                            opacity: showOverlay ? '0.55' : '0',
                            zIndex: showOverlay ? '900' : '-900'
                        }}
                        onClick={handleEscGCView}
                    />
                </div>
            </div>
        </div>
    );
};

export default GiftCardDashboard;
