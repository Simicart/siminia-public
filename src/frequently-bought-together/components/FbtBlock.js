import React, { useState } from "react"
import { useHistory } from 'react-router-dom' 
import useConfigFBT from "../talons/useConfigFBT"
import { fullPageLoadingIndicator } from "@magento/venia-ui/lib/components/LoadingIndicator"
import TinySlider from 'tiny-slider-react';
import 'tiny-slider/dist/tiny-slider.css';
import { ChevronLeft, ChevronRight } from "react-feather";
import { StaticRate } from '../../simi/BaseComponents/Rate'
import '../styles/styles.scss'

const FbtBlock = ({ crosssellProducts }) => {
    const history = useHistory()
    const [listQuantity, setListQuantity] = useState([])
    let initQuantity = []

    const configFBT = useConfigFBT()
    if (configFBT.loading) return fullPageLoadingIndicator
    if (configFBT.error) return <p>{configFBT.error.message}</p>

    const FBT_Config_Data = configFBT.data.GetConfigFBT
    const FBT_Render_Data = crosssellProducts.length > FBT_Config_Data.limit_products
        ? crosssellProducts.slice(0, FBT_Config_Data.limit_products) : crosssellProducts

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
        items: parseInt(FBT_Config_Data.item_on_slide) > FBT_Render_Data.length ? FBT_Render_Data.length : parseInt(FBT_Config_Data.item_on_slide),
        autoplay: Boolean(FBT_Config_Data.slide_auto),
        autoplayText: ['', ''],
        speed: parseInt(FBT_Config_Data.slide_speed),
        controlText: ['', ''],
        prevButton: '.fbt-slider-prev',
        nextButton: '.fbt-slider-next',

    };

    const handleQuantity = (e, index) => {
        setListQuantity(state => {
            let tmp = state
            if (tmp === []) {
                for (let i = 0; i < FBT_Render_Data.length; i++) {
                    tmp.push(1)
                }
            }
            tmp[index] = e.target.value
            console.log(tmp)
            return tmp
        })
    }

    console.log(listQuantity)
    console.log(crosssellProducts)

    return (
        <>
            {FBT_Config_Data.active === '1' && (
                <div style={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
                    <div style={{ display: 'flex', flexDirection: 'row', marginTop: 30, justifyContent: 'space-between' }}>
                        <p style={{ fontSize: 22, fontWeight: 'bold' }}>{FBT_Config_Data.title_of_list}</p>
                        <div style={{ display: 'flex', flexDirection: 'row', textAlign: 'center', gap: 32 }}>
                            <button className="fbt-slider-prev">
                                <ChevronLeft size={16} />
                            </button>
                            <button className="fbt-slider-next">
                                <ChevronRight size={16} />
                            </button>
                        </div>
                    </div>

                    <TinySlider settings={settings}>
                        {FBT_Render_Data.map((element, index) => (
                            <div key={index} className={index === 0 ? 'fpt-slider-first' : (index === FBT_Render_Data.length ? 'fpt-slider-last' : 'fpt-slider')}>
                                <img
                                    className={`tns-lazy-img`}
                                    src={element.small_image.url}
                                    data-src={element.small_image.url}
                                    alt=""
                                    style={imgStyles}
                                    onClick={() => history.push(`/${element.url_key}.html`)}
                                />
                                {FBT_Config_Data.show_review === '1' && (
                                    <div style={{ display: 'flex', flexDirection: 'row', marginBottom: 10, gap: 5 }}>
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
                                {FBT_Config_Data.display_list === '0' && (
                                    <div style={{ display: 'flex', flexDirection: 'column', marginTop: 20 }}>
                                        <div style={{ display: 'flex', flexDirection: 'row', gap: 10, marginBottom: 20 }}>
                                            <input type='checkbox'></input>
                                            <input style={{ height: 30, width: 60, padding: 10 }} id={`fbt-quantity-${index}`}
                                                onChange={(e) => handleQuantity(e, index)}
                                                defaultValue={1}></input>
                                        </div>
                                        {FBT_Config_Data.sng_cart === '1' && (<button style={{
                                            padding: '10px 20px', textAlign: 'center',
                                            width: 'max-content', backgroundColor: '#1979C3', color: 'white', fontWeight: 'bold'
                                        }}>Add to cart</button>)}
                                    </div>)}
                            </div>
                        ))}
                    </TinySlider>

                    <div style={{ display: 'flex', flexDirection: 'column', width: 700, gap: 25, marginTop: 50 }}>
                        <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
                            <p style={{ fontSize: 16, fontWeight: 'bold', width: '60%' }}>Products Name</p>
                            <p style={{ fontSize: 16, fontWeight: 'bold', width: '10%' }}>Qty</p>
                            <p style={{ fontSize: 16, fontWeight: 'bold', width: '30%' }}>Unit Price</p>
                        </div>
                        {FBT_Render_Data.map((element, index) => {
                            return (
                                <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
                                    <p style={{ fontSize: 16, width: '60%' }} dangerouslySetInnerHTML={{ __html: element.name }}></p>
                                    <p style={{ fontSize: 16, width: '10%' }}>1</p>
                                    <p style={{ fontSize: 16, width: '30%' }}>{`$${element.price.regularPrice.amount.value.toFixed(2)}`}</p>
                                </div>
                            )
                        })}
                        <div style={{ display: 'flex', flexDirection: 'row', gap: 5 }}>
                            <input type='checkbox'></input>
                            <p style={{fontSize: 16}}>Select all products</p>
                        </div>
                    </div>


                    {/*List of product choosen*/}

                    {FBT_Config_Data.btn_cart === '1' && (<button style={{
                        backgroundColor: `#${FBT_Config_Data.btn_cart_bg}`, color: `#${FBT_Config_Data.btn_cart_cl}`,
                        margin: '20px 0', padding: '10px 20px', width: 'max-content', fontWeight: 'bold'
                    }}>
                        {FBT_Config_Data.btn_text_cart}</button>)}
                    {FBT_Config_Data.btn_wishlist === '1' && (<button style={{
                        backgroundColor: `#${FBT_Config_Data.btn_wishlist_bg}`, color: `#${FBT_Config_Data.btn_wishlist_cl}`,
                        padding: '10px 20px', width: 'max-content', fontWeight: 'bold'
                    }}>
                        {FBT_Config_Data.btn_text_wishlist}</button>)}
                </div >
            )}
        </>
    )
}

export default FbtBlock