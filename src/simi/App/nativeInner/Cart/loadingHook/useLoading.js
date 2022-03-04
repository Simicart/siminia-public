import React, {useState, useMemo} from "react";
import LoadingBridge from "../LoadingBridge/LoadingBridge";

export const useLoading = (props) => {
    const [isLoading, setLoading] = useState(false)

    const loader = useMemo(() => {
            return (
                <LoadingBridge loading={isLoading}/>
            )
        }, [isLoading]
    )

    return {
        component: loader,
        setLoading: setLoading,
        isLoading: isLoading
    }

}
