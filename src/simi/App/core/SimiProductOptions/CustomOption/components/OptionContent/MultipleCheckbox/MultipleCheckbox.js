import React, {memo} from 'react';
import {CheckboxWrapper} from './CheckboxWrapper';
import {useBaseInput} from '../../../utils/useBaseInput';

const canPickMultiple = false;

export const MultipleCheckbox = props => {
    const {item} = props;

    const values = item['multiple_value'] || item['checkbox_value'] || [];

    const {handleSelected, fieldName, getCurrentSelection} = useBaseInput({
        ...props,
        canPickMultiple: canPickMultiple
    });

    return (
        <>
            {values.map((item, index) => {
                return (
                    <div key={index.toString()}>
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
