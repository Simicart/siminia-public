import React from 'react';
import TextInput from "@magento/venia-ui/lib/components/TextInput/textInput";
import defaultClass from './FieldInput.module.css'

import {useBaseInput} from "../../../utils/useBaseInput";

export const FieldInput = (props) => {
    const {item, handleSelected, fieldName} = useBaseInput(props)

    return (
        <TextInput field={fieldName}
                   onChange={e => handleSelected(e.target.value || null)}
                   classes={defaultClass}
        />
    );
};

