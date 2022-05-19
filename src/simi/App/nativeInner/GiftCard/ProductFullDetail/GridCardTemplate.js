import React from 'react';
import defaultClasses from './giftCard.module.css'
import GiftCardPreview from './GiftCardPreview'
import SettingSelectButton from './GiftCardSettingSelectButton'
import GiftCardChooseImageTemplate from './GiftCardChooseImageTemplate'
import { useStyle } from '@magento/venia-ui/lib/classify';

const GridCardTemplate = props => {
	const {giftCardData, giftCardActions, giftCardProductData} = props

    const classes = useStyle(defaultClasses, props.classes);

	return (
		<div className={classes["giftcard-template-container"]} id="giftcard-template-container">
            <GiftCardPreview 
                classes={classes}
                giftCardData={giftCardData}
                giftCardProductData={giftCardProductData}
            />
            <div className={classes['template-selections-container']}>
                <div className={classes['block-title']}>
                    <span>Gift card design</span>
                </div>
                <SettingSelectButton
                    classes={classes}
                    giftCardProductData={giftCardProductData}
                    giftCardData={giftCardData}
                    giftCardActions={giftCardActions}
                /> 
                <GiftCardChooseImageTemplate 
                    classes={classes}
                    giftCardProductData={giftCardProductData}
                    giftCardData={giftCardData}
                    giftCardActions={giftCardActions}
                />
            </div>
        </div>
	)
}

export default GridCardTemplate