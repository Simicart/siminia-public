import React, {useState} from "react";
import {useWindowDimensions} from "./useWindowDimension";
import { configColor } from 'src/simi/Config';

export const PopupAlert = (props) => {
    const [inputValue, setInputValue] = useState('')
    const [error, setError] = useState(null)
    const isVisible = props ? props.showPopup : null
    const setShowPopup = props ? props.setShowPopup : null
    const popupData = props ? props.popupData : null
    const isMobileSize = window.innerWidth < 780

    const {width} = useWindowDimensions()


    if (!popupData || !isVisible) {
        return (
            <div/>
        )
    }

    const {
        heading_text,
        button_text,
        place_holder,
        description,
        footer_content,
        callback,
    } = popupData

    const handleSubmit = () => {
        //TODO: validate email, set error
        const emailPattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        if (emailPattern.test(inputValue)) {
            callback(inputValue)
            setError(null)
            setInputValue('')
            setShowPopup(false)
        } else {
            setError('Invalid email format')
        }
    }


    return (
        <>
            <div style={{
                position: 'fixed', /* Stay in place */
                zIndex: 10, /* Sit on top */
                left: 0,
                top: 0,
                width: '100%', /* Full width */
                height: '100%', /* Full height */
                overflow: 'auto', /* Enable scroll if needed */
                backgroundColor: '#33333365', /* Fallback color */
            }}>
                <div style={{
                    backgroundColor: 'white',
                    verticalAlign: "middle",
                    width: width > 800 ? width / 2.5 : (width > 650 ? width / 2 : width / 1.2),
                    marginLeft: "auto",
                    marginRight: "auto",
                    marginTop: !isMobileSize ? 240 : 80,
                    paddingLeft: 50,
                    paddingRight: 50,
                    paddingBottom: 50,
                    paddingTop: 10,
                    borderRadius: 6,
                }}>
                    <button style={{
                        color: 'gray',
                        fontSize: 22,
                        paddingBottom: 20,
                        marginLeft: width > 800 ? width / 2.5 - 70 : (width > 650 ? width / 2 - 80 : width / 1.2 - 80)
                    }}
                            onClick={() => setShowPopup && setShowPopup(false)}
                    >x
                    </button>
                    <h3 style={{
                        fontWeight: 600,
                        marginTop: 3,
                        marginBottom: 10,
                        fontSize: 22
                    }}>
                        {heading_text}
                    </h3>

                    <h4 style={{
                        fontWeight: 400,
                        marginTop: 10,
                        marginBottom: 30,
                        fontSize: 16
                    }}>
                        {description}
                    </h4>

                    <div style={{
                        marginLeft: 15,
                        marginRight: 15,
                        marginBottom: 20
                    }}>
                        <div>
                            <input onChange={event => setInputValue(event.target.value)}
                                   value={inputValue}
                                   placeholder={place_holder}
                                   style={{
                                       borderRadius: 1,
                                       height: 40,
                                       paddingTop: 3,
                                       paddingBottom: 3,
                                       paddingLeft: 10,
                                       boxSizing: 'border-box',
                                       width: '100%',
                                       border: '1px solid #c2c2c2'
                                   }}
                            />
                        </div>
                        {!!error && (
                            <div style={{
                                marginTop: 3,
                                marginBottom: 5
                            }}>
                                <h3 style={{
                                    color: 'red',
                                    fontSize: 15
                                }}>
                                    {error}
                                </h3>
                            </div>
                        )}
                        <button onClick={handleSubmit}
                                style={{
                                    backgroundColor:  configColor.button_background,
                                    color: configColor.button_text_color,
                                    border: '1px solid #1979c3',
                                    fontWeight: 800,
                                    width: '100%',
                                    marginTop: 20,
                                    padding: '5px 5px 5px 5px'
                                }}
                        >
                            {button_text}
                        </button>
                    </div>
                    <h4 style={{
                        fontWeight: 400,
                        marginTop: 10,
                        fontSize: 16
                    }}>
                        {footer_content}
                    </h4>
                </div>
            </div>
        </>
    )
}