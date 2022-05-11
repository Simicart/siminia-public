import React from 'react';
import { LARGE, UPPER_MEDIUM } from '../../untils/breakpoints';
import { rotateRight } from '../../untils/rotateRight';

const DAYS_OF_WEEK = [
    'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'
]

const StoreCard = props => {
    const location_id = props ? props.location_id : null;
    const name = props ? props.name : '';
    const street = props ? props.street : '';
    const city = props ? props.city : '';
    const countryId = props ? props.country : '';
    const telephone_1 = props ? props.phone_one : null;
    const telephone_2 = props ? props.phone_two : null;
    const upload_default_image = props ? props.upload_default_image : null;

    const region = props ? props.state_province : '';
    const config = props ? props.config : {};
    const email = props ? props.email : null;

    const url_key = config ? config.url_key : null;
    const website = config ? config.website : null;

    const configTelephone = config ? config.telephone : null;

    const telephone = telephone_1 || telephone_2 || configTelephone || '';

    const timeData = config ? config.timeData : null; // array?

    const handlePress = props ? props.handlePress : null;
    const handleDetailPress = props ? props.handleDetailPress : null;

    const currentTime = new Date(Date.now());

    const _holidayData = (config ? config.holidayData : null) || [];

    const parsedHoliday = _holidayData.map(x => {
        const { from, to } = x;
        return {
            from: new Date(from),
            to: new Date(to)
        };
    });

    const { innerWidth: width } = useWindowDimensions();

    let image = upload_default_image;
    if (props && props.images) {
        try {
            const imagesObject = JSON.parse(props.images);
            if (imagesObject && imagesObject.length > 0) {
                image = imagesObject[0].file;
            }
        } catch (e) {
            console.warn('Error parsing images in store');
        }
    }

    const thisWeekTime = timeData
        ? rotateRight(timeData).map((x, index) => {
              const expectedDate = {
                  day: DAYS_OF_WEEK[index],
                  from: new Date(
                      currentTime.getUTCFullYear(),
                      currentTime.getUTCMonth(),
                      currentTime.getUTCDay(),
                      Number.parseInt(x.from[0]),
                      Number.parseInt(x.from[1]),
                      0,
                      0
                  ),
                  to: new Date(
                      currentTime.getUTCFullYear(),
                      currentTime.getUTCMonth(),
                      currentTime.getUTCDay(),
                      Number.parseInt(x.to[0]),
                      Number.parseInt(x.to[1]),
                      0,
                      0
                  ),
                  isWork: x.value === '1',
                  isHoliday: false
              };

              const validity = parsedHoliday.reduce((prevValidity, holiday) => {
                  if (
                      (holiday.from <= expectedDate.from &&
                          holiday.to > expectedDate.from) ||
                      (holiday.from <= expectedDate.to &&
                          holiday.to > expectedDate.to)
                  ) {
                      return false;
                  }
                  return prevValidity;
              }, true);

              if (validity) {
                  return expectedDate;
              } else {
                  return Object.assign(expectedDate, { isHoliday: true });
              }
          })
        : null;

    const todayConstrain = thisWeekTime
        ? thisWeekTime[currentTime.getDay() - 1]
        : null;

    const currentTimeDisplayTemplate = (() => {
        // if (!todayConstrain) {
        //     return ''
        // }

        // if (todayConstrain.isHoliday) {
        //     return 'holiday'
        // }
        // if (!todayConstrain.isWork) {
        //     return 'not working today'
        // }

        // if (currentTime.getTime() >= todayConstrain.from.getTime() && currentTime.getTime() <= todayConstrain.to.getTime()) {
        //     return `Open now ${todayConstrain.from.getHours().toString().padStart(2, '0')}:${todayConstrain.from.getMinutes().toString().padStart(2, '0')} : ` +
        //         `${todayConstrain.to.getHours().toString().padStart(2, '0')}:${todayConstrain.to.getMinutes().toString().padStart(2, '0')}`
        // }

        const timeRange =
            !!timeData && !!timeData[0]
                ? {
                      from: new Date(
                          currentTime.getUTCFullYear(),
                          currentTime.getUTCMonth(),
                          currentTime.getUTCDay(),
                          Number.parseInt(timeData[0].from[0]),
                          Number.parseInt(timeData[0].from[1]),
                          0,
                          0
                      ),
                      to: new Date(
                          currentTime.getUTCFullYear(),
                          currentTime.getUTCMonth(),
                          currentTime.getUTCDay(),
                          Number.parseInt(timeData[0].to[0]),
                          Number.parseInt(timeData[0].to[1]),
                          0,
                          0
                      )
                  }
                : null;

        return (currentTime >= timeRange.from && currentTime <= timeRange.to) ||
            true
            ? `Open now ${timeData[0].from[0]}:${timeData[0].from[1]} : ${
                  timeData[0].to[0]
              }:${timeData[0].to[1]}`
            : `Open at ${timeData[0].from[0]}:${timeData[0].from[1]}`;
        // return `Open at ${todayConstrain.from
        //     .getHours()
        //     .toString()
        //     .padStart(2, '0')}:${todayConstrain.from
        //     .getMinutes()
        //     .toString()
        //     .padStart(2, '0')}`;
    })();

    const timeRange =
        !!timeData && !!timeData[0]
            ? {
                  from: new Date(
                      currentTime.getUTCFullYear(),
                      currentTime.getUTCMonth(),
                      currentTime.getUTCDay(),
                      Number.parseInt(timeData[0].from[0]),
                      Number.parseInt(timeData[0].from[1]),
                      0,
                      0
                  ),
                  to: new Date(
                      currentTime.getUTCFullYear(),
                      currentTime.getUTCMonth(),
                      currentTime.getUTCDay(),
                      Number.parseInt(timeData[0].to[0]),
                      Number.parseInt(timeData[0].to[1]),
                      0,
                      0
                  )
              }
            : null;
            
    const timeDisplayTemplate = timeRange
        ? currentTime >= timeRange.from && currentTime <= timeRange.to
            ? `Open now ${timeData[0].from[0]}:${timeData[0].from[1]} : ${
                  timeData[0].to[0]
              }:${timeData[0].to[1]}`
            : `Open at ${timeData[0].from[0]}:${timeData[0].from[1]}`
        : '';

    const timeSimpleTemplate = timeDisplayTemplate
        ? `${timeData[0].from[0]}:${timeData[0].from[1]} : ${
              timeData[0].to[0]
          }:${timeData[0].to[1]}`
        : '';

    const addressSummary = `${street} ${region} ${city} ${countryId}`;

    return (
        <>
            <a
                onClick={e => {
                    handlePress(addressSummary, thisWeekTime);
                }}
                style={{
                    cursor: 'pointer'
                }}
            >
                <div
                    style={{
                        backgroundColor: 'white',
                        width: width > 880 ? '19.5rem' : '15rem',
                        marginTop: width > 880 ? 10 : 5,
                        marginBottom: width > 880 ? 10 : 10,
                        paddingTop: width > 880 ? 20 : 10,
                        paddingBottom: width > 880 ? 10 : 8,
                        paddingLeft: width > 880 ? 12 : 6,
                        paddingRight: width > 880 ? 10 : 6
                    }}
                >
                    {/*<h3>{JSON.stringify(currentTimeDisplayTemplate || '', null, 2)}</h3>*/}
                    <div
                        style={{
                            display: 'flex',
                            flexDirection: 'row',
                            marginBottom: 7
                        }}
                    >
                        <div
                            style={{
                                flex: 2,
                                paddingRight: width > 880 ? 14 : 10
                            }}
                        >
                            <img
                                src={image}
                                alt={'An img'}
                                style={{
                                    maxWidth: 90,
                                    maxHeight: 90,
                                    marginTop: 3
                                }}
                            />
                        </div>

                        <div style={{ flex: 5, marginRight: 3 }}>
                            <h3
                                style={{
                                    marginBottom: 7,
                                    fontSize:
                                        width > LARGE
                                            ? 20
                                            : width > UPPER_MEDIUM
                                            ? 19
                                            : 17,
                                    fontWeight: 'bold'
                                }}
                            >
                                {name}
                            </h3>

                            <h4
                                style={{
                                    color: '#555',
                                    fontSize:
                                        width > LARGE
                                            ? 18
                                            : width > UPPER_MEDIUM
                                            ? 16
                                            : 14,
                                    marginBottom: 10
                                }}
                            >
                                {addressSummary}
                            </h4>

                            <h4
                                style={{
                                    color: '#555',
                                    fontSize:
                                        width > LARGE
                                            ? 16
                                            : width > UPPER_MEDIUM
                                            ? 14
                                            : 12,
                                    lineHeight: '20px',
                                    marginBottom: 10
                                }}
                            >
                                {currentTimeDisplayTemplate}
                            </h4>

                            {!!telephone && telephone !== '0' && (
                                <h4
                                    style={{
                                        color: '#555',
                                        fontSize:
                                            width > LARGE
                                                ? 18
                                                : width > UPPER_MEDIUM
                                                ? 16
                                                : 14,
                                        marginBottom: width > 880 ? 10 : 5
                                    }}
                                >
                                    {telephone}
                                </h4>
                            )}
                        </div>
                    </div>

                    <div style={{ border: '0.25px solid #00000030' }} />

                    <div
                        style={{
                            marginTop: width > UPPER_MEDIUM ? 7 : 5
                        }}
                    >
                        <button
                            onClick={event => {
                                event.stopPropagation();
                                handleDetailPress({
                                    name: name,
                                    street: street,
                                    city: city,
                                    region: region,
                                    countryId: countryId,
                                    timeDisplayTemplate: currentTimeDisplayTemplate,
                                    timeSimpleTemplate: timeSimpleTemplate,
                                    telephone: telephone,
                                    telephone_2:
                                        telephone !== telephone_2 &&
                                        telephone_2 !== '0'
                                            ? telephone_2
                                            : telephone !== configTelephone &&
                                              configTelephone !== '0'
                                            ? configTelephone
                                            : null,
                                    email: email,
                                    img: image,
                                    startTime: timeData
                                        ? new Date(
                                              0,
                                              0,
                                              0,
                                              timeData[0].from[0],
                                              timeData[0].from[1],
                                              0
                                          )
                                        : null,
                                    endTime: timeData
                                        ? new Date(
                                              0,
                                              0,
                                              0,
                                              timeData[0].to[0],
                                              timeData[0].to[1],
                                              0
                                          )
                                        : null
                                });
                            }}
                        >
                            <h3
                                style={{
                                    color: '#55555590',
                                    fontWeight: 'bold',
                                    fontSize:
                                        width > LARGE
                                            ? 19
                                            : width > UPPER_MEDIUM
                                            ? 17
                                            : 15
                                }}
                            >
                                Details +
                            </h3>
                        </button>
                    </div>
                </div>
            </a>
        </>
    );
};

export default StoreCard;