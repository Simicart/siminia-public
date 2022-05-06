import React from 'react';
import defaultClasses from './giftCard.module.css'
import { useStyle } from '@magento/venia-ui/lib/classify';

const SettingSelectButton = props => {
	const {giftCardData, giftCardActions, giftCardProductData, classes} = props

    const {
        template: templates
    } = giftCardProductData

    const {
        activeTemplate
    } = giftCardData

    const {
        setActiveTemplate
    } = giftCardActions

	return (
		<div className={classes['giftcard-template-setting-select']}>
			{
				templates.map((template, i) => {
					let active = '';
					if(activeTemplate === i) {
						active = classes.active
					}
					return (
						<div 
							className={classes["giftcard-design-button-container"] + ' ' + active} 
							id={classes[`giftcard-design-button-${i+1}`]}
							onClick={() => setActiveTemplate(i)}
						>
	                        <button type="button" className={classes["giftcard-design-button"]}>
	                            <span>{template.name}</span>
	                        </button>
	                    </div>
					)
				})
			}
		</div>
	)
}

export default SettingSelectButton