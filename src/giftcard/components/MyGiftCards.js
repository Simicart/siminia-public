import React, { useState } from 'react'
import LeftMenu from '../../simi/App/core/LeftMenu/leftMenu'
import '../styles/styles.scss'
import useOrderedGiftCards from '../talons/useOrderedGiftCards'
import useOrderedGiftCardId from '../talons/useOrderedGiftCardId'

const MyGiftCards = () => {
    const myGiftCards = useOrderedGiftCards()
    const orderGiftCardId = useOrderedGiftCardId()
    const [windowWidth, setWindowWidth] = useState(window.innerWidth)

    if (myGiftCards.loading) return <p>Loading</p>
    if (myGiftCards.error) return <p>{`Error! ${myGiftCards.error.message}`}</p>
    if (orderGiftCardId.loading) return <p>Loading</p>
    if (orderGiftCardId.error) return <p>{`Error! ${orderGiftCardId.error.message}`}</p>

    const orderedGiftCard = myGiftCards.data.bssCustomerGiftCards.filter((element) => {
        let result = false
        for(let i=0; i<orderGiftCardId.data.customerOrders.items.length; i++) {
            if(element.order_id.toString() === orderGiftCardId.data.customerOrders.items[i].id) result = true
        }
        return result
    })

    const onWidthChange = () => {
        setWindowWidth(window.innerWidth)
    }

    window.onresize = onWidthChange

    return (
        <>
            {windowWidth < 767 && (
                <>
                {orderedGiftCard.length > 0 ? (<div style={{ display: 'flex', flexDirection: 'column', marginTop: 20 }}>
                    {orderedGiftCard.map((element, index) => {
                        return (
                            <div className='my-gift-card-details'>
                                <div style={{ paddingLeft: 20, paddingTop: 20, paddingBottom: 5 }}>
                                    <p style={{ fontWeight: 'bold' }}>Code: <span style={{ fontWeight: 400 }}>{element.code}</span></p>
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
                        style={{width: '60%', height: '50%', margin: 'auto'}}></img>
                        <h1 style={{textAlign: 'center', marginTop: 20}}>You don't have any gift card yet.</h1>
                    </div>
                )}
                </>
            )}

            {767 <= windowWidth &&  windowWidth <= 960 && (
                <>
                {orderedGiftCard.length > 0 ? (
                    <div style={{width: '90%', margin: 'auto'}}>
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
                            {orderedGiftCard.map((element, index) => {
                                return (
                                    <div className='my-gift-cards-info-content'>
                                        <div className='my-gift-card-code'>
                                            <p>{element.code}</p>
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
                    <h1 style={{textAlign: 'center', marginTop: 50}}>You don't have any gift card yet.</h1>
                )}
                </>
            )}

            {windowWidth > 960 && (<div className='my-gift-cards-wrapper'>
                <LeftMenu label='My Gift Cards'></LeftMenu>
                {orderedGiftCard.length > 0 ? (<div>
                    <h1 style={{ fontSize: 24, fontWeight: 'bold', marginTop: 10 }}>Gift Cards Information</h1>
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
                        {orderedGiftCard.map((element, index) => {
                            return (
                                <div className='my-gift-cards-info-content'>
                                    <div className='my-gift-card-code'>
                                        <p>{element.code}</p>
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
                    <h1 style={{textAlign: 'center'}}>You don't have any gift card yet.</h1>
                )} 
            </div>)}
        </>
    )
}

export default MyGiftCards