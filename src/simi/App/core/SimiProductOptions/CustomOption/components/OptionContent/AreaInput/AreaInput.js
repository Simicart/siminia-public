import React from 'react';
import {useBaseInput} from "../../../utils/useBaseInput";
import TextAreaVenia from "@magento/venia-ui/lib/components/TextArea/textArea";
import defaultClass from './AreaInput.module.css'

export const AreaInput = (props) => {
    const {item, handleSelected, fieldName} = useBaseInput(props)

    return (
        <TextAreaVenia field={fieldName}
                       classes={defaultClass}
                       onChange={e => handleSelected(e.target.value || null)}
        />
    );
};

