import React, {useState} from 'react';
import Checkbox from "../../../../../../../BaseComponents/Checkbox_new";
import _defaultClass from './CheckboxWrapperImportant.module.css'
import OptionLabel from "../../OptionLabel/OptionLabel";
import './CheckboxWrapper.scss'
import {configColor} from "../../../../../../../Config";

export const CheckboxWrapper = (props) => {
    const {item, handleSelected, getCurrentSelection} = props
    const checkboxKey = item.option_type_id

    const checked = getCurrentSelection(checkboxKey)
    const onClick = () => {
        handleSelected(checkboxKey)
    }
    const priceLabel = <OptionLabel title={''} item={item} classes={_defaultClass}/>

    const colors = {
        checked: configColor.button_background,
        unchecked: configColor.button_background
    }
    return (
        <>
            <div className={_defaultClass.finalWrapper} onClick={onClick}>
                <Checkbox
                    label={item.title}
                    selected={checked}
                    classes={_defaultClass}
                    colors={colors}
                >
                    {priceLabel}
                </Checkbox>
            </div>
        </>
    );
};

