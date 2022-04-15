import React, { useState } from 'react';
import Checkbox from '../../../../../../../BaseComponents/Checkbox';
import defaultClass from './CheckboxWrapper.scss';
import _defaultClass from './CheckboxWrapper.module.css';
import Optionlabel from '../../../../CustomOption/components/OptionLabel/OptionLabel';

export const CheckboxWrapper = props => {
    const { item, handleSelected, getCurrentSelection } = props;
    const checkboxKey = item.option_type_id || item.id;
    const checked = getCurrentSelection(checkboxKey);
    const onClick = () => {
        handleSelected(checkboxKey);
    };
    const priceLabel = (
        <Optionlabel title={''} item={item} classes={_defaultClass} />
    );

    return (
        <>
            <div onClick={onClick}>
                <Checkbox label={item.label} selected={checked}>
                    {priceLabel}
                </Checkbox>
            </div>
        </>
    );
};
