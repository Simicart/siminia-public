/*import React, { useState } from "react";
import Header from "./BaseComponents/Header/Header";
import Footer from "./BaseComponents/Footer/Footer";
import { Plus, Minus, ChevronRight, ChevronLeft } from 'react-feather'
import './styles.scss'

const CartPage = () => {
    const [width, setWidth] = useState(window.innerWidth)

    window.addEventListener('resize', () => {
        setWidth(window.innerWidth)
    })

    const testListProducts = [
        {
            image: 'https://d1rlzxa98cyc61.cloudfront.net/catalog/product/cache/6e7def30e90b43ed5e07e10d9f37abec/1/8/180624_2020.jpg',
            url: 'https://www.abenson.com/lg-hs12isg.html',
            name: 'LG HS12ISG',
            chooseOptions: ['Installation Standard Service10ft FREE add 5ft piping'],
            price: 40.748,
            quantity: 1
        },
        {
            image: 'https://d1rlzxa98cyc61.cloudfront.net/catalog/product/cache/6e7def30e90b43ed5e07e10d9f37abec/1/8/187399_2023.jpg',
            url: 'https://www.abenson.com/samsung-galaxy-a34-5g-8gb-128gb-awesome-graphite.html',
            name: 'Samsung Galaxy A34 5G (8GB + 128GB) Awesome Graphite',
            chooseOptions: '',
            price: 19.990,
            quantity: 2
        },
        {
            image: 'https://d1rlzxa98cyc61.cloudfront.net/catalog/product/cache/6e7def30e90b43ed5e07e10d9f37abec/1/8/186818_2023.jpg',
            url: 'https://www.abenson.com/apple-macbook-pro-16-inch-m2-pro-2023-mnw93pp-a.html',
            name: 'Apple MacBook Pro (16-inch, M2 Pro, 2023) MNW93PP/A',
            chooseOptions: '',
            price: 168.990,
            quantity: 3
        }
    ]

    const testListRecommendations = [
        {
            image: 'https://d1rlzxa98cyc61.cloudfront.net/catalog/product/cache/6e7def30e90b43ed5e07e10d9f37abec/1/8/180624_2020.jpg',
            url: 'https://www.abenson.com/lg-hs12isg.html',
            name: 'LG HS12ISG',
            descriptions: '16ft, Indoor/Outdoor Aluminum Ladder,',
            price: 40.748,
            quantity: 1
        },
        {
            image: 'https://d1rlzxa98cyc61.cloudfront.net/catalog/product/cache/6e7def30e90b43ed5e07e10d9f37abec/1/8/187399_2023.jpg',
            url: 'https://www.abenson.com/samsung-galaxy-a34-5g-8gb-128gb-awesome-graphite.html',
            name: 'Samsung Galaxy A34 5G (8GB + 128GB) Awesome Graphite',
            descriptions: '5 Liters, Airpot, Re-boil Function',
            price: 19.990,
            quantity: 2
        },
        {
            image: 'https://d1rlzxa98cyc61.cloudfront.net/catalog/product/cache/6e7def30e90b43ed5e07e10d9f37abec/1/8/186818_2023.jpg',
            url: 'https://www.abenson.com/apple-macbook-pro-16-inch-m2-pro-2023-mnw93pp-a.html',
            name: 'Apple MacBook Pro (16-inch, M2 Pro, 2023) MNW93PP/A',
            descriptions: 'Silicone Case, Navy',
            price: 168.990,
            quantity: 3
        },
        {
            image: 'https://d1rlzxa98cyc61.cloudfront.net/catalog/product/cache/6e7def30e90b43ed5e07e10d9f37abec/1/8/180624_2020.jpg',
            url: 'https://www.abenson.com/lg-hs12isg.html',
            name: 'LG HS12ISG',
            descriptions: 'USB-C 11-in-1 Multiport Dock, 4K UHD Compatible',
            price: 40.748,
            quantity: 1
        },
        {
            image: 'https://d1rlzxa98cyc61.cloudfront.net/catalog/product/cache/6e7def30e90b43ed5e07e10d9f37abec/1/8/187399_2023.jpg',
            url: 'https://www.abenson.com/samsung-galaxy-a34-5g-8gb-128gb-awesome-graphite.html',
            name: 'Samsung Galaxy A34 5G (8GB + 128GB) Awesome Graphite',
            descriptions: 'Steam Flat Iron, Ceramic Soleplate',
            price: 19.990,
            quantity: 2
        },
        {
            image: 'https://d1rlzxa98cyc61.cloudfront.net/catalog/product/cache/6e7def30e90b43ed5e07e10d9f37abec/1/8/186818_2023.jpg',
            url: 'https://www.abenson.com/apple-macbook-pro-16-inch-m2-pro-2023-mnw93pp-a.html',
            name: 'Apple MacBook Pro (16-inch, M2 Pro, 2023) MNW93PP/A',
            descriptions: 'Silicone Case, Cream',
            price: 168.990,
            quantity: 3
        }
    ]

    return (
        <div className="abenson-cart-page">
            <Header></Header>

            <div className='abenson-shopping-cart'>
                <div className='abenson-shopping-cart-header'>
                    <p className='abenson-shopping-cart-header-title'>Shopping Cart</p>
                    <button className='abenson-checkout-button'>
                        <p style={{ margin: 0 }}>Checkout</p>
                        <ChevronRight size={15} style={{ marginTop: 1 }}></ChevronRight>
                    </button>
                </div>
                <div className='abenson-shopping-cart-list-product'>
                    {width > 992 && (<div className='abenson-shopping-cart-list-product-header'>
                        <div style={{ width: '50%' }}>Product Name</div>
                        <div style={{ width: '18%', textAlign: "center" }}>Price</div>
                        <div style={{ width: '14%', textAlign: "center" }}>Quantity</div>
                        <div style={{ width: '18%', textAlign: "center" }}>Total</div>
                    </div>)}
                    {testListProducts.map((element, index) => (
                        width > 992 ? (
                            <div className='abenson-shopping-cart-product'>
                                <div style={{ width: '50%', display: 'flex', flexDirection: 'row' }}>
                                    <div style={{ padding: '10px 10px 10px 0' }}>
                                        <a href={element.url}>
                                            <img src={element.image} alt='' className='abenson-shopping-cart-product-image'></img>
                                        </a>
                                    </div>
                                    <div style={{ marginTop: 20 }}>
                                        <a className='abenson-shopping-cart-product-name' href={element.url}>{element.name}</a>
                                        {element.chooseOptions.length > 0 && element.chooseOptions.map((ele, idx) => <p style={{ color: '#888', fontSize: 13 }}>{ele}</p>)}
                                    </div>
                                </div>

                                <div style={{ width: '18%', textAlign: 'center' }}>
                                    <p className='abenson-shopping-cart-product-price'>&#8369;{`${element.price}`}</p>
                                </div>

                                <div style={{ width: '14%', display: 'flex', flexDirection: 'row', marginTop: 12, justifyContent: 'center' }}>
                                    <button className="abenson-shopping-cart-plus">
                                        <Plus color="#656565" size={18} style={{ marginTop: 5, marginRight: 10 }}></Plus>
                                    </button>
                                    <input defaultValue={element.quantity} style={{ width: 25, height: 25, border: '1px solid #bbb', textAlign: 'center' }}></input>
                                    <button className="abenson-shopping-cart-minus">
                                        <Minus color="#656565" size={18} style={{ marginTop: 5, marginLeft: 10 }}></Minus>
                                    </button>
                                </div>

                                <div style={{ width: '18%', textAlign: 'center' }}>
                                    <p className='abenson-shopping-cart-product-total'>&#8369;{`${element.price * element.quantity}`}</p>
                                    <button className='abenson-shopping-cart-remove-button'>Remove</button>
                                </div>
                            </div>
                        ) : (
                            <div className='abenson-shopping-cart-product-1'>
                                <div style={{ display: 'flex', flexDirection: 'column' }}>
                                    <div style={{ marginTop: 20 }}>
                                        <a className='abenson-shopping-cart-product-name' href={element.url}>{element.name}</a>
                                        {element.chooseOptions.length > 0 && element.chooseOptions.map((ele, idx) => <p style={{ color: '#888', fontSize: 13 }}>{ele}</p>)}
                                    </div>
                                    <div>
                                        <p className='abenson-shopping-cart-product-price'>&#8369;{`${element.price}`}</p>
                                    </div>
                                </div>

                                <div style={{ display: 'flex', flexDirection: 'column' }}>
                                    <div style={{ display: 'flex', flexDirection: 'row', marginTop: 15 }}>
                                        <Plus color="#656565" size={18} style={{ marginTop: 5, marginRight: 10 }}></Plus>
                                        <input defaultValue={element.quantity} style={{ width: 25, height: 25, border: '1px solid #bbb', textAlign: 'center' }}></input>
                                        <Minus color="#656565" size={18} style={{ marginTop: 5, marginLeft: 10 }}></Minus>
                                    </div>

                                    <div style={{ textAlign: 'center' }}>
                                        <p className='abenson-shopping-cart-product-total'>&#8369;{`${element.price * element.quantity}`}</p>
                                        <button className='abenson-shopping-cart-remove-button'>Remove</button>
                                    </div>
                                </div>
                            </div>
                        )
                    ))}
                </div>
                <div className="abenson-price-summary">
                    <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
                        <p style={{ color: '#434343', fontSize: 13 }}>SUBTOTAL</p>
                        <p style={{ color: '#434343', fontSize: 15, fontWeight: 700 }}>&#8369;587.698</p>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
                        <p style={{ color: '#434343', fontSize: 13 }}>TAX</p>
                        <p style={{ color: '#434343', fontSize: 15, fontWeight: 700 }}>&#8369;0</p>
                    </div>
                </div>
                <div className="abenson-order-total">
                    <p style={{ color: '#d30f8b', fontSize: 15, fontWeight: 700 }}>ORDER TOTAL</p>
                    <p style={{ color: '#d30f8b', fontSize: 15, fontWeight: 700 }}>&#8369;587.698</p>
                </div>
                <div className='abenson-nav-button'>
                    {width > 992 ? (
                        <>
                            <button className='abenson-browsing-button'>
                                <ChevronLeft size={15} style={{ marginTop: 1 }}></ChevronLeft>
                                <p style={{ margin: 0 }}>Back to browsing</p>
                            </button>
                            <button className='abenson-checkout-button'>
                                <p style={{ margin: 0 }}>Checkout</p>
                                <ChevronRight size={15} style={{ marginTop: 1 }}></ChevronRight>
                            </button>
                        </>
                    ) : (
                        <>
                            <button className='abenson-checkout-button'>
                                <p style={{ margin: 0 }}>Checkout</p>
                                <ChevronRight size={15} style={{ marginTop: 1 }}></ChevronRight>
                            </button>
                            <button className='abenson-browsing-button'>
                                <ChevronLeft size={15} style={{ marginTop: 1 }}></ChevronLeft>
                                <p style={{ margin: 0 }}>Back to browsing</p>
                            </button>
                        </>
                    )}

                </div>
            </div>

            <div className="abenson-cart-recommendations">
                <div className="abenson-cart-recommendations-title">
                    <p>Cart Recommendations</p>
                </div>
                <div className="abenson-grid-cart-recommendations">
                    {testListRecommendations.map((element, index) => {
                        return (
                            <div className="abenson-grid-item-cart-recommendations">
                                <img src={element.image} alt='' className="abenson-grid-item-image"></img>
                                <p className="abenson-grid-item-name">{element.name}</p>
                                <p className="abenson-grid-item-descriptions">{element.descriptions}</p>
                                <p className="abenson-grid-item-price">&#8369;{`${element.price}`}</p>
                            </div>
                        )
                    })}
                </div>
            </div>

            <Footer></Footer>
        </div>
    )
}

export default CartPage*/