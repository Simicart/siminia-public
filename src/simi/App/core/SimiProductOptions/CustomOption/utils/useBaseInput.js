import {getFieldName} from "./getFieldName";
import {useFieldApi} from 'informed';
import {useCallback, useEffect, useRef} from "react";

export const useBaseInput = (props) => {
    const {
        item,
        useProductFullDetailProps,
        canPickMultiple = false,
        defaultValue,
        _getFieldName = getFieldName,
        _keyToFormState = null,
        _handleCustomOptionsChange = null,
        _getCurrentCustomValue = null
    } = props


    const {handleCustomOptionsChange, getCurrentCustomValue} = useProductFullDetailProps
    const dispatchFunction = _handleCustomOptionsChange || handleCustomOptionsChange

    const keyToFormState = _keyToFormState || item.uid

    const handleSelected = useCallback(
        (id) => {
            if (id !== null) {
                dispatchFunction(keyToFormState, id, canPickMultiple)
            } else {
                dispatchFunction(keyToFormState, id, canPickMultiple, true)
            }
        },
        [dispatchFunction, keyToFormState, canPickMultiple]
    )

    const fieldName = _getFieldName(item)

    const getFunction = _getCurrentCustomValue || getCurrentCustomValue
    const getCurrentSelection = getFunction(keyToFormState)

    const api = useFieldApi(fieldName)
    const {setValue} = api;

    useEffect(() => {
        if (defaultValue !== undefined) {
            setValue(defaultValue)
        }
    }, [defaultValue])


    useEffect(() => {
        return () => {
            handleSelected(null)
        }
    }, [])

    return {
        item,
        useProductFullDetailProps,
        handleCustomOptionsChange: dispatchFunction,
        getCurrentCustomValue,
        keyToFormState,
        handleSelected,
        fieldName,
        getCurrentSelection
    }
};
