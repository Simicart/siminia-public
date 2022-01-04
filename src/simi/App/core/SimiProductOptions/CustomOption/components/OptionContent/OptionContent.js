import React from 'react';
import {Radio} from './Radio/Radio';
import {Dropdown} from './Dropdown/Dropdown';
import {FieldInput} from './FieldInput/FieldInput';
import {AreaInput} from './AreaInput/AreaInput';
import {DateTimeInput} from './DateTimeInput/DateTimeInput';
import {MultipleCheckbox} from './MultipleCheckbox/MultipleCheckbox'

const optionContentMap = {
    multiple: MultipleCheckbox,
    checkbox: MultipleCheckbox,
    radio: Radio,
    drop_down: Dropdown,
    select: Dropdown,
    date: DateTimeInput, // accordance with siminia 11
    time: DateTimeInput, // accordance with siminia 11
    date_time: DateTimeInput,
    field: FieldInput,
    area: AreaInput,
    file: null // this might not be needed
};

export const OptionContent = props => {
    const {item, itemType, useProductFullDetailProps} = props;

    const RenderComponent = optionContentMap[itemType];

    if (!RenderComponent) {
        return null;
    }

    return (
        <div className={'option-content'}>
            <div className={'option-list'}>
                <RenderComponent
                    item={item}
                    useProductFullDetailProps={useProductFullDetailProps}
                />
            </div>
        </div>
    );
};
