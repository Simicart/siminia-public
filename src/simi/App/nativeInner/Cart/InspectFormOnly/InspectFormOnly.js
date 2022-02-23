import React, {useEffect} from 'react';
import {useFormApi, useFormState} from "informed";

export const InspectFormOnly = () => {
    const formState = useFormState()
    const formAPI = useFormApi()

    useEffect(() => {
        console.log(formAPI)
        console.log(formState)
    }, [formAPI, formState])

    return null
};

