import React, {useEffect} from 'react'
import Identify from 'src/simi/Helper/Identify'
import { simiUseQuery } from 'src/simi/Network/Query' 
import getProductsBySkus from 'src/simi/queries/catalog/getProductsBySkus.graphql'
import Loading from "src/simi/BaseComponents/Loading"
import { GridItem } from 'src/simi/BaseComponents/GridItem'
import {applySimiProductListItemExtraField} from 'src/simi/Helper/Product'

require('./linkedProduct.scss');

const LinkedProducts = props => {
    const {product, history} = props
    const link_type = props.link_type?props.link_type:'related'
    const maxItem = 8 //max 10 items
    const handleLink = (link) => {
        history.push(link)
    }
    if (product.product_links && product.product_links.length) {
        const matchedSkus = []
        product.product_links.map((product_link) => {
            if (product_link.link_type === link_type)
                matchedSkus.push(product_link.linked_product_sku)
        })
        if (matchedSkus.length) {
            const [queryResult, queryApi] = simiUseQuery(getProductsBySkus);
            const {data} = queryResult
            const {runQuery} = queryApi

            useEffect(() => {
                runQuery({
                    variables: {
                        stringSku: matchedSkus,
                        currentPage: 1,
                        pageSize: maxItem,
                    }
                })
            },[data])

            let linkedProducts = <Loading />
            if (data && data.simiproducts && data.simiproducts.items) {
                linkedProducts = []
                data.products = applySimiProductListItemExtraField(data.simiproducts)
                data.products.items.every((item, index) => {
                    let count = 0
                    if (count < maxItem) {
                        count ++ 
                        const { small_image } = item;
                        const itemData =  {
                            ...item,
                            small_image:
                                typeof small_image === 'object' ? small_image.url : small_image
                        }
                        if (itemData)
                            linkedProducts.push (
                                <div key={index} className="linked-product-item">
                                    <GridItem
                                        item={itemData}
                                        handleLink={handleLink}
                                        lazyImage={true}
                                    />
                                </div>
                            )
                        return true
                    }
                    return false
                });
            }

            return (
                <div className="linked-product-ctn">
                    <h2 className="title">
                        <span>
                        {
                            link_type==='related'?Identify.__('Related Products'):link_type==='crosssell'?Identify.__('You may also be interested in'):''
                        }
                        </span>
                    </h2>
                    <div className="linked-products">
                        {linkedProducts}
                    </div>
                </div>
            )
        }
    }

    return ''
}
export default LinkedProducts