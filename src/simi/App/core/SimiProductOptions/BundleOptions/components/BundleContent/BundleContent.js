import React from 'react';
import { MultipleCheckbox } from './MultipleCheckbox/MultipleCheckbox';
import { Radio } from './Radio/Radio';
import { Dropdown } from './Dropdown/Dropdown';
const optionContentMap = {
    multiple: MultipleCheckbox,
    checkbox: MultipleCheckbox,
    radio: Radio,
    select: Dropdown
};

export const BundleContent = props => {
    const { classes } = props;
    const { item, itemType, useProductFullDetailProps } = props;

    const RenderComponent = optionContentMap[itemType];

    if (!RenderComponent) {
        return null;
    }

    return (
        <div className={classes.optionContent}>
            <div className={classes.optionList}>
                <RenderComponent
                    item={item}
                    useProductFullDetailProps={useProductFullDetailProps}
                />
            </div>
        </div>
    );
};
