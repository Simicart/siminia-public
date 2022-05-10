import React, {useEffect, useMemo, useState, Fragment, useCallback} from 'react';
import GoogleMap from "../GoogleMap/GoogleMap";
import MainSearchList from "../SearchList/MainList/MainSearchList";
import {useSearchStoreByLocationAndRadius} from "../talons/useSearchStoreByLocationAndRadius";
import LocationPin from "../GoogleMap/LocationPin";
import { useWindowSize } from '@magento/peregrine';
import StoreCardList from "../SearchList/MainList/Result/StoreCardList";
import FilterRadiusSidebar from "../SearchList/FilterRadius/FilterRadiusSidebar";
import {LARGE, MEDIUM, UPPER_MEDIUM} from "../untils/breakpoints";
import {convertToMeter} from "../untils/convertToMeter";
import SideMapToggle from "../GoogleMap/SideMapToggle";


const StoreFindeBody = (props) => {
        const config = props ? props.config : null;
        const loading = props ? props.loading : null;
        const classes = props ? props.classes : null;
        const handleChosenStore = props ? props.handleChosenStore : null;
        const cartId = props ? props.cartId : null;


        const [showLeftFilter, setShowLeftFilter] = useState(false)
        const [currentFilter, setCurrentFilter] = useState('default');
        const [query, setQuery] = useState('')
        const [currentChosenStore, _setChosenStore] = useState(null)
        const [showBody, setShowBody] = useState(false)

        const [showDetail, setShowDetail] = useState(false)
        const [storeDetails, setStoreDetails] = useState(null)

        const {
            keyMap, locationsData,
            filter_radius, upload_default_image,
            markerIcon, default_radius, distance_unit,
            zoom, custom_style: ggmap_custom_style
        } = config || {}

        const distanceUnit = (distance_unit === '1') ? 'Miles' : 'Km'
        const {innerWidth: width} = useWindowSize()

        const setChosenStore = useCallback((x) => {
            _setChosenStore(x);
            !!handleChosenStore && handleChosenStore(x);
        }, [_setChosenStore, handleChosenStore])

        const {
            data: filteredLocationData,
            unfilteredData,
            loading: filterLocationLoading,
            setCurrentSearchLocation,
            currentSearchLocation
        } = useSearchStoreByLocationAndRadius({
            filterRadius: (currentFilter !== 'default') ? currentFilter : null,
            defaultRadius: Number.parseFloat(default_radius || '0'),
            distanceUnit: distanceUnit,
            setChosenStore: setChosenStore,
            cartId: cartId
        })


        const locations = useMemo(() => {
            return unfilteredData ? unfilteredData.map(x => {
                const {location_id} = x
                return {
                    position: {
                        latitude: x.latitude,
                        longitude: x.longitude
                    },
                    name: x.name,
                    city: x.city,
                    countryId: x.country,
                    region: x.state_province,
                    street: x.street,
                    timeData: locationsData ? locationsData.filter(y => y.locationId === location_id)[0].timeData : null,
                    pinImage: markerIcon
                }
            }) : []
        }, [unfilteredData, locationsData])


        const list = (width >= MEDIUM || (width < MEDIUM && showBody)) ? (
            <div style={{}}>
                <FilterRadiusSidebar
                    showLeftFilter={showLeftFilter}
                    setShowLeftFilter={setShowLeftFilter}
                    filter_radius={filter_radius}
                    setCurrentFilter={setCurrentFilter}
                    distanceUnit={distanceUnit}
                />

                <div>
                    <MainSearchList keyMap={keyMap}
                                    setShowLeftFilter={setShowLeftFilter}
                                    query={query}
                                    setQuery={setQuery}
                                    handleChooseSearch={(x) => {
                                        setCurrentSearchLocation(x)
                                    }}
                    />

                    <StoreCardList
                        showDetail={showDetail}
                        storeDetails={storeDetails}
                        filteredLocationData={filteredLocationData}
                        locationsData={locationsData}
                        upload_default_image={upload_default_image}
                        setChosenStore={setChosenStore}
                        setStoreDetails={setStoreDetails}
                        setShowDetail={setShowDetail}
                    />
                </div>
            </div>
        ) : (<div/>)


        const radiusAroundLocation = convertToMeter(
            (currentFilter !== 'default' ? currentFilter : default_radius), distanceUnit)

        const mapLocationObject = useMemo(
            () => currentSearchLocation ? {
                lng: currentSearchLocation.long,
                lat: currentSearchLocation.lat
            } : null, [currentSearchLocation])


        const serverChoiceOfMapStyle = useMemo(() => {
            try {
                return JSON.parse(ggmap_custom_style)
            } catch (e) {
                console.warn('Can\'t parse custom style for map')
            }
        }, [config])

        //Prevent re-rendering. This is thicc
        const map = useMemo(() => (
            <>
                <GoogleMap
                    apiKey={keyMap}
                    locations={locations}
                    height={width >= MEDIUM ? '100%' : `${width - 40}px`}
                    customPing={LocationPin}
                    cssClasses={['store-locator-map']}
                    zoom={15 || zoom} // TODO: remove after test
                    center={currentChosenStore}
                    mapOptions={{
                        mapTypeControl: width > LARGE,
                        styles: serverChoiceOfMapStyle
                    }}
                    currentChosenLocation={mapLocationObject}
                    customChosenLocationRadius={radiusAroundLocation}
                />
            </>
        ), [
            keyMap, locations, zoom,
            currentChosenStore, width > LARGE, width < MEDIUM,
            mapLocationObject, radiusAroundLocation,
            serverChoiceOfMapStyle
        ])


        useEffect(() => {
            if (width < MEDIUM) {
                if (showBody === true) {
                    setShowBody(false)
                }
                if (showDetail) {
                    setShowDetail(false)
                }
            }

        }, [width < MEDIUM])


        if (loading || !config) {
            return (
                <div>

                </div>
            )
        }

        return (
            <>
                <div style={{
                    display: width >= MEDIUM ? "flex" : 'block',
                    flexDirection: "row",
                    marginTop: 20
                }}>
                    <div style={{
                        flex: 3.2,
                        backgroundColor: '#55555535',
                        minWidth: width > UPPER_MEDIUM ? 381 : 300,
                        maxWidth: 390,
                        position: (width < MEDIUM && showBody) ? 'absolute' : 'inherit',
                        zIndex: 1
                    }}>
                        {list}
                    </div>

                    <div style={{flex: 6}}>
                        {width < MEDIUM && (
                            <SideMapToggle
                                setShowBody={setShowBody}
                                showBody={showBody}
                            />
                        )}
                        {map}
                    </div>
                </div>
            </>
        );
    }
;

export default StoreFindeBody;