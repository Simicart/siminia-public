import {useCallback, useState} from 'react';

export const useSubOptions = () => {
    const [options, setOptions] = useState({})

    const getCurrentValue = (keyId) => (valueId) =>
        (options[keyId] || []).includes(valueId)

    const handleOptionsChange = useCallback(
        (id, value, isMultiple = false, isForcedRemoval = false) => {
            setOptions(prevState => {
                const chosenArr = prevState[id]
                if (isForcedRemoval === true) {
                    prevState[id] = null
                } else if (!chosenArr || chosenArr.length === 0) {
                    prevState[id] = [value]
                } else {
                    const chosen = chosenArr.includes(value)
                    if (chosen) {
                        if (isMultiple) {
                            prevState[id] = chosenArr.length > 1 ? chosenArr.filter(x => x !== value) : null
                        } else {
                            prevState[id] = null
                        }
                    } else {
                        if (isMultiple) {
                            prevState[id] = chosenArr.concat(value)
                        } else {
                            if (value) {
                                prevState[id] = [value]
                            } else {
                                prevState[id] = null
                            }
                        }
                    }
                }
                return {...prevState}
            })
        }, [setOptions])

    return {
        options,
        setOptions,
        getCurrentValue,
        handleOptionsChange
    }
};
