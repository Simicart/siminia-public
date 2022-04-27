import React, { Fragment, useState, useEffect } from 'react'
import { useMutation } from '@apollo/client'
import defaultClasses from './giftCardDashboard.module.css'
import { useStyle } from '@magento/venia-ui/lib/classify.js';
import { useGiftCardDashboard } from '../../talons/useGiftCardDashboard.js'
import { redeemGiftCard } from '../../talons/redeemGiftCard'
import { removeGiftCardFromList } from '../../talons/removeGiftCardFromList'
import { addGiftCardToList } from '../../talons/addGiftCardToList'
import { checkGiftCardCode } from '../../talons/checkGiftCardCode'
import { SAVE_NOTIFICATIONS } from '../../talons/GiftCard.gql'
// import Loading from '../loading.jpg'
import * as Icon from 'react-feather'
import {fullPageLoadingIndicator} from '@magento/venia-ui/lib/components/LoadingIndicator';
import { Title } from '@magento/venia-ui/lib/components/Head'
import { Price } from '@magento/peregrine';
import LeftMenu from 'src/simi/App/core/LeftMenu'

const GiftCardDashboard = props => {
	const [gcCode, setGcCode] = useState('')
	const [isChecked, setIsChecked] = useState(false)
	const [isCheckCodeMessageDisplayed, setIsCheckCodeMessageDisplayed] = useState(false)
	const [isAddGcMsgDisplayed, setIsAddGcMsgDisplayed] = useState(false)
	const [isRedeemMsgDisplayed, setIsRedeemMsgDisplayed] = useState(false)
	const [isRemoveGcMsgDisplayed, setIsRemoveGcMsgDisplayed] = useState(false)
	const [isSaveNotiMsgDisplayed, setIsSaveNotiMsgDisplayed] = useState(false)
	const [activeGCView, setActiveGCView] = useState(999)
	const [showOverlay, setShowOverlay] = useState(false)
	const [codesArray, setCodesArray] = useState([])

	const classes = useStyle(defaultClasses, props.classes);

	const {
		gcDashboardData,
		gcDashboardLoading,
		derivedErrorMessage,
		gcDashboardRefetch
	} = useGiftCardDashboard()

	const {
		checkCode,
		checkCodeLoading,
		checkCodeData,
		checkCodeErrorMessage
	} = checkGiftCardCode()

	const {
		redeem,
	    redeemLoading,
	    redeemData,
	    redeemErrorMessage
	} = redeemGiftCard()

	const {
		addGiftCard,
		addGcLoading,
		addGcData,
		addGcErrorMessage
	} = addGiftCardToList()

	const {
		removeGiftCard,
		removeGcLoading,
		removeGcData,
		removeGcErrorMessage
	} = removeGiftCardFromList()

	const [saveNotifications, { loading: saveNotificationsLoading, error: saveNotificationsError}] = useMutation(SAVE_NOTIFICATIONS)

	useEffect(() => {
        setTimeout(() => {
        	gcDashboardRefetch()
        }, 0)
    }, [checkCodeLoading, redeemLoading, addGcLoading, removeGcLoading, saveNotificationsLoading])

	let initialCodesArray = []

    useEffect(() => {
		setCodesArray(initialCodesArray)
	}, [gcDashboardLoading])

	if(!gcDashboardData || !gcDashboardData.mpGiftCardDashboardConfig) {
		return fullPageLoadingIndicator;
	}

	const {
		balance,
		isEnableCredit,
		notification,
		giftCardLists,
		transactions
	} = gcDashboardData.mpGiftCardDashboardConfig

	giftCardLists.map(giftcard => {
		initialCodesArray.push(giftcard['hidden_code'])
	})

	const onInputChange = (e) => {
		setGcCode(e.target.value)
		setIsChecked(false)
		setIsCheckCodeMessageDisplayed(false)
	}
	const onCheckCodeClick = () => {
		setGcCode(gcCode.toUpperCase().trim())
		checkCode({ variables: { code: gcCode.toUpperCase().trim() }})
		setIsChecked(true)
		setIsCheckCodeMessageDisplayed(true)
		setTimeout(() => {
			setIsCheckCodeMessageDisplayed(false)
		}, 5000)
	}
	const handleAddGiftCard = () => {
		addGiftCard({ variables: {code: gcCode}})
			.then(res => void 0)
			.catch(err => void 0)
		setIsAddGcMsgDisplayed(true)
		setIsRedeemMsgDisplayed(false)
		setIsCheckCodeMessageDisplayed(false)
		setIsRemoveGcMsgDisplayed(false)
		setIsSaveNotiMsgDisplayed(false)
		setTimeout(() => {
			setIsAddGcMsgDisplayed(false)
		}, 8000)
	}
	const handleRedeemGiftCard = (gcCode) => {
		redeem({ variables: {code: gcCode}})
			.then(res => void 0)
			.catch(err => void 0)
		setIsRedeemMsgDisplayed(true)
		setIsAddGcMsgDisplayed(false)
		setIsCheckCodeMessageDisplayed(false)
		setIsRemoveGcMsgDisplayed(false)
		setIsSaveNotiMsgDisplayed(false)
		setTimeout(() => {
			setIsRedeemMsgDisplayed(false)
		}, 8000)
	}
	const handleRemoveGiftCard = (code) => {
		removeGiftCard({ variables: {code: code}})
			.then(res => void 0)
			.catch(err => void 0)
		setIsRemoveGcMsgDisplayed(true)
		setIsRedeemMsgDisplayed(false)
		setIsAddGcMsgDisplayed(false)
		setIsCheckCodeMessageDisplayed(false)
		setIsSaveNotiMsgDisplayed(false)
		setTimeout(() => {
			setIsRemoveGcMsgDisplayed(false)
		}, 8000)
	}
	const handleSetNotificationsLoading = () => {
		setIsSaveNotiMsgDisplayed(true)
		setIsRemoveGcMsgDisplayed(false)
		setIsRedeemMsgDisplayed(false)
		setIsAddGcMsgDisplayed(false)
		setIsCheckCodeMessageDisplayed(false)
		setTimeout(() => {
			setIsSaveNotiMsgDisplayed(false)
		}, 8000)
	}

	const handleEscGCView = () => {
		setActiveGCView(999);
		setShowOverlay(false)
	}

	const checkCodeMessage = ( !checkCodeLoading ? 
		<div className={classes['message-container']} style={{maxHeight: isCheckCodeMessageDisplayed ? '200px' : '0px'}}>
			{ (checkCodeData && checkCodeData.mpGiftCardCheckCode.status_label === "Active") &&
				<div className={classes['message-success']}>
					<Icon.Check className={classes['message-icon']}/>
					{`Gift Card "${gcCode}" is available.`}
					<table>
						<tbody>
							<tr>
								<td>Code</td>
								<td>{gcCode}</td>
							</tr>
							<tr>
								<td>Active Balance</td>
								<td dangerouslySetInnerHTML={{__html: checkCodeData.mpGiftCardCheckCode.balance_formatted}}></td>
							</tr>
							<tr>
								<td>Status</td>
								<td>{checkCodeData.mpGiftCardCheckCode.status_label}</td>
							</tr>
						</tbody>
					</table>
				</div>
			}
			{ (!checkCodeData || !checkCodeData.mpGiftCardCheckCode || checkCodeData.mpGiftCardCheckCode.status_label != "Active") &&
				<div className={classes['message-error']}>
					<Icon.X className={classes['message-icon']} />
					{checkCodeErrorMessage}
				</div>
			}
		</div>
		: null
	)

	const addGcMessage = ( !addGcLoading ?
		<div className={classes['message-container']} style={{maxHeight: isAddGcMsgDisplayed ? '200px' : '0px'}}>
			{ (!addGcErrorMessage && !addGcLoading) &&
				<div className={classes['message-success']}>
					<Icon.Check className={classes['message-icon']}/>
					{`Gift Card "${gcCode}" added successfully.`}
				</div>
			}
			{ (addGcErrorMessage && !addGcLoading) &&
				<div className={classes['message-error']}>
					<Icon.X className={classes['message-icon']} />
					{addGcErrorMessage}
				</div>
			}
		</div>
		: null
	)

	const redeemMessage = ( !redeemLoading ?
		<div className={classes['message-container']} style={{maxHeight: isRedeemMsgDisplayed ? '200px' : '0px'}}>
			{ (!redeemErrorMessage && !addGcLoading) &&
				<div className={classes['message-success']}>
					<Icon.Check className={classes['message-icon']}/>
					{`Gift Card redeemed successfully.`}
				</div>
			}
			{ (redeemErrorMessage && !addGcLoading) &&
				<div className={classes['message-error']}>
					<Icon.X className={classes['message-icon']} />
					{redeemErrorMessage}
				</div>
			}
		</div>
		: null
	)

	const removeGcMessage = ( !removeGcLoading ?
		<div className={classes['message-container']} style={{maxHeight: isRemoveGcMsgDisplayed ? '200px' : '0px'}}>
			{ (!removeGcErrorMessage && !removeGcLoading) &&
				<div className={classes['message-success']}>
					<Icon.Check className={classes['message-icon']}/>
					{`Gift Card removemed successfully.`}
				</div>
			}
			{ (removeGcErrorMessage && !removeGcLoading) &&
				<div className={classes['message-error']}>
					<Icon.X className={classes['message-icon']} />
					{removeGcMessage}
				</div>
			}
		</div>
		: null
	)

	const saveNotiMessage = ( !saveNotificationsLoading ?
		<div className={classes['message-container']} style={{maxHeight: isSaveNotiMsgDisplayed ? '200px' : '0px'}}>
			{ (!saveNotificationsError && !saveNotificationsLoading) &&
				<div className={classes['message-success']}>
					<Icon.Check className={classes['message-icon']}/>
					{`Saved notifications successfully`}
				</div>
			}
			{ (saveNotificationsError && !saveNotificationsLoading) &&
				<div className={classes['message-error']}>
					<Icon.X className={classes['message-icon']} />
					{saveNotificationsError}
				</div>
			}
		</div>
		: null
	)

	const currentBalanceBlock = (
		<div className={classes['block-content']}> 
			<div className={classes['box-information']}>
				<div className={classes['box-title']}><strong>My current balance</strong></div>
				<div className={classes['box-content']}>
					<Price currencyCode='USD' value={balance}/>
				</div>
			</div>
			<div className={classes['box-information']}>
				<div className={classes['box-title']}><strong>Check/Redeem Gift Card</strong><br/></div>
				<div className={classes['gift-code-input-field']}>
					<Icon.Gift className={classes['gift-icon']}/>
					<input className={classes['check-code-field']} value={gcCode} onChange={onInputChange}/>
				</div>
				<div className={classes['action-buttons']}>
					{ (isChecked && checkCodeData && checkCodeData.mpGiftCardCheckCode.status_label === "Active") ?
						<Fragment>
							<button 
								className={classes['action-button']} 
								type='button'
								onClick={() => handleRedeemGiftCard(gcCode)}
							>Redeem</button>
							<button 
								className={classes['action-button']} 
								type='button'
								onClick={handleAddGiftCard}
							>Add to list</button>
						</Fragment>
						: 
						<button 
							className={classes['action-button']} 
							type='button' 
							onClick={onCheckCodeClick}
						>Check</button>
					}
				</div>
				{checkCodeMessage}
			</div>
		</div>
	)

	const cardListTableRows = giftCardLists.map((giftcard, i) => {
		return (
			<Fragment>
				<tr>
					<th 
						className={classes.code} 
						onClick={() => {
							let triggeredCodesArray = [...codesArray]
							triggeredCodesArray.splice(i, 1, triggeredCodesArray[i] === giftcard['hidden_code'] ? giftcard['code'] : giftcard['hidden_code'])
							setCodesArray(triggeredCodesArray)
						}}
					>{codesArray[i]}</th>
					<th className={classes.balance} dangerouslySetInnerHTML={{__html: giftcard['balance_formatted']}}></th>
					<th className={classes.status}>{giftcard['status_label']}</th>
					<th className={classes['expired-at']}>{giftcard['expired_at_formatted']}</th>
					<th className={classes.actions}>
						<a 
							href={void(0)} 
							onClick={() => {
								setActiveGCView(i)
								setShowOverlay(true)
							}}
						><span>View</span></a>
						{ giftcard.can_redeem && 	
							<a 
								href={void(0)}
								onClick={() => handleRedeemGiftCard(giftcard.code)}
							><span>Redeem</span></a>
						}
						<a 
							href={void(0)}
							onClick={() => handleRemoveGiftCard(giftcard.code)}
						><span>Remove</span></a>
					</th>
				</tr>
				
			</Fragment>
		)
	})
	const giftCardViews = giftCardLists.map((giftcard, i) => {
		return (
			<div 
				className={classes['modal-inner-wrap']} 
				style={{transform: activeGCView == i ? 'translateY(0)' : 'translateY(-1000px)'}}
			>
				<header className={classes['modal-header']}>
					<h1>{giftcard.code}</h1>
					<button 
						className={classes['action-close']} 
						onClick={handleEscGCView}
					><Icon.X/></button>
				</header>
				<div className={`${classes['modal-content']} ${classes['block-gift-card']}`}>
					<div className={classes['gift-card-view']}>
						<div className={classes['gift-card-view-detail']}>
							<table className={classes['table-gift-card-detail']}>
								<tbody>
									<tr>
										<td>Balance</td>
										<td dangerouslySetInnerHTML={{__html: giftcard['balance_formatted']}}></td>
									</tr>
									<tr>
										<td>Status</td>
										<td>{giftcard['status_label']}</td>
									</tr>
									<tr>
										<td>Expired Date</td>
										<td>{giftcard['expired_at_formatted']}</td>
									</tr>
								</tbody>
							</table>
						</div>
					</div>
					<div className={classes['block-history']}>
						<div className={classes['block-title']}>History</div>
						<div className={classes['block-content']}>
							<table>
								<thead style={{borderBottom: '1px solid #cccccc'}}>
									<tr>
										<th>Date</th>
										<th>Action</th>
										<th>Amount</th>
										<th>Status</th>
									</tr>
								</thead>
								<tbody>
									{ giftcard.histories.map(history => {
										return (
											<tr>
												<th>{history['created_at_formatted']}</th>
												<th>{history['action_label']}</th>
												<th dangerouslySetInnerHTML={{__html: history['amount_formatted']}}></th>
												<th>{history['status_label']}</th>
											</tr>
										)
									})}
								</tbody>
							</table>
						</div>
					</div>
				</div>
			</div>
		)
	})

	const cardListTable = giftCardLists.length ? 
		<table className={classes['table-giftcard']}>
			<thead>
				<tr>
	                <th scope="col" className="col code" >Code</th>
	                <th scope="col" className="col balance">Balance</th>
	                <th scope="col" className="col status">Status</th>
	                <th scope="col" className="col expired_at">Expired Date</th>
	                <th scope="col" className="col actions">&nbsp;</th>
	            </tr>
			</thead>
			<tbody>
				{cardListTableRows}
			</tbody>
		</table> : 'You have no saved gift card'
	

	const transactionsTableRows = transactions.map(transaction => {
		return (
			<tr>
				<th className={classes.id}>{transaction['transaction_id']}</th>
				<th className={classes.date}>{transaction['created_at_formatted']}</th>
				<th className={classes.action}>{transaction['action_label']}</th>
				<th className={classes.amount} dangerouslySetInnerHTML={{__html: transaction['amount_formatted']}}></th>
				<th className={classes.detail}>{transaction['action_detail']}</th>
			</tr>
		)
	})
	const transactionsTable = (
		<table className={classes['table-giftcard']}>
			<thead>
				<tr>
	                <th scope="col" className="col id" >#</th>
	                <th scope="col" className="col date">Date</th>
	                <th scope="col" className="col action">Action</th>
	                <th scope="col" className="col amount">Amount</th>
	                <th scope="col" className="col detail">Detail</th>
	            </tr>
			</thead>
			<tbody>
				{transactionsTableRows}
			</tbody>
		</table>
	)

	const settingNotifications = (
		<div className={classes['notification-block']}>
			<div className={classes['choice-field']}>
				<input 
					type='checkbox' 
					name='giftcard-notification' 
					className={classes['checkbox']} 
					defaultChecked={notification.giftcardNotification}
					onClick={() => {
						saveNotifications({variables: { gc_noti: !notification.giftcardNotification }})
						handleSetNotificationsLoading()
					}}
				/>
				<label className={classes['label']} htmlFor='giftcard-notification'>Gift Card Update Notification</label>
			</div>
			<div className={classes['choice-field']}>
				<input 
					type='checkbox' 
					name='credit-notification' 
					className={classes['checkbox']} 
					defaultChecked={notification.creditNotification}
					onClick={() => {
						saveNotifications({variables: { credit_noti: !notification.creditNotification }})
						handleSetNotificationsLoading()
					}}
				/>
				<label className={classes['label']} htmlFor='credit-notification'>Update Balance Notification</label>
			</div>
		</div>
	)

	return (
		<div className={`${classes.root} container`}>
			<Title>{`My Gift Cards - ${STORE_NAME}`}</Title>
			<div className={classes.wrapper}>
				<LeftMenu label="My Gift Cards" />
				<div>
					<div style={{width: '80%', margin: 'auto', outline: 'none'}} tabIndex='0' onKeyDown={handleEscGCView}>
						<div className={classes['page-title-wrapper']}>
							<h1 className={classes['page-title']}>My Gift Cards</h1>
						</div>
						{addGcMessage}
						{redeemMessage}
						{removeGcMessage}
						{saveNotiMessage}
						<div className={classes['giftcard-container']}>
							<div className={classes['messages']}></div>
							<div className={classes['block-gift-card']} >
								{currentBalanceBlock}
							</div>
							<div className={classes['block-gift-card']}>
								<div className={classes['block-title']}>My Saved Gift Cards</div>
								{cardListTable}
							</div>
							<div className={classes['block-gift-card']}>
								<div className={classes['block-title']}>Transactions</div>
								{transactionsTable}
							</div>
							<div className={classes['block-gift-card']}>
								<div className={classes['block-title']}>Notification</div>
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
					></div>
				</div>
			</div>
			
		</div>
	)
}

export default GiftCardDashboard