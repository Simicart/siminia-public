import React, {
    Suspense,
    useMemo,
    useState,
    useEffect,
    useRef,
    Fragment
} from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { useProductFullDetail } from 'src/simi/talons/ProductFullDetail/useProductFullDetail';
import ProductFullDetail from './productFullDetail';
import PageBuilderComponent from '../TapitaPageBuilder/PageBuilderComponent';
import { TreeDataProductDetailMarkerEnum } from 'simi-pagebuilder-react';
import RichContent from '@magento/venia-ui/lib/components/RichContent/richContent';

require('./productbuilderFullDetail.scss');

const ProductBuilderFullDetail = props => {
    const { product, pageData, maskedId } = props;
    const talonProps = useProductFullDetail({ product, noRelatedQuery: true });

    const {} = talonProps;
    const { formatMessage } = useIntl();
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
        } catch (err) {}
    });

    const pDetails = JSON.parse(JSON.stringify(product));
    const overRender = (item, itemProps, innerContent) => {
        if (!item || !itemProps) return false;
        const { type } = item;
        if (type === 'productbuilder_productattribute') {
            if (item.name) {
                let attributeString = item.name;
                attributeString = attributeString.substring(
                    attributeString.indexOf('{{') + 2,
                    attributeString.lastIndexOf('}}')
                );
                let attributeVal;
                if (attributeString.includes('.')) {
                    try {
                        const attributepaths = attributeString.split('.');
                        if (attributepaths && attributepaths.length) {
                            attributeVal = pDetails;
                            attributepaths.map(attributepath => {
                                if (attributeVal[attributepath])
                                    attributeVal = attributeVal[attributepath];
                            });
                        }
                    } catch (err) {
                        console.warn(err);
                    }
                }
                if (attributeVal && typeof attributeVal !== 'object')
                    return (
                        <div {...itemProps}>
                            <RichContent
                                html={item.name.replace(
                                    '{{' + attributeString + '}}',
                                    attributeVal
                                )}
                            />
                        </div>
                    );
            }
        }
        return false;
    };

    return (
        <Fragment>
            <PageBuilderComponent
                pageData={pageData}
                key={maskedId}
                overRender={overRender}
                layoutFilter={TreeDataProductDetailMarkerEnum.TOP}
            />
            <ProductFullDetail product={product} />
            <PageBuilderComponent
                pageData={pageData}
                key={maskedId}
                overRender={overRender}
                layoutFilter={TreeDataProductDetailMarkerEnum.BOTTOM}
            />
        </Fragment>
    );
};

export default ProductBuilderFullDetail;
