import React, { useState } from 'react'
import LeftMenu from '../../simi/App/core/LeftMenu/leftMenu'
import '../styles/styles.scss'
import useStoreConfig from '../talons/useStoreConfig'
import { useOrderedGiftCards } from '../talons/useOrderedGiftCards'
import { useOrderedGiftCardId } from '../talons/useOrderedGiftCardId'
import { fullPageLoadingIndicator } from '@magento/venia-ui/lib/components/LoadingIndicator';
import { FormattedMessage } from 'react-intl'

const MyGiftCards = () => {
    const giftCardConfig = useStoreConfig()
    const myGiftCards = useOrderedGiftCards()
    const orderGiftCardId = useOrderedGiftCardId()
    const [windowWidth, setWindowWidth] = useState(window.innerWidth)
    const [searchCode, setSearchCode] = useState('')
    const [errorCode, setErrorCode] = useState('')
    const [showDetails, setShowDetails] = useState()
    const [codeData, setCodeData] = useState()
    const [pageSize, setPageSize] = useState(10)
    const [pageNumber, setPageNumber] = useState(1)

    if (giftCardConfig.loading) return fullPageLoadingIndicator
    if (giftCardConfig.error) return <p>
        <FormattedMessage id={`Error! ${giftCardConfig.error.message}`}
        defaultMessage={`Error! ${giftCardConfig.error.message}`}></FormattedMessage>
        </p>
    if (myGiftCards.loading) return fullPageLoadingIndicator
    if (myGiftCards.error) return <p>
        <FormattedMessage id={`Error! ${myGiftCards.error.message}`}
        defaultMessage={`Error! ${myGiftCards.error.message}`}></FormattedMessage>
        </p>
    if (orderGiftCardId.loading) return fullPageLoadingIndicator
    if (orderGiftCardId.error) return <p>
        <FormattedMessage id={`Error! ${orderGiftCardId.error.message}`}
        defaultMessage={`Error! ${orderGiftCardId.error.message}`}></FormattedMessage>
        </p>

    const orderedGiftCard = myGiftCards.data.bssCustomerGiftCards.filter((element) => {
        let result = false
        for (let i = 0; i < orderGiftCardId.data.customerOrders.items.length; i++) {
            if (element.order_id.toString() === orderGiftCardId.data.customerOrders.items[i].id) result = true
        }
        return result
    })

    const renderPageNumber = []
    for (let i = 0; i < Math.ceil(orderedGiftCard.length / pageSize); i++) {
        renderPageNumber.push('L95')
    }

    const pagePernumber1 = 10
    const pagePernumber2 = 15
    const pagePernumber3 = 20

    const listGiftCodeShow = () => {
        if (pageNumber !== Math.ceil(orderedGiftCard.length / pageSize)) {
            return orderedGiftCard.slice(pageSize * (pageNumber - 1), pageSize * (pageNumber - 1) + pageSize)
        }
        else return orderedGiftCard.slice(pageSize * (pageNumber - 1), orderedGiftCard.length)
    }

    const start = pageSize * (pageNumber - 1)
    const end = pageSize * (pageNumber - 1) + pageSize
    const listCodeTitle = pageNumber !== Math.ceil(orderedGiftCard.length / pageSize) ?
        `Items ${start + 1} to ${end} of ${orderedGiftCard.length} total` :
        `Items ${start + 1} to ${orderedGiftCard.length} of ${orderedGiftCard.length} total`

    const numberCharacterShow = giftCardConfig.data.bssGiftCardStoreConfig.number_character
    const replaceHiddenCharacter = giftCardConfig.data.bssGiftCardStoreConfig.replace_character

    const onWidthChange = () => {
        setWindowWidth(window.innerWidth)
    }

    window.onresize = onWidthChange

    const handleSearchCode = () => {
        const result = orderedGiftCard.find((element) => element.code === searchCode)
        if (result) {
            setCodeData(result)
            setShowDetails(true)
        }
        else {
            setErrorCode(searchCode)
            setShowDetails(false)
        }
    }

    const handlePageSize = () => {
        const element = document.getElementById('page-size')
        if (element.value === '10' && pageSize !== 10) {
            setPageSize(10)
            setPageNumber(1)
        }
        if (element.value === '15' && pageSize !== 15) {
            setPageSize(15)
            setPageNumber(1)
        }
        if (element.value === '20' && pageSize !== 20) {
            setPageSize(20)
            setPageNumber(1)
        }
    }

    return (
        <>
            {windowWidth < 767 && (
                <>
                    <h1 style={{ fontSize: 18, fontWeight: 'bold', marginTop: 40, marginBottom: 30, marginLeft: '3%' }}>
                        <FormattedMessage id='Gift Cards Information' defaultMessage='Gift Cards Information'></FormattedMessage>
                    </h1>
                    <div style={{ border: '1px solid black', padding: 20, marginTop: 30, width: '94%', marginLeft: '3%' }}>
                        <p className={showDetails ? 'my-gift-code-title-border' : 'my-gift-code-title'}>
                            <FormattedMessage id='Gift Code Details' defaultMessage='Gift Code Details'></FormattedMessage>
                        </p>
                        <div className='my-gift-code-details'>
                            {showDetails && (<div style={{ display: 'flex', flexDirection: 'column' }}>
                                <div className='my-gift-code-row'>
                                    <div style={{ width: '40%' }}>
                                        <p>
                                            <FormattedMessage id='Code' defaultMessage='Code'></FormattedMessage>
                                        </p>
                                    </div>
                                    <div style={{ width: '60%' }}>
                                        <p>{codeData.code}</p>
                                    </div>
                                </div>
                                <div className='my-gift-code-row'>
                                    <div style={{ width: '40%' }}>
                                        <p>
                                            <FormattedMessage id='Value' defaultMessage='Value'></FormattedMessage>
                                        </p>
                                    </div>
                                    <div style={{ width: '60%' }}>
                                        <p>
                                            <FormattedMessage id={`$${codeData.value}`} defaultMessage={`$${codeData.value}`}></FormattedMessage>
                                        </p>
                                    </div>
                                </div>
                                <div className='my-gift-code-row'>
                                    <div style={{ width: '40%' }}>
                                        <p>
                                            <FormattedMessage id='Expire Date' defaultMessage='Expire Date'></FormattedMessage>
                                        </p>
                                    </div>
                                    <div style={{ width: '60%' }}>
                                        <p>{codeData.expire_date}</p>
                                    </div>
                                </div>
                                <div className='my-gift-code-row'>
                                    <div style={{ width: '40%' }}>
                                        <p>
                                            <FormattedMessage id='Status' defaultMessage='Status'></FormattedMessage>
                                        </p>
                                    </div>
                                    <div style={{ width: '60%' }}>
                                        <p>{codeData.status.label}</p>
                                    </div>
                                </div>
                                <div className='my-gift-code-row'>
                                    <div style={{ width: '40%' }}>
                                        <p>
                                            <FormattedMessage id='Order' defaultMessage='Order'></FormattedMessage>
                                        </p>
                                    </div>
                                    <div style={{ width: '60%' }}>
                                        <a href={`/order-history/${orderGiftCardId.data.customerOrders.items.find(ele => ele.id === codeData.order_id.toString()).increment_id}`}
                                            style={{ color: '#0058AC', textDecorationLine: 'underline', fontWeight: 'bold' }}>
                                                <FormattedMessage id={`#${orderGiftCardId.data.customerOrders.items.find(ele => ele.id === codeData.order_id.toString()).increment_id}`}
                                                defaultMessage={`#${orderGiftCardId.data.customerOrders.items.find(ele => ele.id === codeData.order_id.toString()).increment_id}`}
                                                ></FormattedMessage>
                                            </a>
                                    </div>
                                </div>
                            </div>)}
                            <div style={{ display: 'flex', flexDirection: 'row', gap: 10, marginTop: 20 }}>
                                <input className='my-gift-code-details-input' onChange={(e) => setSearchCode(e.target.value)}
                                    value={searchCode}></input>
                                <button className='my-gift-code-details-submit' onClick={handleSearchCode}>
                                    <FormattedMessage id='Submit' defaultMessage='Submit'></FormattedMessage>
                                </button>
                            </div>
                            {showDetails === false && (<p style={{ color: 'red', marginTop: 10 }}>
                                <FormattedMessage id={`The gift card code ${errorCode} is not valid.`}
                                defaultMessage={`The gift card code ${errorCode} is not valid.`}></FormattedMessage>
                            </p>)}
                        </div>
                    </div>

                    {orderedGiftCard.length > 0 && (<div className='my-gift-cards-nav'>
                        <div>
                            <p style={{ marginTop: 8 }}>{listCodeTitle}</p>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'row', gap: 10 }}>
                            {renderPageNumber.map((element, index) =>
                                <button className={pageNumber === index + 1 ? 'my-gift-cards-page-number-selected' : 'my-gift-cards-page-number'}
                                    onClick={() => setPageNumber(index + 1)}>
                                    {index + 1}
                                </button>)}
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'row' }}>
                            <p style={{ marginRight: 5, marginTop: 8 }}>
                                <FormattedMessage id='Show' defaultMessage='Show'></FormattedMessage>
                            </p>
                            <select name='value' id='page-size' style={{ width: 40 }} onChange={handlePageSize}>
                                <option value='10'>{pagePernumber1}</option>
                                <option value='15'>{pagePernumber2}</option>
                                <option value='20'>{pagePernumber3}</option>
                            </select>
                            <p style={{ marginLeft: 5, marginTop: 8 }}>
                                <FormattedMessage id='per page' defaultMessage='per page'></FormattedMessage>
                            </p>
                        </div>
                    </div>)}
                    {orderedGiftCard.length > 0 && (<div style={{ display: 'flex', flexDirection: 'column', marginTop: 20 }}>
                        {listGiftCodeShow().map((element) => {
                            return (
                                <div className='my-gift-card-details'>
                                    <div style={{ paddingLeft: 20, paddingTop: 20, paddingBottom: 5 }}>
                                        <p style={{ fontWeight: 'bold' }}> 
                                            <FormattedMessage id='Code: ' defaultMessage='Code: '></FormattedMessage>
                                            <span style={{ fontWeight: 400 }}>
                                                <FormattedMessage id={`${element.code.slice(0, parseInt(numberCharacterShow))}${replaceHiddenCharacter}`}
                                                defaultMessage={`${element.code.slice(0, parseInt(numberCharacterShow))}${replaceHiddenCharacter}`}></FormattedMessage>
                                                
                                            </span></p>
                                    </div>
                                    <div style={{ paddingLeft: 20, paddingTop: 5, paddingBottom: 5 }}>
                                        <p style={{ fontWeight: 'bold' }}>
                                            <FormattedMessage id='Value: ' defaultMessage='Value: '></FormattedMessage>
                                            <span style={{ fontWeight: 400 }}>
                                                <FormattedMessage id={`$${element.value}`} defaultMessage={`$${element.value}`}></FormattedMessage>
                                            </span>
                                        </p>
                                    </div>
                                    <div style={{ paddingLeft: 20, paddingTop: 5, paddingBottom: 5 }}>
                                        <p style={{ fontWeight: 'bold' }}>
                                            <FormattedMessage id='Expire Date: ' defaultMessage='Expire Date: '></FormattedMessage>
                                            <span style={{ fontWeight: 400 }}>{element.expire_date}</span></p>
                                    </div>
                                    <div style={{ paddingLeft: 20, paddingTop: 5, paddingBottom: 5 }}>
                                        <p style={{ fontWeight: 'bold' }}>
                                            <FormattedMessage id='Status: ' defaultMessage='Status: '></FormattedMessage>
                                            <span style={{ fontWeight: 400 }}>{element.status.label}</span></p>
                                    </div>
                                    <div style={{ paddingLeft: 20, paddingTop: 5, paddingBottom: 20 }}>
                                        <p style={{ fontWeight: 'bold' }}>
                                            <FormattedMessage id='Order: ' defaultMessage='Order: '></FormattedMessage>
                                            <a href={`/order-history/${orderGiftCardId.data.customerOrders.items.find(ele => ele.id === element.order_id.toString()).increment_id}`}
                                                style={{ color: '#0058AC', textDecorationLine: 'underline', fontWeight: 'bold' }}>
                                                <FormattedMessage id={`#${orderGiftCardId.data.customerOrders.items.find(ele => ele.id === element.order_id.toString()).increment_id}`}
                                                defaultMessage={`#${orderGiftCardId.data.customerOrders.items.find(ele => ele.id === element.order_id.toString()).increment_id}`}></FormattedMessage>
                                            </a>
                                        </p>
                                    </div>
                                </div>
                            )
                        })}
                    </div>)}
                </>
            )}

            {767 <= windowWidth && windowWidth <= 960 && (
                <>
                    {orderedGiftCard.length > 0 ? (
                        <div style={{ width: '90%', margin: 'auto' }}>
                            <div style={{ border: '1px solid black', padding: 20, marginTop: 30 }}>
                                <p className={showDetails ? 'my-gift-code-title-border' : 'my-gift-code-title'}>
                                    <FormattedMessage id='Gift Code Details' defaultMessage='Gift Code Details'></FormattedMessage>
                                </p>
                                <div className='my-gift-code-details'>
                                    {showDetails && (<div style={{ display: 'flex', flexDirection: 'column' }}>
                                        <div className='my-gift-code-row'>
                                            <div style={{ width: '40%' }}>
                                                <p>
                                                    <FormattedMessage id='Code' defaultMessage='Code'></FormattedMessage>
                                                </p>
                                            </div>
                                            <div style={{ width: '60%' }}>
                                                <p>{codeData.code}</p>
                                            </div>
                                        </div>
                                        <div className='my-gift-code-row'>
                                            <div style={{ width: '40%' }}>
                                                <p>
                                                    <FormattedMessage id='Value' defaultMessage='Value'></FormattedMessage>
                                                </p>
                                            </div>
                                            <div style={{ width: '60%' }}>
                                                <p>
                                                    <FormattedMessage id={`$${codeData.value}`} defaultMessage={`$${codeData.value}`}></FormattedMessage>
                                                </p>
                                            </div>
                                        </div>
                                        <div className='my-gift-code-row'>
                                            <div style={{ width: '40%' }}>
                                                <p>
                                                    <FormattedMessage id='Expire Date' defaultMessage='Expire Date'></FormattedMessage>
                                                </p>
                                            </div>
                                            <div style={{ width: '60%' }}>
                                                <p>{codeData.expire_date}</p>
                                            </div>
                                        </div>
                                        <div className='my-gift-code-row'>
                                            <div style={{ width: '40%' }}>
                                                <p>
                                                    <FormattedMessage id='Status' defaultMessage='Status'></FormattedMessage>
                                                </p>
                                            </div>
                                            <div style={{ width: '60%' }}>
                                                <p>{codeData.status.label}</p>
                                            </div>
                                        </div>
                                        <div className='my-gift-code-row'>
                                            <div style={{ width: '40%' }}>
                                                <p>
                                                    <FormattedMessage id='Order' defaultMessage='Order'></FormattedMessage>
                                                </p>
                                            </div>
                                            <div style={{ width: '60%' }}>
                                                <a href={`/order-history/${orderGiftCardId.data.customerOrders.items.find(ele => ele.id === codeData.order_id.toString()).increment_id}`}
                                                    style={{ color: '#0058AC', textDecorationLine: 'underline', fontWeight: 'bold' }}>
                                                    <FormattedMessage id={`#${orderGiftCardId.data.customerOrders.items.find(ele => ele.id === codeData.order_id.toString()).increment_id}`}
                                                    defaultMessage={`#${orderGiftCardId.data.customerOrders.items.find(ele => ele.id === codeData.order_id.toString()).increment_id}`}></FormattedMessage>
                                                </a>
                                            </div>
                                        </div>
                                    </div>)}
                                    <div style={{ display: 'flex', flexDirection: 'row', gap: 10, marginTop: 20 }}>
                                        <input className='my-gift-code-details-input' onChange={(e) => setSearchCode(e.target.value)}
                                            value={searchCode}></input>
                                        <button className='my-gift-code-details-submit' onClick={handleSearchCode}>
                                            <FormattedMessage id='Submit' defaultMessage='Submit'></FormattedMessage>
                                        </button>
                                    </div>
                                    {showDetails === false && (<p style={{ color: 'red', marginTop: 10 }}>
                                        <FormattedMessage id={`The gift card code ${errorCode} is not valid.`}
                                        defaultMessage={`The gift card code ${errorCode} is not valid.`}></FormattedMessage>
                                    </p>)}
                                </div>
                            </div>

                            <div className='my-gift-cards-nav'>
                                <div>
                                    <p style={{ marginTop: 8 }}>{listCodeTitle}</p>
                                </div>
                                <div style={{ display: 'flex', flexDirection: 'row', gap: 10 }}>
                                    {renderPageNumber.map((element, index) =>
                                        <button className={pageNumber === index + 1 ? 'my-gift-cards-page-number-selected' : 'my-gift-cards-page-number'}
                                            onClick={() => setPageNumber(index + 1)}>
                                            {index + 1}
                                        </button>)}
                                </div>
                                <div style={{ display: 'flex', flexDirection: 'row' }}>
                                    <p style={{ marginRight: 5, marginTop: 8 }}>
                                        <FormattedMessage id='Show' defaultMessage='Show'></FormattedMessage>
                                    </p>
                                    <select name='value' id='page-size' style={{ width: 40 }} onChange={handlePageSize}>
                                        <option value='10'>{pagePernumber1}</option>
                                        <option value='15'>{pagePernumber2}</option>
                                        <option value='20'>{pagePernumber3}</option>
                                    </select>
                                    <p style={{ marginLeft: 5, marginTop: 8 }}>
                                        <FormattedMessage id='per page' defaultMessage='per page'></FormattedMessage>
                                    </p>
                                </div>
                            </div>

                            <div className='my-gift-cards-info'>
                                <div className='my-gift-cards-header'>
                                    <div className='my-gift-card-code'>
                                        <p style={{ fontWeight: 'bold', fontSize: 16 }}>
                                            <FormattedMessage id='Code' defaultMessage='Code'></FormattedMessage>
                                        </p>
                                    </div>
                                    <div className='my-gift-card-value'>
                                        <p style={{ fontWeight: 'bold' }}>
                                            <FormattedMessage id='Value' defaultMessage='Value'></FormattedMessage>
                                        </p>
                                    </div>
                                    <div className='my-gift-card-expire-date'>
                                        <p style={{ fontWeight: 'bold' }}>
                                            <FormattedMessage id='Expire Date' defaultMessage='Expire Date'></FormattedMessage>
                                        </p>
                                    </div>
                                    <div className='my-gift-card-status'>
                                        <p style={{ fontWeight: 'bold' }}>
                                            <FormattedMessage id='Status' defaultMessage='Status'></FormattedMessage>
                                        </p>
                                    </div>
                                    <div className='my-gift-card-order'>
                                        <p style={{ fontWeight: 'bold' }}>
                                            <FormattedMessage id='Order' defaultMessage='Order'></FormattedMessage>
                                        </p>
                                    </div>
                                </div>
                                {listGiftCodeShow().map((element) => {
                                    return (
                                        <div className='my-gift-cards-info-content'>
                                            <div className='my-gift-card-code'>
                                                <p>
                                                    <FormattedMessage id={`${element.code.slice(0, parseInt(numberCharacterShow))}${replaceHiddenCharacter}`}
                                                    defaultMessage={`${element.code.slice(0, parseInt(numberCharacterShow))}${replaceHiddenCharacter}`}></FormattedMessage>                 
                                                </p>
                                            </div>
                                            <div className='my-gift-card-value'>
                                                <p>
                                                    <FormattedMessage id={`$${element.value}`} defaultMessage={`$${element.value}`}></FormattedMessage>
                                                </p>
                                            </div>
                                            <div className='my-gift-card-expire-date'>
                                                <p>{element.expire_date}</p>
                                            </div>
                                            <div className='my-gift-card-status'>
                                                <p>{element.status.label}</p>
                                            </div>
                                            <div className='my-gift-card-order'>
                                                <a href={`/order-history/${orderGiftCardId.data.customerOrders.items.find(ele => ele.id === element.order_id.toString()).increment_id}`}
                                                    style={{ color: '#0058AC', textDecorationLine: 'underline', fontWeight: 'bold' }}>
                                                    <FormattedMessage id={`#${orderGiftCardId.data.customerOrders.items.find(ele => ele.id === element.order_id.toString()).increment_id}`}
                                                    defaultMessage={`#${orderGiftCardId.data.customerOrders.items.find(ele => ele.id === element.order_id.toString()).increment_id}`}></FormattedMessage>
                                                </a>
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>
                        </div>) : (
                    <div style={{ position: 'relative', width: '94%', marginLeft: '3%' }}>
                        <h1 style={{ fontSize: 24, fontWeight: 'bold', marginTop: 30, marginBottom: 30 }}>
                            <FormattedMessage id='Gift Cards Information' defaultMessage='Gift Cards Information'></FormattedMessage>
                        </h1> 
                        <div style={{ border: '1px solid black', padding: 20 }}>
                            <p className='my-gift-code-title'>
                                <FormattedMessage id='Gift Code Details' defaultMessage='Gift Code Details'></FormattedMessage>
                                </p>
                            <div className='my-gift-code-details'>
                                <div style={{ display: 'flex', flexDirection: 'row', gap: 10, marginTop: 20 }}>
                                    <input className='my-gift-code-details-input' onChange={(e) => setSearchCode(e.target.value)}
                                        value={searchCode}></input>
                                    <button className='my-gift-code-details-submit' onClick={handleSearchCode}>
                                        <FormattedMessage id='Submit' defaultMessage='Submit'></FormattedMessage>
                                    </button> 
                                </div>
                                {showDetails === false && (<p style={{ color: 'red', marginTop: 10 }}>
                                    <FormattedMessage id={`The gift card code ${errorCode} is not valid.`}
                                    defaultMessage={`The gift card code ${errorCode} is not valid.`}></FormattedMessage>
                                </p>)}
                            </div>
                        </div>
                        <div style={{display: 'flex', flexDirection: 'row', gap: 40, 
                        borderBottom: '1px solid lightgray', marginTop: 30}}>
                            <div className='my-gift-card-code'>
                                <p style={{ fontWeight: 'bold', fontSize: 16 }}>
                                    <FormattedMessage id='Code' defaultMessage='Code'></FormattedMessage>
                                </p>
                            </div>
                            <div className='my-gift-card-value'>
                                <p style={{ fontWeight: 'bold' }}>
                                    <FormattedMessage id='Value' defaultMessage='Value'></FormattedMessage>
                                </p>
                            </div>
                            <div className='my-gift-card-expire-date'>
                                <p style={{ fontWeight: 'bold' }}>
                                    <FormattedMessage id='Expire Date' defaultMessage='Expire Date'></FormattedMessage>
                                </p>
                            </div>
                            <div className='my-gift-card-status'>
                                <p style={{ fontWeight: 'bold' }}>
                                    <FormattedMessage id='Status' defaultMessage='Status'></FormattedMessage>
                                </p>
                            </div>
                            <div className='my-gift-card-order'>
                                <p style={{ fontWeight: 'bold' }}>
                                    <FormattedMessage id='Order' defaultMessage='Order'></FormattedMessage>
                                </p>
                            </div>
                        </div>
                    </div>
                )}
                </>
            )}

            {windowWidth > 960 && (<div className='my-gift-cards-wrapper'>
                <LeftMenu label='My Gift Cards'></LeftMenu>
                {orderedGiftCard.length > 0 ? (<div style={{ position: 'relative' }}>
                    <h1 style={{ fontSize: 24, fontWeight: 'bold', marginTop: 10, marginBottom: 30 }}>
                        <FormattedMessage id='Gift Cards Information' defaultMessage='Gift Card Information'></FormattedMessage>
                    </h1>
                    <div style={{ border: '1px solid black', padding: 20 }}>
                        <p className={showDetails ? 'my-gift-code-title-border' : 'my-gift-code-title'}>
                            <FormattedMessage id='Gift Code Details' defaultMessage='Gift Code Details'></FormattedMessage>
                        </p>
                        <div className='my-gift-code-details'>
                            {showDetails && (<div style={{ display: 'flex', flexDirection: 'column' }}>
                                <div className='my-gift-code-row'>
                                    <div style={{ width: '40%' }}>
                                        <p>
                                            <FormattedMessage id='Code' defaultMessage='Code'></FormattedMessage>
                                        </p>
                                    </div>
                                    <div style={{ width: '60%' }}>
                                        <p>{codeData.code}</p>
                                    </div>
                                </div>
                                <div className='my-gift-code-row'>
                                    <div style={{ width: '40%' }}>
                                        <p>
                                            <FormattedMessage id='Value' defaultMessage='Value'></FormattedMessage>
                                        </p>
                                    </div>
                                    <div style={{ width: '60%' }}>
                                        <p>
                                            <FormattedMessage id={`$${codeData.value}`} defaultMessage={`$${codeData.value}`}></FormattedMessage>
                                        </p>
                                    </div>
                                </div>
                                <div className='my-gift-code-row'>
                                    <div style={{ width: '40%' }}>
                                        <p>
                                            <FormattedMessage id='Expire Date' defaultMessage='Expire Date'></FormattedMessage>
                                        </p>
                                    </div>
                                    <div style={{ width: '60%' }}>
                                        <p>{codeData.expire_date}</p>
                                    </div>
                                </div>
                                <div className='my-gift-code-row'>
                                    <div style={{ width: '40%' }}>
                                        <p>
                                            <FormattedMessage id='Status' defaultMessage='Status'></FormattedMessage>
                                        </p>
                                    </div>
                                    <div style={{ width: '60%' }}>
                                        <p>{codeData.status.label}</p>
                                    </div>
                                </div>
                                <div className='my-gift-code-row'>
                                    <div style={{ width: '40%' }}>
                                        <p>
                                            <FormattedMessage id='Order' defaultMessage='Order'></FormattedMessage>
                                        </p>
                                    </div>
                                    <div style={{ width: '60%' }}>
                                        <a href={`/order-history/${orderGiftCardId.data.customerOrders.items.find(ele => ele.id === codeData.order_id.toString()).increment_id}`}
                                            style={{ color: '#0058AC', textDecorationLine: 'underline', fontWeight: 'bold' }}>
                                            <FormattedMessage id={`#${orderGiftCardId.data.customerOrders.items.find(ele => ele.id === codeData.order_id.toString()).increment_id}`}
                                            defaultMessage={`#${orderGiftCardId.data.customerOrders.items.find(ele => ele.id === codeData.order_id.toString()).increment_id}`}></FormattedMessage>
                                        </a>
                                    </div>
                                </div>
                            </div>)}
                            <div style={{ display: 'flex', flexDirection: 'row', gap: 10, marginTop: 20 }}>
                                <input className='my-gift-code-details-input' onChange={(e) => setSearchCode(e.target.value)}
                                    value={searchCode}></input>
                                <button className='my-gift-code-details-submit' onClick={handleSearchCode}>
                                    <FormattedMessage id='Submit' defaultMessage='Submit'></FormattedMessage>
                                </button>
                            </div>
                            {showDetails === false && (<p style={{ color: 'red', marginTop: 10 }}>
                                <FormattedMessage id={`The gift card code ${errorCode} is not valid.`} 
                                defaultMessage={`The gift card code ${errorCode} is not valid.`}></FormattedMessage>
                            </p>)}
                        </div>
                    </div>

                    <div className='my-gift-cards-nav'>
                        <div>
                            <p style={{ marginTop: 8 }}>{listCodeTitle}</p>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'row', gap: 10 }}>
                            {renderPageNumber.map((element, index) =>
                                <button className={pageNumber === index + 1 ? 'my-gift-cards-page-number-selected' : 'my-gift-cards-page-number'}
                                    onClick={() => setPageNumber(index + 1)}>
                                    {index + 1}
                                </button>)}
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'row' }}>
                            <p style={{ marginRight: 5, marginTop: 8 }}>
                                <FormattedMessage id='Show' defaultMessage='Show'></FormattedMessage>
                            </p>
                            <select name='value' id='page-size' style={{ width: 40 }} onChange={handlePageSize}>
                                <option value='10'>{pagePernumber1}</option>
                                <option value='15'>{pagePernumber2}</option>
                                <option value='20'>{pagePernumber3}</option>
                            </select>
                            <p style={{ marginLeft: 5, marginTop: 8 }}>
                                <FormattedMessage id='per page' defaultMessage='per page'></FormattedMessage>
                            </p>
                        </div>
                    </div>

                    <div className='my-gift-cards-info'>
                        <div className='my-gift-cards-header'>
                            <div className='my-gift-card-code'>
                                <p style={{ fontWeight: 'bold', fontSize: 16 }}>
                                    <FormattedMessage id='Code' defaultMessage='Code'></FormattedMessage>
                                </p>
                            </div>
                            <div className='my-gift-card-value'>
                                <p style={{ fontWeight: 'bold' }}>
                                    <FormattedMessage id='Value' defaultMessage='Value'></FormattedMessage>
                                </p>
                            </div>
                            <div className='my-gift-card-expire-date'>
                                <p style={{ fontWeight: 'bold' }}>
                                    <FormattedMessage id='Expire Date' defaultMessage='Expire Date'></FormattedMessage>
                                </p>
                            </div>
                            <div className='my-gift-card-status'>
                                <p style={{ fontWeight: 'bold' }}>
                                    <FormattedMessage id='Status' defaultMessage='Status'></FormattedMessage>
                                </p>
                            </div>
                            <div className='my-gift-card-order'>
                                <p style={{ fontWeight: 'bold' }}>
                                    <FormattedMessage id='Order' defaultMessage='Order'></FormattedMessage>
                                </p>
                            </div>
                        </div>
                        {listGiftCodeShow().map((element) => {
                            return (
                                <div className='my-gift-cards-info-content'>
                                    <div className='my-gift-card-code'>
                                        <p>
                                            <FormattedMessage id={`${element.code.slice(0, parseInt(numberCharacterShow))}${replaceHiddenCharacter}`}
                                            defaultMessage={`${element.code.slice(0, parseInt(numberCharacterShow))}${replaceHiddenCharacter}`}></FormattedMessage>
                                        </p>
                                    </div>
                                    <div className='my-gift-card-value'>
                                        <p>
                                            <FormattedMessage id={`$${element.value}`} defaultMessage={`$${element.value}`}></FormattedMessage>
                                        </p>
                                    </div>
                                    <div className='my-gift-card-expire-date'>
                                        <p>{element.expire_date}</p>
                                    </div>
                                    <div className='my-gift-card-status'>
                                        <p>{element.status.label}</p>
                                    </div>
                                    <div className='my-gift-card-order'>
                                        <a href={`/order-history/${orderGiftCardId.data.customerOrders.items.find(ele => ele.id === element.order_id.toString()).increment_id}`}
                                            style={{ color: '#0058AC', textDecorationLine: 'underline', fontWeight: 'bold' }}>
                                            <FormattedMessage id={`#${orderGiftCardId.data.customerOrders.items.find(ele => ele.id === element.order_id.toString()).increment_id}`}
                                            defaultMessage={`#${orderGiftCardId.data.customerOrders.items.find(ele => ele.id === element.order_id.toString()).increment_id}`}></FormattedMessage>
                                        </a>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </div>) : (
                    <div style={{ position: 'relative' }}>
                        <h1 style={{ fontSize: 24, fontWeight: 'bold', marginTop: 10, marginBottom: 30 }}>
                            <FormattedMessage id='Gift Cards Information' defaultMessage='Gift Cards Information'></FormattedMessage>
                        </h1>
                        <div style={{ border: '1px solid black', padding: 20 }}>
                            <p className='my-gift-code-title'>
                                <FormattedMessage id='Gift Code Details' defaultMessage='Gift Code Details'></FormattedMessage>
                            </p>
                            <div className='my-gift-code-details'>
                                <div style={{ display: 'flex', flexDirection: 'row', gap: 10, marginTop: 20 }}>
                                    <input className='my-gift-code-details-input' onChange={(e) => setSearchCode(e.target.value)}
                                        value={searchCode}></input>
                                    <button className='my-gift-code-details-submit' onClick={handleSearchCode}>
                                        <FormattedMessage id='Submit' defaultMessage='Submit'></FormattedMessage>
                                    </button>
                                </div>
                                {showDetails === false && (<p style={{ color: 'red', marginTop: 10 }}>
                                    <FormattedMessage id={`The gift card code ${errorCode} is not valid.`}
                                    defaultMessage={`The gift card code ${errorCode} is not valid.`}></FormattedMessage>
                                </p>)}
                            </div>
                        </div>
                        <div style={{display: 'flex', flexDirection: 'row', gap: 40, 
                        borderBottom: '1px solid lightgray', marginTop: 30}}>
                            <div className='my-gift-card-code'>
                                <p style={{ fontWeight: 'bold', fontSize: 16 }}>
                                    <FormattedMessage id='Code' defaultMessage='Code'></FormattedMessage>
                                </p>
                            </div>
                            <div className='my-gift-card-value'>
                                <p style={{ fontWeight: 'bold' }}>
                                    <FormattedMessage id='Value' defaultMessage='Code'></FormattedMessage>
                                </p>
                            </div>
                            <div className='my-gift-card-expire-date'>
                                <p style={{ fontWeight: 'bold' }}>
                                    <FormattedMessage id='Expire Date' defaultMessage='Expire Date'></FormattedMessage>
                                </p>
                            </div>
                            <div className='my-gift-card-status'>
                                <p style={{ fontWeight: 'bold' }}>
                                    <FormattedMessage id='Status' defaultMessage='Status'></FormattedMessage>
                                </p>
                            </div>
                            <div className='my-gift-card-order'>
                                <p style={{ fontWeight: 'bold' }}>
                                    <FormattedMessage id='Order' defaultMessage='Order'></FormattedMessage>
                                </p>
                            </div>
                        </div>
                    </div>
                )}
            </div>)}
        </>
    )
}

export default MyGiftCards