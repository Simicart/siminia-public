import React from 'react'
import ProductDetail from './ProductDetail';
import Identify from 'src/simi/Helper/Identify';

const ProductList = props => {
    const { homeData, history} = props;
    const renderListProduct = () => {
        if(
            homeData.home.hasOwnProperty('homeproductlists')
            && homeData.home.homeproductlists.hasOwnProperty('homeproductlists')
            && homeData.home.homeproductlists.homeproductlists instanceof Array
            && homeData.home.homeproductlists.homeproductlists.length > 0
        ) {

            const productList = homeData.home.homeproductlists.homeproductlists.map((item, index) => {
                if (item.category_id)
                    return (
                        <div className="default-productlist-item" key={index}>
                            <div className="default-productlist-title">
                                {item.list_title}
                            </div>
                            <ProductDetail dataProduct={item} history={history}/>
                        </div>
                    )
                return ''
            });
            return (
                <div className="productlist-content">
                    {productList}
                </div>
            )
        }
    }

    return (
        <div className={`default-home-product-list ${Identify.isRtl() ? 'default-home-pd-rtl' : ''}`}>
            <div className="container">
                {renderListProduct()}
            </div>
        </div>
    );
}

export default ProductList;
