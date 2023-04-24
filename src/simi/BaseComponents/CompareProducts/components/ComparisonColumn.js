import React, { useState } from "react";
import { X } from 'react-feather'
import { useHistory } from "react-router-dom";
import RemovePopUp from "./RemovePopUp";

const ComparisonColumn = () => {
    const history = useHistory()
    const comparisonList = JSON.parse(localStorage.getItem('comparison-list'))
    const [isOpen, setIsOpen] = useState(false)
    const [openRemovePopUp, setOpenRemovePopUp] = useState(false)
    const [removeType, setRemoveType] = useState()
    const [index, setIndex] = useState(-1)

    return (
        <div className="cmp-col-wrapper">
            <h2 className="cmp-col-title">{comparisonList ? (comparisonList.length===1 ? `Compare Products (1 item)` : 
                                            `Compare Products (${comparisonList.length} items)`) : 'Compare Products'}</h2>
            {comparisonList && comparisonList.length>0 ? (
                comparisonList.map((element, index) => (
                    <div className="cmp-col-item">
                        <button onClick={() => {
                            setRemoveType('single')
                            setIndex(index)
                            setOpenRemovePopUp(true)
                            setIsOpen(true)
                        }}><X size={18}></X></button>
                        <a className="cmp-col-item-name" href={`/${element.url_key}.html`} dangerouslySetInnerHTML={{ __html: element.name }}></a>
                    </div>
                ))
            ) : (<p>You have no items to compare.</p>)}
            {comparisonList && comparisonList.length>0 && (<div className="cmp-col-button">
                <button onClick={() => history.push('/compare-product.html')} className="cmp-col-compare-btn">Compare</button>
                <button onClick={() => {
                            setRemoveType('all')
                            setOpenRemovePopUp(true)
                            setIsOpen(true)
                        }} className="cmp-col-clear-btn">Clear All</button>
            </div>)}

            {openRemovePopUp && (<RemovePopUp isOpen={isOpen} setIsOpen={setIsOpen} index={index}
                                              setOpenRemovePopUp={setOpenRemovePopUp} removeType={removeType}></RemovePopUp>)}
        </div>
    )
}

export default ComparisonColumn