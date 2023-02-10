import React, { useState, useEffect } from 'react'
import LeftMenu from '../../simi/App/core/LeftMenu/leftMenu'
import '../styles/my-gift-cards.css'
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

    const onWidthChange = () => {
        setWindowWidth(window.innerWidth)
    }

    window.onresize = onWidthChange

    return (
        <>
            {windowWidth < 767 && (
                <div style={{ display: 'flex', flexDirection: 'column', marginTop: 20 }}>
                    {myGiftCards.data.bssCustomerGiftCards.map((element, index) => {
                        return (
                            <div className='gift-card-details'>
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
                </div>
            )}

            {767 <= windowWidth &&  windowWidth <= 960 && (
                <>
                    <div style={{marginTop: 50, width: '90%', margin: 'auto'}}>
                        <div className='gift-cards-info-wrapper'>
                            <div className='gift-cards-info-header'>
                                <div className='gift-card-code'>
                                    <p style={{ fontWeight: 'bold', fontSize: 16 }}>Code</p>
                                </div>
                                <div className='gift-card-value'>
                                    <p style={{ fontWeight: 'bold' }}>Value</p>
                                </div>
                                <div className='gift-card-expire-date'>
                                    <p style={{ fontWeight: 'bold' }}>Expire Date</p>
                                </div>
                                <div className='gift-card-status'>
                                    <p style={{ fontWeight: 'bold' }}>Status</p>
                                </div>
                                <div className='gift-card-order'>
                                    <p style={{ fontWeight: 'bold' }}>Order</p>
                                </div>
                            </div>
                            {myGiftCards.data.bssCustomerGiftCards.map((element, index) => {
                                return (
                                    <div className='gift-cards-info-content'>
                                        <div className='gift-card-code'>
                                            <p>{element.code}</p>
                                        </div>
                                        <div className='gift-card-value'>
                                            <p>{`$${element.value}`}</p>
                                        </div>
                                        <div className='gift-card-expire-date'>
                                            <p>{element.expire_date}</p>
                                        </div>
                                        <div className='gift-card-status'>
                                            <p>{element.status.label}</p>
                                        </div>
                                        <div className='gift-card-order'>
                                            <a href={`/order-history/${orderGiftCardId.data.customerOrders.items.find(ele => ele.id === element.order_id.toString()).increment_id}`}
                                                style={{ color: '#0058AC', textDecorationLine: 'underline', fontWeight: 'bold' }}>
                                                {`#${orderGiftCardId.data.customerOrders.items.find(ele => ele.id === element.order_id.toString()).increment_id}`}</a>
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                </>
            )}

            {windowWidth > 960 && (<div className='my-gift-cards-wrapper'>
                <LeftMenu label='My Gift Cards'></LeftMenu>
                <div>
                    <h1 style={{ fontSize: 24, fontWeight: 'bold', marginTop: 10 }}>Gift Cards Information</h1>
                    <div className='gift-cards-info-wrapper'>
                        <div className='gift-cards-info-header'>
                            <div className='gift-card-code'>
                                <p style={{ fontWeight: 'bold', fontSize: 16 }}>Code</p>
                            </div>
                            <div className='gift-card-value'>
                                <p style={{ fontWeight: 'bold' }}>Value</p>
                            </div>
                            <div className='gift-card-expire-date'>
                                <p style={{ fontWeight: 'bold' }}>Expire Date</p>
                            </div>
                            <div className='gift-card-status'>
                                <p style={{ fontWeight: 'bold' }}>Status</p>
                            </div>
                            <div className='gift-card-order'>
                                <p style={{ fontWeight: 'bold' }}>Order</p>
                            </div>
                        </div>
                        {myGiftCards.data.bssCustomerGiftCards.map((element, index) => {
                            return (
                                <div className='gift-cards-info-content'>
                                    <div className='gift-card-code'>
                                        <p>{element.code}</p>
                                    </div>
                                    <div className='gift-card-value'>
                                        <p>{`$${element.value}`}</p>
                                    </div>
                                    <div className='gift-card-expire-date'>
                                        <p>{element.expire_date}</p>
                                    </div>
                                    <div className='gift-card-status'>
                                        <p>{element.status.label}</p>
                                    </div>
                                    <div className='gift-card-order'>
                                        <a href={`/order-history/${orderGiftCardId.data.customerOrders.items.find(ele => ele.id === element.order_id.toString()).increment_id}`}
                                            style={{ color: '#0058AC', textDecorationLine: 'underline', fontWeight: 'bold' }}>
                                            {`#${orderGiftCardId.data.customerOrders.items.find(ele => ele.id === element.order_id.toString()).increment_id}`}</a>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </div>
            </div>)}
        </>
    )
}

export default MyGiftCards