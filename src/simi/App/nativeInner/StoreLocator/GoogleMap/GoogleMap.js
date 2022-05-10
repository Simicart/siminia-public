import React, {useEffect, useRef, useState} from 'react';
import {arrayOf, string, bool, number, object, shape, any} from 'prop-types';
import loadGoogleMapsApi from 'load-google-maps-api';
import defaultClasses from '@magento/pagebuilder/lib/ContentTypes/Map/map.module.css';
import escape from 'lodash.escape';
import {mergeClasses} from '@magento/venia-ui/lib/classify';
import {mapDefaultProps} from '@magento/pagebuilder/lib/ContentTypes/Map/configAggregator';

const MAP_DARK_THEME = [
    {elementType: "geometry", stylers: [{color: "#242f3e"}]},
    {elementType: "labels.text.stroke", stylers: [{color: "#242f3e"}]},
    {elementType: "labels.text.fill", stylers: [{color: "#746855"}]},
    {
        featureType: "administrative.locality",
        elementType: "labels.text.fill",
        stylers: [{color: "#d59563"}],
    },
    {
        featureType: "poi",
        elementType: "labels.text.fill",
        stylers: [{color: "#d59563"}],
    },
    {
        featureType: "poi.park",
        elementType: "geometry",
        stylers: [{color: "#263c3f"}],
    },
    {
        featureType: "poi.park",
        elementType: "labels.text.fill",
        stylers: [{color: "#6b9a76"}],
    },
    {
        featureType: "road",
        elementType: "geometry",
        stylers: [{color: "#38414e"}],
    },
    {
        featureType: "road",
        elementType: "geometry.stroke",
        stylers: [{color: "#212a37"}],
    },
    {
        featureType: "road",
        elementType: "labels.text.fill",
        stylers: [{color: "#9ca5b3"}],
    },
    {
        featureType: "road.highway",
        elementType: "geometry",
        stylers: [{color: "#746855"}],
    },
    {
        featureType: "road.highway",
        elementType: "geometry.stroke",
        stylers: [{color: "#1f2835"}],
    },
    {
        featureType: "road.highway",
        elementType: "labels.text.fill",
        stylers: [{color: "#f3d19c"}],
    },
    {
        featureType: "transit",
        elementType: "geometry",
        stylers: [{color: "#2f3948"}],
    },
    {
        featureType: "transit.station",
        elementType: "labels.text.fill",
        stylers: [{color: "#d59563"}],
    },
    {
        featureType: "water",
        elementType: "geometry",
        stylers: [{color: "#17263c"}],
    },
    {
        featureType: "water",
        elementType: "labels.text.fill",
        stylers: [{color: "#515c6d"}],
    },
    {
        featureType: "water",
        elementType: "labels.text.stroke",
        stylers: [{color: "#17263c"}],
    },
]

const getLocationFormattedAsHtml = location => {
    const name = location.name ? `<h3>${escape(location.name)}</h3>` : '';
    const comment = location.comment
        ? `<p class="map-comment">${escape(location.comment).replace(
            /(?:\r\n|\r|\n)/g,
            '<br>'
        )}</p>`
        : '';
    const phone = location.phone ? `Phone: ${escape(location.phone)}<br>` : '';
    const address = location.address ? `${escape(location.address)}<br>` : '';
    const city = location.city ? escape(location.city) : '';
    const country = location.country ? escape(location.country) : '';
    const state = location.state ? escape(location.state) + ' ' : '';
    const zipCode = location.zipcode ? escape(location.zipcode) : '';
    const cityComma =
        city.length && (state.length || zipCode.length) ? ', ' : '';
    const lineBreak = city.length || zipCode.length ? '<br>' : '';

    return `
    <div class="map-popup">
        ${name}
        ${comment}
        <p><span>${phone}${address}${city}${cityComma}${state}${zipCode}${lineBreak}${country}</span></p>
    </div>
`;
};

/**
 * Page Builder Map component.
 *
 * This component is part of the Page Builder / PWA integration. It can be consumed without Page Builder.
 *
 * @typedef GoogleMap
 * @kind functional component
 *
 * @param {props} props React component props
 *
 * @returns {React.Element} A React component that displays a Map.
 */

const LIGHT_THEME = 'dark';
const DARK_THEME = 'light';

