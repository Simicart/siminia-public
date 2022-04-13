import React from 'react';
import { useBaseInput } from '../../../utils/useBaseInput';
import { CheckboxWrapper } from './CheckboxWrapper';

const canPickMultiple = false;

//TODO: find multiple checkbox component
export const MultipleCheckbox = props => {
    const { item } = props;
    const values = item['multiple_value'] || item['checkbox_value'] || item['options'] || [];
    const { handleSelected, fieldName, getCurrentSelection } = useBaseInput({
        ...props,
        canPickMultiple: canPickMultiple
    });

    return (
        <>
            {values.map((item, index) => {
                return (
                    <div key={index.toString()} className="option-row">
                        <CheckboxWrapper
                            item={item}
                            handleSelected={handleSelected}
                            getCurrentSelection={getCurrentSelection}
                        />
                    </div>
                );
            })}
        </>
    );
};
