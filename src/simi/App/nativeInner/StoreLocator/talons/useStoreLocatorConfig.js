import React, {useState, useEffect} from 'react';
import {useStoreLocationId} from "./useStoreLocationId";
import {gql, useQuery} from "@apollo/client";

const storeLocationConfigQuery = gql`
    query($id: String){
        MpStoreLocatorConfig(storeId: $id){
            KMLinfowindowTemplatePath
            KMLlistTemplatePath
            bottom_static_block
            custom_style
            dataLocations
            defaultLat
            defaultLng
            default_radius
            description
            distance_unit
            enable_direction
            filter_radius
            infowindowTemplatePath
            isDefaultStore
            isFilter
            isFilterRadius
            keyMap
            listTemplatePath
            locationIdDetail
            locationsData{
                city
                countryId
                holidayData{
                from
                to
                }
                locationId
                name
                postcode
                region
                regionId
                street
                telephone
                timeData{
                from
                to
                use_system_config
                value
                }
            }
            markerIcon
            meta_description
            meta_keywords
            meta_title
            router
            show_on
            style
            title
            upload_default_image
            upload_head_icon
            upload_head_image
            urlSuffix
            zoom
        }
    }
`

export const useStoreLocatorConfig = (props) => {
    const {id, loading: idLoading, error} = useStoreLocationId();
    const {data: configData, loading: configLoading} = useQuery(storeLocationConfigQuery, {
        variables: {
            id: id
        },
        fetchPolicy: "cache-first"
    })

    return {
        id: id,
        config: (!!configData) ? configData.MpStoreLocatorConfig : null,
        loading: idLoading || configLoading,
        error: error
    }
};