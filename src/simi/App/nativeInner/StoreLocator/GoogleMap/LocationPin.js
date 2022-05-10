const LocationPin = (props) => {
    const street = props ? props.street : '';
    const name = props ? props.name : '';
    const region = props ? props.region : '';
    const city = props ? props.city : '';
    const countryId = props ? props.countryId : '';
    const phone = props ? props.phone : '';
    const pinImage = props ? props.pinImage : null;

    const timeData = props ? props.timeData : null; // array?
    // const configTimeData = config?:null
    const currentTime = new Date(Date.now());

    const timeRange = (!!timeData && !!timeData[0]) ? {
        from: new Date(currentTime.getUTCFullYear(),
            currentTime.getUTCMonth(),
            currentTime.getUTCDay(),
            Number.parseInt(timeData[0].from[0]),
            Number.parseInt(timeData[0].from[1]),
            0,
            0
        ),
        to: new Date(currentTime.getUTCFullYear(),
            currentTime.getUTCMonth(),
            currentTime.getUTCDay(),
            Number.parseInt(timeData[0].to[0]),
            Number.parseInt(timeData[0].to[1]),
            0,
            0
        )
    } : null;

    //TODO: Change correct time format (currently 15PM)
    const timeDisplayTemplate = timeRange ? (
        (currentTime >= timeRange.from && currentTime <= timeRange.to || true)
            ? `Open now ${timeData[0].from[0]}:${timeData[0].from[1]} : ${timeData[0].to[0]}:${timeData[0].to[1]}`
            : `Open at ${timeData[0].from[0]}:${timeData[0].from[1]}`
    ) : ''

    return `
        <div className="map-popup">
            <div style="display: flex; flex-direction: row;">
                <div style="padding-right: 14px">
                    <img src=${pinImage}
                        alt='An img'
                        style="
                          width: 30px;
                          height: 30px;
                          display: block;
                          margin-top: 3px;
                        "
                    />
                </div>
                <div style="flex: 4; margin-right: 3px">
                    <a href='#'>
                        <h3 style="
                            margin-bottom: 3px;
                            font-size: 19px;
                            font-weight: bold;
                        ">
                            ${name}
                        </h3>
                        <h4 style="
                            color: #555;
                            font-size: 16px;
                            margin-bottom: 5px;
                        ">
                            ${street || ''} ${region || ''} ${city || ''} ${countryId || ''}
                        </h4>
                        <h4 style="
                            color: #555;
                            font-size: 16px;
                            margin-bottom: 5px;
                        ">
                            ${timeDisplayTemplate || ''}
                        </h4>
                        <h4 style="
                            color: #555;
                            font-size: 16px;
                            margin-bottom: 5px;
                        ">${phone || ''}</h4>
                    </a>
                </div>
            </div>
        </div>
    `
};

export default LocationPin;