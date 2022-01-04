import {useState, useEffect, useRef} from 'react';
import useFieldState from "@magento/peregrine/lib/hooks/hook-wrappers/useInformedFieldStateWrapper";
import {useFieldApi} from 'informed';


export const usePackedFormState = (props) => {
    const {key: _key, defaultValue: _defaultValue} = props
    const key = useRef(_key).current
    const defaultValue = useRef(_defaultValue).current

    const {setValue} = useFieldApi(key);
    const {value} = useFieldState(key);

    useEffect(() => {
        setValue(defaultValue)
    }, [defaultValue, setValue])

    return {
        setValue: setValue,
        value: value
    }
};
