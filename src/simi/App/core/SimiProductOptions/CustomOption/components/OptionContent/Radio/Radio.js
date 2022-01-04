import React, {memo} from 'react';
import RadioGroup from "@magento/venia-ui/lib/components/RadioGroup";
import {useBaseInput} from "../../../utils/useBaseInput";
import defaultClass from './Radio.module.css'
import OptionLabel from "../../OptionLabel/OptionLabel";
import {getFirstInArr} from "../../../utils/getFirstInArr";
import {configColor} from "../../../../../../../Config";
import {getFieldName} from "../../../utils/getFieldName";

// TODO: add default value
const priceStyle = {
    fontWeight: 'bold',

}

export const _Radio = (props) => {
    const {item, useProductFullDetailProps} = props

    const styles = {
        backgroundColor: configColor.button_background,
        color: configColor.button_text_color
    }

    const {getCurrentCustomValue} = useProductFullDetailProps
    const uid = item.uid
    const getCurrentSelection = getCurrentCustomValue(uid)


    const radioComponents = (item.radio_value || []).map(v => {
        const priceLabel = <OptionLabel title={''} item={v} classes={defaultClass}/>

        return {
            label: <span><span>{v.title}</span>{priceLabel}</span>,
            value: v.option_type_id,
            style: getCurrentSelection(v.option_type_id) ? styles : {}
        }
    })

    const {handleSelected, fieldName} = useBaseInput({
        ...props,
        defaultValue: item.required ? getFirstInArr(radioComponents, {}).value : undefined
    })


    return (
        <RadioGroup
            classes={defaultClass}
            field={fieldName}
            initialValue={undefined}
            items={radioComponents}
            onValueChange={handleSelected}
            style={styles}
        />
    );
};

export const Radio = memo(_Radio)
