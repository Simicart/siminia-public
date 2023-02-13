import React, { Fragment } from 'react';
import { useButton } from '../../talons/useButton';
import { useStyle } from '@magento/venia-ui/lib/classify';
import Button from '@magento/venia-ui/lib/components/Button';
import defaultClasses from './buttonCFP.module.css';

export const checkIsHidePriceEnable = (product) => {
    const { advancedhideprice } = product || {};
    return !!advancedhideprice.advancedhideprice_text && !!advancedhideprice.advancedhideprice_type
}

const Modal = React.lazy(() =>
    import('../Modal')
);

const HidePriceButton = props => {
    const { addToCartBtn, product, type } = props;
    const classes = useStyle(defaultClasses, props.classes);
    const talonProps = useButton({
        product
    });
    const { isHidePrice, isCallForPrice, text, productSku, handleOpen } = talonProps;
    let rootClasses = classes.root
    if(type === 'list') {
        rootClasses = classes.rootList
    } else if (type === 'detail-mobile') {
        rootClasses = classes.rootDetailMobile
    }
    if (isHidePrice) {
        return <div className={rootClasses}>{text}</div>;
    }
    if (isCallForPrice) {
        return (
            <Fragment>
                <div className={rootClasses}>
                    <Button priority="high" onClick={handleOpen}>
                        {text}
                    </Button>
                </div>
                <Modal productSku={productSku}/>
            </Fragment>
        );
    }
    return addToCartBtn;
};

export default HidePriceButton;