const GoogleMap = props => {
    const mapElement = useRef(null);
    const classes = mergeClasses(defaultClasses, props.classes);
    const [mapTheme, setMapTheme] = useState(LIGHT_THEME)

    const {
        apiKey,
        locations,
        height,
        mapOptions = {},
        textAlign,
        border,
        borderColor,
        borderWidth,
        borderRadius,
        marginTop,
        marginRight,
        marginBottom,
        marginLeft,
        paddingTop,
        paddingRight,
        paddingBottom,
        paddingLeft,
        cssClasses = [],
        customPing = null,
        center = null,
        centerIndex = null,
        zoom = null,
        currentChosenLocation = null,
        chosenStoreCustomPing = null,
        customChosenLocationRadius = null //in meter
    } = props;

    const dynamicStyles = {
        height,
        textAlign,
        border,
        borderColor,
        borderWidth,
        borderRadius,
        marginTop,
        marginRight,
        marginBottom,
        marginLeft,
        paddingTop,
        paddingRight,
        paddingBottom,
        paddingLeft
    };

    useEffect(() => {
        const handleChangeTheme = (e) => {
            const newTheme = e.matches ? DARK_THEME : LIGHT_THEME
            if (mapTheme !== newTheme) {
                setMapTheme(newTheme)
            }
        }
        window.matchMedia('(prefers-color-scheme: dark)')
            .addEventListener('change', handleChangeTheme);

        return () => {
            window.matchMedia('(prefers-color-scheme: dark)')
                .removeEventListener('change', handleChangeTheme)
        }
    }, [])

    useEffect(() => {
        if (!locations.length && !currentChosenLocation) {
            return;
        }

        let googleMapsEvent;
        const mapOverlayInstances = [];

        const apiOptions = {
            key: apiKey,
            v: '3'
        };
        const timeoutPool = []

        loadGoogleMapsApi(apiOptions)
            .then(googleMaps => {
                googleMapsEvent = googleMaps.event;

                const map = new googleMaps.Map(mapElement.current, {
                    ...mapOptions,
                    styles: [
                        ...((mapTheme === DARK_THEME) ? MAP_DARK_THEME : []),
                        ...(!!mapOptions.styles ? mapOptions.styles : [])
                    ]
                });
                const positions = [];

                let activeInfoWindow;

                locations.forEach((location) => {
                    const position = new googleMaps.LatLng(
                        location.position.latitude,
                        location.position.longitude
                    );
                    positions.push(position);

                    const isActive = center
                        ? (
                            (center.lat === location.position.latitude && center.lng === location.position.longitude)
                        )
                        : false

                    const marker = new googleMaps.Marker({
                        map,
                        position,
                        title: location.name,
                        animation: (
                            (isActive)
                                ? googleMaps.Animation.BOUNCE
                                : null
                        ),
                    }); //TODO: notify with a prop, do animation in customPing
                    if (isActive) {
                        timeoutPool.push(setTimeout(() => marker.setAnimation(null), 1000))

                    }

                    const infoWindow = new googleMaps.InfoWindow({
                        content: customPing ? customPing(location) : getLocationFormattedAsHtml(location),
                        maxWidth: 350
                    });

                    marker.addListener('click', () => {
                        // close other open info window if present
                        if (activeInfoWindow) {
                            activeInfoWindow.close();
                        }

                        infoWindow.open(map, marker);
                        activeInfoWindow = infoWindow;
                    });

                    mapOverlayInstances.push(marker);
                    mapOverlayInstances.push(infoWindow);
                });

                // set the bounds of the map to the perimeter of the furthest locations in either direction
                // enable this make setCenter not working

                // if (positions.length > 1) {
                //     const latitudeLongitudeBounds = new googleMaps.LatLngBounds();
                //
                //     positions.forEach(position => {
                //         latitudeLongitudeBounds.extend(position);
                //     });
                //
                //     map.fitBounds(latitudeLongitudeBounds);
                // }


                if (currentChosenLocation && customChosenLocationRadius) {
                    const chosenLocationCircleMarker = new googleMaps.Circle({
                        strokeColor: "#bb8082",
                        strokeOpacity: 0.8,
                        strokeWeight: 2,
                        fillColor: "#f39189",
                        // fillColor: "#7eca9c",

                        fillOpacity: 0.35,
                        map,
                        center: {
                            "lat": Number(currentChosenLocation.lat),
                            "lng": Number(currentChosenLocation.lng)
                        },
                        radius: customChosenLocationRadius, //in meter
                    });

                    const position = new googleMaps.LatLng(
                        Number(currentChosenLocation.lat),
                        Number(currentChosenLocation.lng)
                    );

                    positions.push(position);

                    mapOverlayInstances.push(chosenLocationCircleMarker)
                }


                //center to search location if exist
                if (currentChosenLocation && customChosenLocationRadius) {
                    map.setCenter(positions[positions.length - 1])
                    map.setZoom(zoom || mapDefaultProps.mapOptions.zoom);

                }
                // zoom to default zoom if there is only a single location
                else if (positions.length > 0 && center === null && centerIndex === null) {
                    map.setCenter(positions[0]);// TODO: center by changing position
                    map.setZoom(zoom || mapDefaultProps.mapOptions.zoom);
                } else if (center) {
                    map.setCenter(new googleMaps.LatLng(
                        center.lat,
                        center.lng
                    ));
                    map.setZoom(zoom || mapDefaultProps.mapOptions.zoom);
                } else if (centerIndex !== null && centerIndex >= 0 && centerIndex < positions.length) {
                    map.setCenter(positions[centerIndex])
                    map.setZoom(zoom || mapDefaultProps.mapOptions.zoom);
                } else {
                    map.setCenter(new google.maps.LatLng(10, -15)); //chicago
                    map.setZoom(zoom || mapDefaultProps.mapOptions.zoom);
                }
            })
            .catch(error => console.error(error));

        return () => {
            timeoutPool.forEach(timeout => {
                clearTimeout(timeout)
            })

            if (!googleMapsEvent) {
                return;
            }

            mapOverlayInstances.forEach(mapOverlayInstance => {
                googleMapsEvent.clearInstanceListeners(mapOverlayInstance);
            });
        };
    }, [
        apiKey, locations, mapOptions,
        center, centerIndex, zoom, mapTheme,
        currentChosenLocation,
        customChosenLocationRadius,
    ]);

    // If there are no locations configured, do not render the map
    // if (!locations.length) {
    //     return null;
    // }

    return (
        <>
            <div
                ref={mapElement}
                style={dynamicStyles}
                className={[classes.root, ...cssClasses].join(' ')}
            />
        </>
    );
};

