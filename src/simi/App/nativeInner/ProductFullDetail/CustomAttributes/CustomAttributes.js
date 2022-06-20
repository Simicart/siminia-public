import React, { Component } from 'react'
import defaultClasses from './customAttributes.module.css'
import { useStyle } from '@magento/venia-ui/lib/classify';

import { BrowserPersistence } from '@magento/peregrine/lib/util';
const storage = new BrowserPersistence();
const storeCode = storage.getItem('store_view_code') || STORE_VIEW_CODE;

import RichText from '@magento/venia-ui/lib/components/RichText'
import { useIntl } from 'react-intl';

const CustomAttributes = props => {

    const {customAttributes} = props

    const classes = useStyle(defaultClasses, props.classes);
    const { formatMessage } = useIntl();

    const content = []
    customAttributes.forEach((customAttribute) => {
        const {attribute_metadata, entered_attribute_value, selected_attribute_options} = customAttribute || {}
        if(attribute_metadata) {
            const usedInProductDetail = attribute_metadata.used_in_components.some((usedInComponent) => usedInComponent === 'PRODUCT_DETAILS_PAGE')
            if(usedInProductDetail) {
                let label = attribute_metadata.label
                if(attribute_metadata.attribute_labels && attribute_metadata.attribute_labels.length > 0) {
                    const storeAttributeLabel = attribute_metadata.attribute_labels.find((attributeLabel) => attributeLabel.store_code === storeCode)
                    if(storeAttributeLabel) {
                        label = storeAttributeLabel.label
                    }
                }
     
                if(selected_attribute_options && selected_attribute_options.attribute_option && selected_attribute_options.attribute_option.length > 0) {
                    const optionValues = selected_attribute_options.attribute_option.map((option) => {
                        return option.label
                    })
                    
                    content.push(
                        <tr>
                            <th>{label}</th>
                            <td>{optionValues.join(', ')}</td>
                        </tr>
                    )
                } else if (entered_attribute_value && entered_attribute_value.value) {
                    content.push(
                        <tr>
                            <th>{label}</th>
                            <td><RichText  classes={{ root: classes.customAttributeRichtext }} content={entered_attribute_value.value}  /></td>
                        </tr>
                    )
                }
                
            }
            
        }
    })

    return (
      <div className={classes.root}>
          <h3>{formatMessage({id: 'More Information'})}</h3>
          <table>
            {content}
          </table>
      </div>
    )
  
}

export default CustomAttributes