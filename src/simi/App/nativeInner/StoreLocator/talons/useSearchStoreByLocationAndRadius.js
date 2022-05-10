import React, {useState, useMemo, useCallback} from 'react';
import {gql, useQuery} from "@apollo/client";
import {md_hash} from "../untils/mdHash";
import {pointWithinRadius} from "../untils/getDistanceTwoPointsOnMap";

// need big page size because filter is done on client size
// because the filter API for this plugin is a bit sluggish
const filterLocationQueryBasic = gql`
query{
  MpStoreLocatorLocations(pageSize:100){
    items{
      images
      name
      street
      city
      country
      longitude
      latitude
      phone_one
      phone_two
      state_province
      website
      url_key
      location_id
      email
    }
    total_count
  }
}
`


const filterLocationInCartQuery = gql`
query($cartId: String!) {
  MpStoreLocatorPickupLocationList(cartId: $cartId) {
    items {
      images
      name
      street
      city
      country
      longitude
      latitude
      phone_one
      phone_two
      state_province
      website
      url_key
      location_id
      email
      product_ids
      is_selected_all_product
    }
    total_count
  }
}
`


export const useSearchStoreByLocationAndRadius = (props) => {
    const [currentSearchLocation, _setCurrentSearchLocation] = useState(null)
    const defaultRadius = props ? props.defaultRadius : 10;
    const filterRadius = (props ? props.filterRadius : null) || defaultRadius; //TODO: check where default
    const distanceUnit = props ? props.distanceUnit : 'Miles';
    const cartId = props ? props.cartId : null;


    const {long: longitude, lat: latitude} = currentSearchLocation || {};
    const setChosenStore = props ? props.setChosenStore : () => console.warn('Not implemented');

    const {data, loading, error} = useQuery(
        !!cartId ? filterLocationInCartQuery : filterLocationQueryBasic,
        {
            fetchPolicy: 'no-cache',
            variables: {
                cartId: cartId
            },
        }
    )

    const unfilteredData = useMemo(() => data ? (
        !!cartId ? data.MpStoreLocatorPickupLocationList.items
            : data.MpStoreLocatorLocations.items
    ) : null, [cartId, data])


    const returnData = useMemo(() => {
        return unfilteredData ? unfilteredData.filter(x => {
            if (currentSearchLocation) {
                return pointWithinRadius({
                        lng: x.longitude,
                        lat: x.latitude
                    }, {
                        lng: longitude,
                        lat: latitude
                    },
                    filterRadius,
                    distanceUnit
                )
            }
            return true
        }) : null
    }, [
        currentSearchLocation, data,
        filterRadius, distanceUnit,
        longitude, latitude, unfilteredData
    ])


    const setCurrentSearchLocation = useCallback((x) => {
        if (md_hash(currentSearchLocation) !== md_hash(x)) {
            _setCurrentSearchLocation(x)
            setChosenStore(null)
            return true
        } else {
            return false
        }
    }, [md_hash, currentSearchLocation, _setCurrentSearchLocation])

    return {
        data: returnData,
        unfilteredData: unfilteredData,
        loading: loading,
        setCurrentSearchLocation: setCurrentSearchLocation,
        currentSearchLocation: currentSearchLocation
    }
};