/**
 * Props for {@link GoogleMap}
 *
 * @typedef props
 *
 * @property {Object} classes An object containing the class names for the Map
 * @property {String} classes.root CSS class for the root element
 * @property {String} apiKey API key for Maps API usage
 * @property {String} height CSS height property
 * @property {Object} mapOptions specific Google Maps API options for Map object instantiation
 * @property {Array} locations Locations on the map for Marker placement
 * @property {String} textAlign Alignment of content within the row
 * @property {String} border CSS border property
 * @property {String} borderColor CSS border color property
 * @property {String} borderWidth CSS border width property
 * @property {String} borderRadius CSS border radius property
 * @property {String} marginTop CSS margin top property
 * @property {String} marginRight CSS margin right property
 * @property {String} marginBottom CSS margin bottom property
 * @property {String} marginLeft CSS margin left property
 * @property {String} paddingTop CSS padding top property
 * @property {String} paddingRight CSS padding right property
 * @property {String} paddingBottom CSS padding bottom property
 * @property {String} paddingLeft CSS padding left property
 * @property {Array} cssClasses List of CSS classes to be applied to the component
 */
GoogleMap.propTypes = {
    classes: shape({
        root: string
    }),
    apiKey: string,
    height: string,
    mapOptions: shape({
        zoom: number,
        center: shape({
            lat: number,
            lng: number
        }),
        scrollwheel: bool,
        disableDoubleClickZoom: bool,
        disableDefaultUI: bool,
        mapTypeControl: bool,
        mapTypeControlStyle: shape({
            style: number
        })
    }),
    locations: arrayOf(
        shape({
            position: shape({
                latitude: number.isRequired | string.isRequired,
                longitude: number.isRequired | string.isRequired
            }),
            name: string,
            phone: string,
            address: string,
            city: string,
            state: string,
            zipcode: string,
            country: string,
            comment: string,
            styles: arrayOf(
                shape({
                    featureType: string,
                    elementType: string,
                    stylers: arrayOf(object)
                })
            )
        })
    ).isRequired,
    textAlign: string,
    border: string,
    borderColor: string,
    borderWidth: string,
    borderRadius: string,
    marginTop: string,
    marginRight: string,
    marginBottom: string,
    marginLeft: string,
    paddingTop: string,
    paddingRight: string,
    paddingBottom: string,
    cssClasses: arrayOf(string),
    currentChosenLocation: any,
    customPing: any,
    zoom: number,
    centerIndex: number,
    chosenStoreCustomPing: any,
    customChosenLocationRadius: number
};

GoogleMap.defaultProps = mapDefaultProps;

export default GoogleMap;