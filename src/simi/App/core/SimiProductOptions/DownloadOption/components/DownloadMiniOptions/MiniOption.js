import React from 'react';
import { useBaseInput } from '../../../CustomOption/utils/useBaseInput';
import { CheckboxWrapper } from '../../../CustomOption/components/OptionContent/MultipleCheckbox/CheckboxWrapper';

export const MiniOption = props => {
    const { item, useProductFullDetailProps } = props;
    const {
        getCurrentDownloadableValue,
        handleDownloadableOptionsChange
    } = useProductFullDetailProps;

    const { handleSelected, getCurrentSelection } = useBaseInput({
        ...props,
        _keyToFormState: item.id,
        _getFieldName: item => item.id,
        canPickMultiple: true,
        _handleCustomOptionsChange: handleDownloadableOptionsChange,
        _getCurrentCustomValue: getCurrentDownloadableValue
    });

    return (
        <CheckboxWrapper
            item={{ ...item, option_type_id: item.id }}
            handleSelected={handleSelected}
            getCurrentSelection={getCurrentSelection}
        />
    );
};
