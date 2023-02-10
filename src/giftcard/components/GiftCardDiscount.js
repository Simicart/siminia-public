import React, { useState } from "react"
import '../styles/gift-card-discount.css'
import { ChevronDown, ChevronUp } from "react-feather"

const GiftCardDiscount = () => {
    const [expand, setExpand] = useState(false)
    return (
        <>
            <div className='wrapper' onClick={() => setExpand(prev => !prev)}>
                <div className="header">
                    <div>
                        <h1 style={{ fontSize: 18 }}>Enter Gift Card Code</h1>
                    </div>
                    <div>
                        {expand ? (<ChevronUp></ChevronUp>) : (<ChevronDown></ChevronDown>)}
                    </div>
                </div>
                {expand && (<div>
                    <p style={{ fontSize: 14, marginTop: 40, marginBottom: 6 }}>Gift Card Code</p>
                    <div className="input-wrapper">
                        <div style={{flexGrow: 1}}>
                            <input className="input-code" placeholder="Enter code"></input>
                        </div>
                        <div>
                            <button className='apply-button'>Apply</button>
                        </div>
                    </div>
                </div>)}
            </div>
        </>
                )
    }

export default GiftCardDiscount