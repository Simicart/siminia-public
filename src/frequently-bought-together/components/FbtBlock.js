import React, { useState } from "react"
import { useHistory } from 'react-router-dom'
import { useMutation } from "@apollo/client"
import useConfigFBT from "../talons/useConfigFBT"
import useProductData from "../talons/useProductData"
import FbtPopUp from './FbtPopUp.js'
import FbtPopUpConfigurable from "./FbtPopUpConfigurable"
import { fullPageLoadingIndicator } from "@magento/venia-ui/lib/components/LoadingIndicator"
import TinySlider from 'tiny-slider-react';
import 'tiny-slider/dist/tiny-slider.css';
import { ChevronLeft, ChevronRight } from "react-feather";
import { StaticRate } from '../../simi/BaseComponents/Rate'
import ADD_PRODUCTS_TO_CART from "../talons/useAddProductsToCart"
import ADD_PRODUCTS_TO_WISHLIST from "../talons/useAddProductsToWishlist"
import '../styles/styles.scss'

const FbtBlock = ({ product, relatedProducts, upsellProducts, crosssellProducts }) => {
    const sku = product.sku
    const history = useHistory()
    const [briefInfoData, setBriefInfoData] = useState([])
    const [openPopUp, setOpenPopUp] = useState(false)
    const [openPopUpConfigurable, setOpenPopUpConfigurable] = useState(false)
    const [openModal, setOpenModal] = useState(false)
    const [openModalConfigurable, setOpenModalConfigurable] = useState(false)
    const [popUpType, setPopUpType] = useState('')
    const [addCartData, setAddCartData] = useState()
    const [configurableProduct, setConfigurableProduct] = useState([])

    const [
        addProductsToCart,
        { data, loading, error }
    ] = useMutation(ADD_PRODUCTS_TO_CART, {
        onCompleted: data => {
            setAddCartData(data)
            setOpenModal(true)
            setOpenPopUp(true)
        }
    });

    const [
        addProductsToWishlist,
        { data: wishlistData, loading: wishlistLoading, error: wishlistError }
    ] = useMutation(ADD_PRODUCTS_TO_WISHLIST, {
        onCompleted: wishlistData => {
            history.push('/wishlist')
        }
    });

    const configFBT = useConfigFBT()
    if (configFBT.loading) return fullPageLoadingIndicator
    if (configFBT.error) return <p>{configFBT.error.message}</p>

    /*const fbtData = useProductData(sku)
    if (fbtData.loading) return fullPageLoadingIndicator
    if (fbtData.error) return <p>{fbtData.error.message}</p>*/

    const FBT_Config_Data = configFBT.data.GetConfigFBT
    console.log(FBT_Config_Data)
    /*const fbtProducts = fbtData.data.product.items[0].fbt_product_data
    console.log(fbtProducts)*/

    if (FBT_Config_Data.show_curent_product === '1') {
        relatedProducts = [product, ...relatedProducts]
        upsellProducts = [product, ...upsellProducts]
        crosssellProducts = [product, ...crosssellProducts]
        //fbtProducts = [product, ...fbtProducts]
    }

    const sortItemType = () => {
        if (FBT_Config_Data.sort_item_type[7] !== '4') {
            if (FBT_Config_Data.sort_item_type[7] === '0') {
                return relatedProducts.length > FBT_Config_Data.limit_products
                    ? relatedProducts.slice(0, FBT_Config_Data.limit_products) : relatedProducts
            }
            if (FBT_Config_Data.sort_item_type[7] === '1') {
                return upsellProducts.length > FBT_Config_Data.limit_products
                    ? upsellProducts.slice(0, FBT_Config_Data.limit_products) : upsellProducts
            }
            if (FBT_Config_Data.sort_item_type[7] === '2') {
                return crosssellProducts.length > FBT_Config_Data.limit_products
                    ? crosssellProducts.slice(0, FBT_Config_Data.limit_products) : crosssellProducts
            }
            /*if (FBT_Config_Data.sort_item_type[7] === '3') {
                return fbtProducts.length > FBT_Config_Data.limit_products
                    ? fbtProducts.slice(0, FBT_Config_Data.limit_products) : fbtProducts
            }*/
        }
        else {
            if (FBT_Config_Data.sort_item_type[16] === '0') {
                return relatedProducts.length > FBT_Config_Data.limit_products
                    ? relatedProducts.slice(0, FBT_Config_Data.limit_products) : relatedProducts
            }
            if (FBT_Config_Data.sort_item_type[16] === '1') {
                return upsellProducts.length > FBT_Config_Data.limit_products
                    ? upsellProducts.slice(0, FBT_Config_Data.limit_products) : upsellProducts
            }
            if (FBT_Config_Data.sort_item_type[16] === '2') {
                return crosssellProducts.length > FBT_Config_Data.limit_products
                    ? crosssellProducts.slice(0, FBT_Config_Data.limit_products) : crosssellProducts
            }
            /*if (FBT_Config_Data.sort_item_type[16] === '3') {
                return fbtProducts.length > FBT_Config_Data.limit_products
                    ? fbtProducts.slice(0, FBT_Config_Data.limit_products) : fbtProducts
            }*/
        }
    }

    const FBT_Slider_Data = sortItemType()

    const FBT_Brief_Data = FBT_Slider_Data.filter((element, index) => briefInfoData[index]?.isChecked === true)

    const renderBriefInfoData = briefInfoData.filter((element, index) => element?.isChecked === true)

    const initListProductStatus = []
    for (let i = 0; i < FBT_Slider_Data.length; i++) {
        initListProductStatus[i] = {
            index: i,
            quantity: 1,
            isChecked: false
        }
    }

    const imgStyles = {
        width: "100%",
        height: '100%',
        objectFit: "ratio",
        cursor: 'pointer',
        padding: 20
    };

    const settings = {
        nav: true,
        gutter: 20,
        rewind: true,
        lazyload: true,
        mouseDrag: true,
        items: parseInt(FBT_Config_Data.item_on_slide),
        autoplay: Boolean(FBT_Config_Data.slide_auto),
        autoplayText: ['', ''],
        speed: parseInt(FBT_Config_Data.slide_speed),
        controlText: ['', ''],
        prevButton: '.fbt-slider-prev',
        nextButton: '.fbt-slider-next',
        responsive: {
            0: {
                items: parseInt(FBT_Config_Data.item_on_slide) > 2 ? 2 : parseInt(FBT_Config_Data.item_on_slide)
            },
            540: {
                items: parseInt(FBT_Config_Data.item_on_slide) > 3 ? 3 : parseInt(FBT_Config_Data.item_on_slide)
            },
            1020: {
                items: parseInt(FBT_Config_Data.item_on_slide)
            }
        }
    };

    const handleQuantity = (e, index) => {
        const tmp = briefInfoData.length > 0 ? briefInfoData.slice(0) : initListProductStatus.slice()
        tmp[index] = {
            index: index,
            quantity: parseInt(e.target.value),
            isChecked: document.getElementById(`fbt-quantity-checkbox-${index}`).checked
        }
        setBriefInfoData(tmp)
    }

    const handleSelectAll = (e) => {
        for (let i = 0; i < FBT_Slider_Data.length; i++) {
            const element = document.getElementById(`fbt-quantity-checkbox-${i}`)
            element.checked = e.target.checked
        }
        const tmp = briefInfoData.length > 0 ? briefInfoData.slice(0) : initListProductStatus.slice()
        for (let i = 0; i < tmp.length; i++) {
            tmp[i] = {
                index: i,
                quantity: document.getElementById(`fbt-quantity-${i}`).value ?
                    parseInt(document.getElementById(`fbt-quantity-${i}`).value) :
                    parseInt(document.getElementById(`fbt-quantity-${i}`).defaultValue),
                isChecked: e.target.checked
            }
        }
        setBriefInfoData(tmp)
    }

    const handleSelectSingle = (e, index) => {
        const tmp = briefInfoData.length > 0 ? briefInfoData.slice(0) : initListProductStatus.slice()
        tmp[index] = {
            index: index,
            quantity: document.getElementById(`fbt-quantity-${index}`).value ?
                parseInt(document.getElementById(`fbt-quantity-${index}`).value) :
                parseInt(document.getElementById(`fbt-quantity-${index}`).defaultValue),
            isChecked: e.target.checked
        }
        setBriefInfoData(tmp)
    }

    const handleAddProductToCart = (element, index) => {
        const cart_id = JSON.parse(
            localStorage.getItem('M2_VENIA_BROWSER_PERSISTENCE__cartId')
        ).value;
        if (FBT_Config_Data.display_list === '0' && FBT_Slider_Data[index].__typename === 'ConfigurableProduct') {
            setConfigurableProduct([FBT_Slider_Data[index]])
            addProductsToCart({
                variables: {
                    cartId: cart_id.slice(1, cart_id.length - 1),
                    cartItems: [{
                        sku: element.sku,
                        quantity: document.getElementById(`fbt-quantity-${index}`).value ?
                            parseInt(document.getElementById(`fbt-quantity-${index}`).value) :
                            parseInt(document.getElementById(`fbt-quantity-${index}`).defaultValue)
                    }]
                }
            })
            setPopUpType('add cart')
        }
        if (FBT_Config_Data.display_list === '0' && FBT_Slider_Data[index].__typename !== 'ConfigurableProduct') {
            setConfigurableProduct([])
            addProductsToCart({
                variables: {
                    cartId: cart_id.slice(1, cart_id.length - 1),
                    cartItems: [{
                        sku: element.sku,
                        quantity: document.getElementById(`fbt-quantity-${index}`).value ?
                            parseInt(document.getElementById(`fbt-quantity-${index}`).value) :
                            parseInt(document.getElementById(`fbt-quantity-${index}`).defaultValue)
                    }]
                }
            })
            setPopUpType('add cart')
        }
    }

    const handleAddAllProductsToCart = () => {
        const cart_id = JSON.parse(
            localStorage.getItem('M2_VENIA_BROWSER_PERSISTENCE__cartId')
        ).value;

        const listSimpleProducts = []
        const listConfigurableProducts = []

        for (let i = 0; i < FBT_Brief_Data.length; i++) {
            if (FBT_Brief_Data[i].__typename === 'SimpleProduct') {
                listSimpleProducts.push({
                    sku: FBT_Brief_Data[i].sku,
                    quantity: briefInfoData[i].quantity
                })
            }
            if (FBT_Brief_Data[i].__typename === 'ConfigurableProduct') {
                listConfigurableProducts.push(FBT_Brief_Data[i])
            }
        }

        if (listSimpleProducts.length > 0) {
            setConfigurableProduct(listConfigurableProducts)
            addProductsToCart({
                variables: {
                    cartId: cart_id.slice(1, cart_id.length - 1),
                    cartItems: listSimpleProducts
                }
            })
            setPopUpType('add all cart')
        }

        else {
            setConfigurableProduct(listConfigurableProducts)
            setPopUpType('add all cart')
            setOpenModal(true)
            setOpenPopUp(true)
        }
    }

    const handleAddAllProductsToWishlist = () => {
        const listProducts = []
        for (let i = 0; i < FBT_Brief_Data.length; i++) {
            listProducts.push({
                sku: FBT_Brief_Data[i].sku,
                quantity: briefInfoData[i].quantity
            })
        }
        if (listProducts.length > 0) {
            addProductsToWishlist({
                variables: {
                    wishlistId: 0,
                    wishlistItems: listProducts
                }
            })
        }
    }


    if (FBT_Config_Data.active_countdown === '1' && openPopUp === true) {
        setTimeout(() => {
            setOpenModal(false)
        }, parseInt(FBT_Config_Data.countdown_time) * 1000 + 500)
    }

    if (FBT_Config_Data.active_countdown === '2' && openPopUp === true) {
        setTimeout(() => {
            setOpenModal(false)
        }, parseInt(FBT_Config_Data.countdown_time) * 1000)
    }

    return (
        <>
            {(loading || wishlistLoading) && (<div className="fbt-loading-indicator">
                {fullPageLoadingIndicator}
            </div>)}
            {FBT_Config_Data.active === '1' && (
                <div className="fbt-wrapper">
                    <div className="fbt-header">
                        <p style={{ fontSize: 22, fontWeight: 'bold' }}>{FBT_Config_Data.title_of_list}</p>
                        <div className="fbt-slider-button">
                            <button className="fbt-slider-prev">
                                <ChevronLeft size={16} />
                            </button>
                            <button className="fbt-slider-next">
                                <ChevronRight size={16} />
                            </button>
                        </div>
                    </div>

                    {FBT_Config_Data.display_list === '0' ? (
                        <>
                            <TinySlider settings={settings}>
                                {FBT_Slider_Data.map((element, index) => (
                                    <div key={index} className={index === 0 ? 'fbt-slider-first' : (index === FBT_Slider_Data.length ? 'fbt-slider-last' : 'fbt-slider')}>
                                        {FBT_Config_Data.preview === '1' && (<img
                                            className={`tns-lazy-img`}
                                            src={index === 0 ? element.small_image : element.small_image.url}
                                            data-src={index === 0 ? element.small_image : element.small_image.url}
                                            style={imgStyles}
                                            onClick={() => history.push(`/${element.url_key}.html`)}
                                        />)}
                                        {FBT_Config_Data.show_review === '1' && (
                                            <div className='fbt-review-wrapper'>
                                                <StaticRate rate={element.rating_summary}></StaticRate>
                                                <button className='fbt-product-review' onClick={() => history.push({
                                                    pathname: `/${element.url_key}.html`,
                                                    state: {
                                                        autofocus: 'review'
                                                    }
                                                })}>
                                                    {(element.review_count !== 0 && element.review_count > 1) ? `(${element.review_count} Reviews)` : '(1 Review)'}
                                                </button>
                                            </div>
                                        )}
                                        <a className='fbt-product-name' dangerouslySetInnerHTML={{ __html: element.name }}
                                            href={`/${element.url_key}.html`}></a>
                                        {FBT_Config_Data.show_price === '1' && element.__typename === 'ConfigurableProduct' && (<p style={{ fontWeight: 'bold', fontSize: 16 }}>{`As low as $${element.price.regularPrice.amount.value.toFixed(2)}`}</p>)}
                                        {FBT_Config_Data.show_price === '1' && element.__typename !== 'ConfigurableProduct' && (<p style={{ fontWeight: 'bold', fontSize: 16 }}>{`$${element.price.regularPrice.amount.value.toFixed(2)}`}</p>)}
                                        {FBT_Config_Data.display_list === '0' && (
                                            <div style={{ display: 'flex', flexDirection: 'column', marginTop: 20 }}>
                                                <div className='fbt-input-wrapper'>
                                                    <input type='checkbox' onChange={(e) => handleSelectSingle(e, index)}
                                                        id={`fbt-quantity-checkbox-${index}`}></input>
                                                    <input style={{ height: 30, width: 60, padding: 10 }} id={`fbt-quantity-${index}`}
                                                        defaultValue={1} placeholder={0} onChange={(e) => handleQuantity(e, index)}></input>
                                                </div>
                                                {FBT_Config_Data.sng_cart === '1' && (<button className='fbt-add-cart-button' 
                                                onClick={() => handleAddProductToCart(element, index)}>Add to cart</button>)}
                                            </div>)}
                                    </div>
                                ))}
                            </TinySlider>

                            <div className='fbt-brief-info'>
                                {renderBriefInfoData.length > 0 && (
                                    <>
                                        <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
                                            <p style={{ fontSize: 16, fontWeight: 'bold', width: '60%' }}>Products Name</p>
                                            <p style={{ fontSize: 16, fontWeight: 'bold', width: '10%' }}>Qty</p>
                                            <p style={{ fontSize: 16, fontWeight: 'bold', width: '30%' }}>Unit Price</p>
                                        </div>
                                        {FBT_Brief_Data.map((element, index) => {
                                            return (
                                                <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
                                                    <p style={{ fontSize: 16, width: '60%' }} dangerouslySetInnerHTML={{ __html: element.name }}></p>
                                                    <p style={{ fontSize: 16, width: '10%' }}>{renderBriefInfoData[index].quantity}</p>
                                                    <p style={{ fontSize: 16, width: '30%' }}>{`$${element.price.regularPrice.amount.value.toFixed(2)}`}</p>
                                                </div>
                                            )
                                        })}
                                    </>
                                )}
                                <div style={{ display: 'flex', flexDirection: 'row', gap: 5 }}>
                                    <input type='checkbox' onChange={handleSelectAll}></input>
                                    <p style={{ fontSize: 16 }}>Select all products</p>
                                </div>
                            </div>
                        </>) : (
                        <>
                            <TinySlider settings={settings}>
                                {FBT_Brief_Data.map((element, index) => (
                                    <div key={index} className={index === 0 ? 'fbt-slider-first' : (index === FBT_Brief_Data.length ? 'fbt-slider-last' : 'fbt-slider')}>
                                        <img
                                            className={`tns-lazy-img`}
                                            src={element.small_image.url ? element.small_image.url : element.small_image}
                                            data-src={element.small_image.url ? element.small_image.url : element.small_image}
                                            alt=""
                                            style={imgStyles}
                                            onClick={() => history.push(`/${element.url_key}.html`)}
                                        />
                                        {FBT_Config_Data.show_review === '1' && (
                                            <div className="fbt-review-wrapper">
                                                <StaticRate rate={element.rating_summary}></StaticRate>
                                                <button className='fbt-product-review' onClick={() => history.push({
                                                    pathname: `/${element.url_key}.html`,
                                                    state: {
                                                        autofocus: 'review'
                                                    }
                                                })}>
                                                    {(element.review_count !== 0 && element.review_count > 1) ? `(${element.review_count} Reviews)` : '(1 Review)'}
                                                </button>
                                            </div>
                                        )}
                                        <a className='fbt-product-name' dangerouslySetInnerHTML={{ __html: element.name }}
                                            href={`/${element.url_key}.html`}></a>
                                        {FBT_Config_Data.show_price === '1' && <p style={{ fontWeight: 'bold', fontSize: 16 }}>{`$${element.price.regularPrice.amount.value.toFixed(2)}`}</p>}
                                    </div>
                                ))}
                            </TinySlider>

                            <div className="fbt-brieft-info">
                                {FBT_Slider_Data.length > 0 && (
                                    <>
                                        <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', gap: 25 }}>
                                            <input type='checkbox' style={{ width: '2%' }} onChange={handleSelectAll}></input>
                                            <p style={{ fontSize: 16, fontWeight: 'bold', width: '60%' }}>Products Name</p>
                                            <p style={{ fontSize: 16, fontWeight: 'bold', width: '8%' }}>Qty</p>
                                            <p style={{ fontSize: 16, fontWeight: 'bold', width: '30%' }}>Unit Price</p>
                                        </div>
                                        {FBT_Slider_Data.map((element, index) => {
                                            return (
                                                <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', gap: 25 }}>
                                                    <input type='checkbox' style={{ width: '2%' }} id={`fbt-quantity-checkbox-${index}`}
                                                        onChange={(e) => handleSelectSingle(e, index)}></input>
                                                    <p style={{ fontSize: 16, width: '60%' }} dangerouslySetInnerHTML={{ __html: element.name }}></p>
                                                    <input style={{ height: 30, width: '8%', padding: 10 }} defaultValue={1} placeholder={0}
                                                        id={`fbt-quantity-${index}`} onChange={(e) => handleQuantity(e, index)}></input>
                                                    <p style={{ fontSize: 16, width: '30%' }}>{`$${element.price.regularPrice.amount.value.toFixed(2)}`}</p>
                                                </div>
                                            )
                                        })}
                                    </>
                                )}
                            </div>
                        </>)}

                    {FBT_Config_Data.btn_cart === '1' && (<button style={{
                        backgroundColor: `#${FBT_Config_Data.btn_cart_bg}`, color: `#${FBT_Config_Data.btn_cart_cl}`,
                        margin: '20px 0', padding: '10px 20px', width: 'max-content', fontWeight: 'bold'
                    }} onClick={handleAddAllProductsToCart}>
                        {FBT_Config_Data.btn_text_cart}</button>)}
                    {FBT_Config_Data.btn_wishlist === '1' && (<button style={{
                        backgroundColor: `#${FBT_Config_Data.btn_wishlist_bg}`, color: `#${FBT_Config_Data.btn_wishlist_cl}`,
                        padding: '10px 20px', width: 'max-content', fontWeight: 'bold'
                    }} onClick={handleAddAllProductsToWishlist}>
                        {FBT_Config_Data.btn_text_wishlist}</button>)}
                </div >
            )}
            {openModal && (<FbtPopUp isOpen={openPopUp} setIsOpen={setOpenPopUp} setOpenModal={setOpenModal}
                fbt_config_data={FBT_Config_Data} FBT_Brief_Data={FBT_Brief_Data} popUpType={popUpType} addCartData={addCartData}
                configurableProduct={configurableProduct} setOpenModalConfigurable={setOpenModalConfigurable}
                setAddCartData={setAddCartData} setOpenPopUpConfigurable={setOpenPopUpConfigurable}></FbtPopUp>)}

            {openModalConfigurable && (<FbtPopUpConfigurable isOpen={openPopUpConfigurable} setIsOpen={setOpenPopUpConfigurable}
                setOpenModalConfigurable={setOpenModalConfigurable} configurableProduct={configurableProduct} 
                addCartData={addCartData} fbt_config_data={FBT_Config_Data}></FbtPopUpConfigurable>)}
        </>
    )
}

export default FbtBlock