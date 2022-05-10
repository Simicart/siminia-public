import React, {useCallback, useEffect, useState} from 'react';
import {useStoreLocatorConfig} from "../talons/useStoreLocatorConfig";
import BodyContent from "../StoreFinder/StoreFindeBody";
import {useGlobalLoading} from "../talons/useGlobalLoading";
import RoundButton from "../components/RoundButton";
import { useWindowSize } from '@magento/peregrine';
import {LOWER_SMALL} from "../untils/breakpoints";
import RequiredInput from "../components/RequiredInput";
import WorkTimePicker from "../components/WorkTimePicker";

const GgMapPopup = (props) => {
    const _submitStorePickup = props ? props.submitStorePickup : null;
    const cancelShowStorePickup = props ? props.cancelShowStorePickup : null;
    const saveLocationLoading = props ? props.saveLocationLoading : false;
    const saveLocationError = props ? props.saveLocationError : null;

    const storePickupAddress = props ? props.storePickupAddress : null;
    const storePickupDate = props ? props.storePickupDate : null;
    const storePickupTime = props ? props.storePickupTime : null;

    const cartId = props ? props.cartId : null;

    const {loading, config} = useStoreLocatorConfig()
    const {setLoading, Component: LoadingComponent} = useGlobalLoading({
        initialLoading: true
    })
    const {innerWidth: width} = useWindowSize()
    const [chosenStoreId, setChosenStoreId] = useState('')
    const [chosenStoreAddress, setChosenStoreAddress] = useState(storePickupAddress)
    const [chosenDate, setChosenDate] = useState(storePickupDate)
    const [chosenStoreTime, setChosenStoreTime] = useState('')
    const [storeWorkingTime, setWorkingTime] = useState(storePickupTime)

    const [showError, setShowError] = useState(false)

    const setChosenStoreObject = (x) => {
        setChosenStoreAddress((!!x && x.address) || '')
        setChosenStoreId((!!x && x.id) || '')
        setWorkingTime(x.time)
    }

    useEffect(() => {
        if (loading || saveLocationLoading) {
            setLoading(true)
        } else {
            setLoading(false)
        }
    }, [loading, saveLocationLoading])


    const submitStorePickup = useCallback(() => {
        if (chosenStoreAddress !== '' && chosenDate !== '' && chosenStoreTime !== '') {
            _submitStorePickup({
                address: chosenStoreAddress.toString(),
                date: chosenDate.toString(),
                id: chosenStoreId,
                time: chosenStoreTime
            })
        } else {
            setShowError(true)
        }
    }, [_submitStorePickup, chosenDate, chosenStoreAddress, chosenStoreTime, chosenStoreId])


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
            <LoadingComponent/>

            <div style={{
                marginTop: 40,
                marginBottom: 20,
                marginLeft: 30,
                marginRight: 30
            }}>
                <div style={{
                    display: width > LOWER_SMALL ? "flex" : 'block',
                    flexDirection: "row",
                    marginBottom: 20
                }}>
                    <div style={{flex: 1, marginBottom: width > LOWER_SMALL ? 0 : 15,}}>
                        <h2 style={{fontSize: 40, fontWeight: "500"}}>Store Pickup</h2>
                    </div>

                    <div style={{
                        flex: 2,
                        display: "flex",
                        justifyContent: width > LOWER_SMALL ? "flex-end" : 'flex-start'
                    }}>
                        <RoundButton onClick={submitStorePickup}
                                     title={'Submit'}
                        />
                        <div style={{width: 20}}/>
                        <RoundButton onClick={cancelShowStorePickup}
                                     title={'Cancel'}
                        />
                    </div>
                </div>

                <div style={{marginBottom: 5}}>
                    <RequiredInput title={'Store Address'}
                                   handleChange={setChosenStoreAddress}
                                   value={chosenStoreAddress}
                                   readOnly={true}
                    />
                    <RequiredInput title={'Pickup Date'}
                                   handleChange={setChosenDate}
                                   value={chosenDate}
                                   isDate={true}
                    />

                    <WorkTimePicker
                        title={'Pickup Time'}
                        handleChange={setChosenStoreTime}
                        value={storeWorkingTime}
                        hidden={!chosenDate || !chosenStoreAddress}
                        locationId={chosenStoreId}
                        chosenDate={chosenDate}
                    />


                    {showError && (
                        <h3 style={{
                            color: "#c64756",
                            marginTop: 5,
                            marginBottom: 10
                        }}>Please fill in all the fields</h3>
                    )}

                </div>

                {!!saveLocationError && (
                    <div style={{
                        backgroundColor: '#c64756',
                        marginTop: 15,
                        marginBottom: 25,
                        paddingTop: 10,
                        paddingBottom: 10,
                        paddingLeft: 10,
                        paddingRight: 10
                    }}>
                        <h3 style={{
                            color: 'white',
                            fontWeight: "bold"
                        }}>Some error happened! Please try again</h3>
                    </div>
                )}

                <BodyContent config={config}
                             loading={loading}
                             handleChosenStore={setChosenStoreObject}
                             cartId={cartId}

                />
            </div>
        </div>
    );
};

export default GgMapPopup;