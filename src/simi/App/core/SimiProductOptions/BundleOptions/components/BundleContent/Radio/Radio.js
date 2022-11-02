import React from 'react';
import RadioGroup from './RadioGroup';
import { getFieldName } from '../../../utils/getFieldName';
import { useBaseInput } from '../../../utils/useBaseInput';
import defaultClass from './Radio.module.css';
import OptionLabel from '../../../../CustomOption/components/OptionLabel/OptionLabel';
import { getFirstInArr } from '../../../utils/getFirstInArr';

// TODO: add default value
const priceStyle = {
    fontWeight: 'bold'
};

export const Radio = props => {
    const { item } = props;

    const radioComponents = (item.options || []).map(v => {
        const priceLabel = (
            <OptionLabel
                title={''}
                type_id={'bundle'}
                item={v}
                classes={defaultClass}
            />
        );
        return {
            label: (
                <span>
                    <span>{v.label}</span>
                    {priceLabel}
                </span>
            ),
            value: v.id
        };
    });

    const { handleSelected, fieldName } = useBaseInput({
        ...props,
        defaultValue: item.required
            ? getFirstInArr(radioComponents, {}).value
            : undefined
    });

    return (
        <React.Fragment>
            <RadioGroup
                classes={defaultClass}
                field={fieldName}
                initialValue={undefined}
                items={radioComponents}
                onValueChange={handleSelected}
            />
        </React.Fragment>
    );
};
