import React from "react";

export const InsightMessage = (props) => {
    const message = props ? props.message : null;
    const messageType = props ? props.messageType : null;
    const shouldHaveMargin = props ? (props.shouldHaveMargin === undefined ? true : props.shouldHaveMargin) : true;


    if (!message || !messageType) {
        return (
            <div/>
        )
    }
    const isSuccess = (messageType === 'Success')
    const source = isSuccess
        ? "//upload.wikimedia.org/wikipedia/commons/thumb/7/73/Flat_tick_icon.svg/512px-Flat_tick_icon.svg.png"
        // : 'https://www.flaticon.com/svg/vstatic/svg/1632/1632708.svg?token=exp=1614222678~hmac=57a7ac6033f83ed28c4b2adfb7056976'
        : 'https://upload.wikimedia.org/wikipedia/commons/c/cb/DIN_4844-2_Warnung_vor_einer_Gefahrenstelle_D-W000.svg'

    return (
        <div style={{
            display: "flex",
            flexDirection: "row",
            marginTop: 20,
            marginBottom: 10,
            marginLeft: shouldHaveMargin ? 20 : 0,
            marginRight: 20,
            backgroundColor: isSuccess ? '#e5efe5' : '#fdf0d5',
            paddingLeft: 10,
            paddingTop: 10,
            paddingBottom: 10
        }}>
            <img
                src={source}
                style={{width: 18, height: 18, marginRight: 10}}
            />
            <h4 style={{
                color: isSuccess ? "#006400" : '#6f4400'
            }}>
                {message}
            </h4>
        </div>
    )
}