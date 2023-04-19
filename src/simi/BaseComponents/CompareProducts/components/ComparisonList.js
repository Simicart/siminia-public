import React from "react";
import "../styles.scss";
import RichContent  from '@magento/venia-ui/lib/components/RichContent';

const ComparisonList = () => {
    const comparisonList = JSON.parse(localStorage.getItem('comparison-list'))

    return (
        <div className="cmp-wrapper">
            <div className="cmp-product-list">
                {comparisonList.map((element) => (
                    <div>
                        <h1>Hello</h1>
                    </div>
                ))}
            </div>

            <div className="cmp-sku">
                <h1>SKU</h1>
            </div>

            <div className="cmp-sku-list">
                {comparisonList.map((element) => (
                    <div>
                        <h1>{element.sku}</h1>
                    </div>
                ))}
            </div>

            <div className="cmp-des">
                <h1>Description</h1>
            </div>

            <div className="cmp-des-list">
                {comparisonList.map((element) => (
                    <div>
                        <RichContent html={element.description.html}></RichContent>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default ComparisonList