import React from 'react';
import defaultClass from './LoadingBridge.module.css'

export const LoadingBridge = (props) => {
    const {loading = false} = props || {}

    if (loading) {
        return (
            <div>
                <div className={defaultClass["loader"]}/>
                <div className={defaultClass["modal-loader"]}/>
            </div>
        )
    }
    return null
}

export default LoadingBridge;
