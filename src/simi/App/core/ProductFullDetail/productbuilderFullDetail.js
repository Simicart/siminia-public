import React, {Suspense, useMemo, useState, useEffect, useRef, Fragment} from 'react';
import {FormattedMessage, useIntl} from 'react-intl';
import {useProductFullDetail} from 'src/simi/talons/ProductFullDetail/useProductFullDetail';
import ProductFullDetail from "./productFullDetail";
import PageBuilderComponent from "../TapitaPageBuilder/PageBuilderComponent";
import {TreeDataProductDetailMarkerEnum} from 'simi-pagebuilder-react';


require('./productbuilderFullDetail.scss');

const ProductBuilderFullDetail = props => {
    const {product, pageData, maskedId} = props;
    const talonProps = useProductFullDetail({product, noRelatedQuery: true});

    const {} = talonProps;
    const {formatMessage} = useIntl();
    const [forceRerender, setForceRerender] = useState(0);

    useEffect(() => {
        //when preview - need sometime to get page info to preview -> need time to refresh
        if (maskedId) {
            setTimeout(() => {
                setForceRerender(forceRerender + 1);
            }, 2000);
        }
    }, []);

    useEffect(() => {
            //fix the carousel height lower than its children
            try {
                const carouselChild = document.querySelector(
                    '#smpb-product-image-wrapper > div > div'
                );
                if (carouselChild && carouselChild.offsetHeight) {
                    document.getElementById(
                        'smpb-product-image-wrapper'
                    ).style.minHeight = carouselChild.offsetHeight + 15 + 'px';
                }
            } catch (err) {
            }
        }
    )

    return (
        <Fragment>
            <PageBuilderComponent pageData={pageData} key={maskedId}
                                  layoutFilter={TreeDataProductDetailMarkerEnum.TOP}/>
            <ProductFullDetail product={product}/>
            <PageBuilderComponent pageData={pageData} key={maskedId}
                                  layoutFilter={TreeDataProductDetailMarkerEnum.BOTTOM}/>
        </Fragment>
    )
};

export default ProductBuilderFullDetail;
