import React from "react";
import {useCallback, useState} from "react";
import {GlobalLoading} from "./GlobalLoading";

export const useGlobalLoading = () => {
    const [isLoading, _setLoading] = useState(false)

    const setLoading = (value) => {
        if (!!value !== isLoading) {
            _setLoading(!!value)
        }
    }
    const toggleLoading = () => _setLoading(prevState => !prevState)

    const Component = useCallback((props) => {
        return (
            <GlobalLoading isLoading={isLoading} {...props}/>
        )
    }, [isLoading])


    return {
        isLoading: isLoading,
        setLoading: setLoading,
        toggleLoading: toggleLoading,
        Component: Component,
        bareSetLoading: setLoading
    }
}