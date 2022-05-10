import {useMemo} from 'react';
import {useFetch} from "./useFetch";

export const useSearch = (props) => {
    const key = props ? props.key : null;
    const query = props ? props.query : null;

    const {
        response,
        loading
    } = useFetch(`https://maps.googleapis.com/maps/api/place/textsearch/json?key=${key || ''}&query=${query || ''}`, {
        shouldFetch: !!key && !!query,
        headers: {
            'Access-Control-Allow-Origin': 'http://localhost:10000', // TODO: remove this at end of dev
        },
        shouldDebounce: true,
        debounceTime: 250
    })

    const formattedData = useMemo(() => {
        if (!query || !response || loading) {
            return null
        }

        return response.results.map(result => {
            return {
                name: result.name,
                address: result.formatted_address,
                id: result.place_id,
                icon: result.icon,
                lat: result.geometry.location.lat,
                long: result.geometry.location.lng
            }
        }).slice(0, 5) //TODO: maybe not this

    }, [response, query, loading])

    return {
        data: formattedData,
        loading: loading
    }
};  