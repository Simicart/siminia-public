import React, { useState } from 'react'
import LeftMenu from '../../simi/App/core/LeftMenu/leftMenu'
import '../styles/styles.scss'
import useStoreConfig from '../talons/useStoreConfig'
import { useOrderedGiftCards } from '../talons/useOrderedGiftCards'
import { useOrderedGiftCardId } from '../talons/useOrderedGiftCardId'
import { fullPageLoadingIndicator } from '@magento/venia-ui/lib/components/LoadingIndicator';

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
    if (giftCardConfig.error) return <p>{`Error! ${giftCardConfig.error.message}`}</p>
    if (myGiftCards.loading) return fullPageLoadingIndicator
    if (myGiftCards.error) return <p>{`Error! ${myGiftCards.error.message}`}</p>
    if (orderGiftCardId.loading) return fullPageLoadingIndicator
    if (orderGiftCardId.error) return <p>{`Error! ${orderGiftCardId.error.message}`}</p>

    const orderedGiftCard = myGiftCards.data.bssCustomerGiftCards.filter((element) => {
        let result = false
        for (let i = 0; i < orderGiftCardId.data.customerOrders.items.length; i++) {
            if (element.order_id.toString() === orderGiftCardId.data.customerOrders.items[i].id) result = true
        }
        return result
    })

    let renderPageNumber = []
    for (let i = 0; i < Math.ceil(orderedGiftCard.length / pageSize); i++) {
        renderPageNumber.push('L95')
    }

    const listGiftCodeShow = () => {
        if (pageNumber !== Math.ceil(orderedGiftCard.length / pageSize)) {
            return orderedGiftCard.slice(pageSize * (pageNumber - 1), pageSize * (pageNumber - 1) + pageSize)
        }
        else return orderedGiftCard.slice(pageSize * (pageNumber - 1), orderedGiftCard.length)
    }

    const start = pageSize * (pageNumber - 1)
    const end = pageSize * (pageNumber - 1) + pageSize
    const listCodeTitle = pageNumber !== Math.ceil(orderedGiftCard.length / pageSize) ? 
    `Items ${start+1} to ${end} of ${orderedGiftCard.length} total` :
    `Items ${start+1} to ${orderedGiftCard.length} of ${orderedGiftCard.length} total`

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
                    <div style={{ border: '1px solid black', padding: 20, marginTop: 30, width: '94%', marginLeft: '3%' }}>
                        <p className={showDetails ? 'my-gift-code-title-border' : 'my-gift-code-title'}>Gift Code Details</p>
                        <div className='my-gift-code-details'>
                            {showDetails && (<div style={{ display: 'flex', flexDirection: 'column' }}>
                                <div className='my-gift-code-row'>
                                    <div style={{ width: '40%' }}>
                                        <p>Code</p>
                                    </div>
                                    <div style={{ width: '60%' }}>
                                        <p>{codeData.code}</p>
                                    </div>
                                </div>
                                <div className='my-gift-code-row'>
                                    <div style={{ width: '40%' }}>
                                        <p>Value</p>
                                    </div>
                                    <div style={{ width: '60%' }}>
                                        <p>{`$${codeData.value}`}</p>
                                    </div>
                                </div>
                                <div className='my-gift-code-row'>
                                    <div style={{ width: '40%' }}>
                                        <p>Expire Date</p>
                                    </div>
                                    <div style={{ width: '60%' }}>
                                        <p>{codeData.expire_date}</p>
                                    </div>
                                </div>
                                <div className='my-gift-code-row'>
                                    <div style={{ width: '40%' }}>
                                        <p>Status</p>
                                    </div>
                                    <div style={{ width: '60%' }}>
                                        <p>{codeData.status.label}</p>
                                    </div>
                                </div>
                            </div>)}
                            <div style={{ display: 'flex', flexDirection: 'row', gap: 10, marginTop: 20 }}>
                                <input className='my-gift-code-details-input' onChange={(e) => setSearchCode(e.target.value)}
                                    value={searchCode}></input>
                                <button className='my-gift-code-details-submit' onClick={handleSearchCode}>Submit</button>
                            </div>
                            {showDetails === false && (<p style={{ color: 'red', marginTop: 10 }}>{`The gift card code ${errorCode} is not valid.`}</p>)}
                        </div>
                    </div>

                    <div className='my-gift-cards-nav'>
                        <div>
                            <p style={{marginTop: 8}}>{listCodeTitle}</p>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'row', gap: 10}}>
                            {renderPageNumber.map((element, index) =>
                                <button className={pageNumber === index + 1 ? 'my-gift-cards-page-number-selected' : 'my-gift-cards-page-number'}
                                    onClick={() => setPageNumber(index + 1)}>
                                    {index + 1}
                                </button>)}
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'row' }}>
                            <p style={{ marginRight: 5, marginTop: 8 }}>Show</p>
                            <select name='value' id='page-size' style={{ width: 40 }} onChange={handlePageSize}>
                                <option value='10'>10</option>
                                <option value='15'>15</option>
                                <option value='20'>20</option>
                            </select>
                            <p style={{ marginLeft: 5, marginTop: 8 }}>per page</p>
                        </div>
                    </div>
                    {orderedGiftCard.length > 0 ? (<div style={{ display: 'flex', flexDirection: 'column', marginTop: 20 }}>
                        {orderedGiftCard.map((element, index) => {
                            return (
                                <div className='my-gift-card-details'>
                                    <div style={{ paddingLeft: 20, paddingTop: 20, paddingBottom: 5 }}>
                                        <p style={{ fontWeight: 'bold' }}>Code: <span style={{ fontWeight: 400 }}>{`${element.code.slice(0, parseInt(numberCharacterShow))}${replaceHiddenCharacter}`}</span></p>
                                    </div>
                                    <div style={{ paddingLeft: 20, paddingTop: 5, paddingBottom: 5 }}>
                                        <p style={{ fontWeight: 'bold' }}>Value: <span style={{ fontWeight: 400 }}>{`$${element.value}`}</span></p>
                                    </div>
                                    <div style={{ paddingLeft: 20, paddingTop: 5, paddingBottom: 5 }}>
                                        <p style={{ fontWeight: 'bold' }}>Expire Date: <span style={{ fontWeight: 400 }}>{element.expire_date}</span></p>
                                    </div>
                                    <div style={{ paddingLeft: 20, paddingTop: 5, paddingBottom: 5 }}>
                                        <p style={{ fontWeight: 'bold' }}>Status: <span style={{ fontWeight: 400 }}>{element.status.label}</span></p>
                                    </div>
                                    <div style={{ paddingLeft: 20, paddingTop: 5, paddingBottom: 20 }}>
                                        <p style={{ fontWeight: 'bold' }}>
                                            Order: <a href={`/order-history/${orderGiftCardId.data.customerOrders.items.find(ele => ele.id === element.order_id.toString()).increment_id}`}
                                                style={{ color: '#0058AC', textDecorationLine: 'underline', fontWeight: 'bold' }}>
                                                {`#${orderGiftCardId.data.customerOrders.items.find(ele => ele.id === element.order_id.toString()).increment_id}`}</a>
                                        </p>
                                    </div>
                                </div>
                            )
                        })}
                    </div>) : (
                        <div>
                            <img src='https://laposadamilagro.com/wp-content/uploads/2020/04/giftcard.png'
                                style={{ width: '60%', height: '50%', margin: 'auto' }}></img>
                            <h1 style={{ textAlign: 'center', marginTop: 20 }}>You don't have any gift card yet.</h1>
                        </div>
                    )}
                </>
            )}

            {767 <= windowWidth && windowWidth <= 960 && (
                <>
                    {orderedGiftCard.length > 0 ? (
                        <div style={{ width: '90%', margin: 'auto' }}>
                            <div style={{ border: '1px solid black', padding: 20, marginTop: 30 }}>
                                <p className={showDetails ? 'my-gift-code-title-border' : 'my-gift-code-title'}>Gift Code Details</p>
                                <div className='my-gift-code-details'>
                                    {showDetails && (<div style={{ display: 'flex', flexDirection: 'column' }}>
                                        <div className='my-gift-code-row'>
                                            <div style={{ width: '40%' }}>
                                                <p>Code</p>
                                            </div>
                                            <div style={{ width: '60%' }}>
                                                <p>{codeData.code}</p>
                                            </div>
                                        </div>
                                        <div className='my-gift-code-row'>
                                            <div style={{ width: '40%' }}>
                                                <p>Value</p>
                                            </div>
                                            <div style={{ width: '60%' }}>
                                                <p>{`$${codeData.value}`}</p>
                                            </div>
                                        </div>
                                        <div className='my-gift-code-row'>
                                            <div style={{ width: '40%' }}>
                                                <p>Expire Date</p>
                                            </div>
                                            <div style={{ width: '60%' }}>
                                                <p>{codeData.expire_date}</p>
                                            </div>
                                        </div>
                                        <div className='my-gift-code-row'>
                                            <div style={{ width: '40%' }}>
                                                <p>Status</p>
                                            </div>
                                            <div style={{ width: '60%' }}>
                                                <p>{codeData.status.label}</p>
                                            </div>
                                        </div>
                                    </div>)}
                                    <div style={{ display: 'flex', flexDirection: 'row', gap: 10, marginTop: 20 }}>
                                        <input className='my-gift-code-details-input' onChange={(e) => setSearchCode(e.target.value)}
                                            value={searchCode}></input>
                                        <button className='my-gift-code-details-submit' onClick={handleSearchCode}>Submit</button>
                                    </div>
                                    {showDetails === false && (<p style={{ color: 'red', marginTop: 10 }}>{`The gift card code ${errorCode} is not valid.`}</p>)}
                                </div>
                            </div>

                            <div className='my-gift-cards-nav'>
                                <div>
                                    <p style={{marginTop: 8}}>{listCodeTitle}</p>
                                </div>
                                <div style={{ display: 'flex', flexDirection: 'row', gap: 10 }}>
                                    {renderPageNumber.map((element, index) =>
                                        <button className={pageNumber === index + 1 ? 'my-gift-cards-page-number-selected' : 'my-gift-cards-page-number'}
                                            onClick={() => setPageNumber(index + 1)}>
                                            {index + 1}
                                        </button>)}
                                </div>
                                <div style={{ display: 'flex', flexDirection: 'row' }}>
                                    <p style={{ marginRight: 5, marginTop: 8 }}>Show</p>
                                    <select name='value' id='page-size' style={{ width: 40 }} onChange={handlePageSize}>
                                        <option value='10'>10</option>
                                        <option value='15'>15</option>
                                        <option value='20'>20</option>
                                    </select>
                                    <p style={{ marginLeft: 5, marginTop: 8 }}>per page</p>
                                </div>
                            </div>

                            <div className='my-gift-cards-info'>
                                <div className='my-gift-cards-header'>
                                    <div className='my-gift-card-code'>
                                        <p style={{ fontWeight: 'bold', fontSize: 16 }}>Code</p>
                                    </div>
                                    <div className='my-gift-card-value'>
                                        <p style={{ fontWeight: 'bold' }}>Value</p>
                                    </div>
                                    <div className='my-gift-card-expire-date'>
                                        <p style={{ fontWeight: 'bold' }}>Expire Date</p>
                                    </div>
                                    <div className='my-gift-card-status'>
                                        <p style={{ fontWeight: 'bold' }}>Status</p>
                                    </div>
                                    <div className='my-gift-card-order'>
                                        <p style={{ fontWeight: 'bold' }}>Order</p>
                                    </div>
                                </div>
                                {listGiftCodeShow().map((element, index) => {
                                    return (
                                        <div className='my-gift-cards-info-content'>
                                            <div className='my-gift-card-code'>
                                                <p>{`${element.code.slice(0, parseInt(numberCharacterShow))}${replaceHiddenCharacter}`}</p>
                                            </div>
                                            <div className='my-gift-card-value'>
                                                <p>{`$${element.value}`}</p>
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
                                                    {`#${orderGiftCardId.data.customerOrders.items.find(ele => ele.id === element.order_id.toString()).increment_id}`}</a>
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>
                        </div>) : (
                        <h1 style={{ textAlign: 'center', marginTop: 50 }}>You don't have any gift card yet.</h1>
                    )}
                </>
            )}

            {windowWidth > 960 && (<div className='my-gift-cards-wrapper'>
                <LeftMenu label='My Gift Cards'></LeftMenu>
                {orderedGiftCard.length > 0 ? (<div style={{ position: 'relative' }}>
                    <h1 style={{ fontSize: 24, fontWeight: 'bold', marginTop: 10, marginBottom: 30 }}>Gift Cards Information</h1>
                    <div style={{ border: '1px solid black', padding: 20 }}>
                        <p className={showDetails ? 'my-gift-code-title-border' : 'my-gift-code-title'}>Gift Code Details</p>
                        <div className='my-gift-code-details'>
                            {showDetails && (<div style={{ display: 'flex', flexDirection: 'column' }}>
                                <div className='my-gift-code-row'>
                                    <div style={{ width: '40%' }}>
                                        <p>Code</p>
                                    </div>
                                    <div style={{ width: '60%' }}>
                                        <p>{codeData.code}</p>
                                    </div>
                                </div>
                                <div className='my-gift-code-row'>
                                    <div style={{ width: '40%' }}>
                                        <p>Value</p>
                                    </div>
                                    <div style={{ width: '60%' }}>
                                        <p>{`$${codeData.value}`}</p>
                                    </div>
                                </div>
                                <div className='my-gift-code-row'>
                                    <div style={{ width: '40%' }}>
                                        <p>Expire Date</p>
                                    </div>
                                    <div style={{ width: '60%' }}>
                                        <p>{codeData.expire_date}</p>
                                    </div>
                                </div>
                                <div className='my-gift-code-row'>
                                    <div style={{ width: '40%' }}>
                                        <p>Status</p>
                                    </div>
                                    <div style={{ width: '60%' }}>
                                        <p>{codeData.status.label}</p>
                                    </div>
                                </div>
                            </div>)}
                            <div style={{ display: 'flex', flexDirection: 'row', gap: 10, marginTop: 20 }}>
                                <input className='my-gift-code-details-input' onChange={(e) => setSearchCode(e.target.value)}
                                    value={searchCode}></input>
                                <button className='my-gift-code-details-submit' onClick={handleSearchCode}>Submit</button>
                            </div>
                            {showDetails === false && (<p style={{ color: 'red', marginTop: 10 }}>{`The gift card code ${errorCode} is not valid.`}</p>)}
                        </div>
                    </div>

                    <div className='my-gift-cards-nav'>
                        <div>
                            <p style={{marginTop: 8}}>{listCodeTitle}</p>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'row', gap: 10 }}>
                            {renderPageNumber.map((element, index) =>
                                <button className={pageNumber === index + 1 ? 'my-gift-cards-page-number-selected' : 'my-gift-cards-page-number'}
                                    onClick={() => setPageNumber(index + 1)}>
                                    {index + 1}
                                </button>)}
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'row' }}>
                            <p style={{ marginRight: 5, marginTop: 8 }}>Show</p>
                            <select name='value' id='page-size' style={{ width: 40 }} onChange={handlePageSize}>
                                <option value='10'>10</option>
                                <option value='15'>15</option>
                                <option value='20'>20</option>
                            </select>
                            <p style={{ marginLeft: 5, marginTop: 8 }}>per page</p>
                        </div>
                    </div>

                    <div className='my-gift-cards-info'>
                        <div className='my-gift-cards-header'>
                            <div className='my-gift-card-code'>
                                <p style={{ fontWeight: 'bold', fontSize: 16 }}>Code</p>
                            </div>
                            <div className='my-gift-card-value'>
                                <p style={{ fontWeight: 'bold' }}>Value</p>
                            </div>
                            <div className='my-gift-card-expire-date'>
                                <p style={{ fontWeight: 'bold' }}>Expire Date</p>
                            </div>
                            <div className='my-gift-card-status'>
                                <p style={{ fontWeight: 'bold' }}>Status</p>
                            </div>
                            <div className='my-gift-card-order'>
                                <p style={{ fontWeight: 'bold' }}>Order</p>
                            </div>
                        </div>
                        {listGiftCodeShow().map((element, index) => {
                            return (
                                <div className='my-gift-cards-info-content'>
                                    <div className='my-gift-card-code'>
                                        <p>{`${element.code.slice(0, parseInt(numberCharacterShow))}${replaceHiddenCharacter}`}</p>
                                    </div>
                                    <div className='my-gift-card-value'>
                                        <p>{`$${element.value}`}</p>
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
                                            {`#${orderGiftCardId.data.customerOrders.items.find(ele => ele.id === element.order_id.toString()).increment_id}`}</a>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </div>) : (
                    <h1 style={{ textAlign: 'center' }}>You don't have any gift card yet.</h1>
                )}
            </div>)}
        </>
    )
}

export default MyGiftCards