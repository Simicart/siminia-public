import React from "react";
import LoadingIndicator from "@magento/venia-ui/lib/components/LoadingIndicator/indicator";

export const GlobalLoading = props => {
    const isLoading = (props ? (!!props.isLoading) : false)

    if (!isLoading) {
        return (
            <div/>
        )
    }

    return (
        <div style={{
            position: 'fixed', /* Stay in place */
            zIndex: 10, /* Sit on top */
            left: 0,
            top: 0,
            width: '100%', /* Full width */
            height: '100%', /* Full height */
            overflow: 'auto', /* Enable scroll if needed */
            backgroundColor: 'white', /* Fallback color */
        }}>
            <LoadingIndicator global={true}/>
        </div>
    )
}