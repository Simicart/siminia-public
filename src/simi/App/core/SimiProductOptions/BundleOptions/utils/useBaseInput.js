import {getFieldName} from "./getFieldName";
import {useFieldApi} from 'informed';
import {useEffect} from "react";

export const useBaseInput = (props) => {
    const {item, useProductFullDetailProps, canPickMultiple = false, defaultValue} = props

    const {handleBundleChangeOptions, getCurrentBundleValue} = useProductFullDetailProps

    const keyToFormState = item.option_id

    const handleSelected = (id) => {
        handleBundleChangeOptions(keyToFormState, id, canPickMultiple)
    }

    const fieldName = getFieldName(item)

    const getCurrentSelection = getCurrentBundleValue(keyToFormState)

    const api = useFieldApi(fieldName)
    const {setValue} = api;
    useEffect(() => {
        if (defaultValue !== undefined) {
            setValue(defaultValue)
        }
    }, [defaultValue])


    return {
        item,
        useProductFullDetailProps,
        handleBundleChangeOptions,
        getCurrentBundleValue,
        keyToFormState,
        handleSelected,
        fieldName,
        getCurrentSelection
    }
};
