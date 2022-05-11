import React from 'react';
import { gql, useQuery } from '@apollo/client';
import { md_hash } from '../untils/md_hash';

const storeLocationConfigQuery = gql`
    query {
        MpStoreLocatorConfig {
            locationsData {
                holidayData {
                    from
                    to
                }
                locationId
                timeData {
                    from
                    to
                    use_system_config
                    value
                }
            }
        }
    }
`;

const WorkTimePicker = props => {
    const title = props ? props.title : 'null';
    const handleChange = props ? props.handleChange : () => null;
    const value = props ? props.value : '';
    const hidden = props ? props.hidden : false;
    const locationId = props ? props.locationId : '0';
    const chosenDate = props ? props.chosenDate : null;

    const { data, loading } = useQuery(storeLocationConfigQuery, {
        fetchPolicy: 'no-cache'
    });

    if (loading && !data) {
        return <h3>Loading</h3>;
    }

    if (hidden || !data) {
        return <div />;
    }

    const currentTime = new Date(chosenDate);

    const locationPiece = data
        ? data.MpStoreLocatorConfig.locationsData.filter(
              x => x.locationId.toString() === locationId.toString()
          )
        : null;

    const timeData =
        locationPiece && locationPiece.length > 0
            ? locationPiece[0].timeData
            : null;

    const todayTime = timeData ? timeData[currentTime.getDay()] : null;

    const timeList =
        (currentTime
            ? (() => {
                  if (todayTime === null || todayTime.value === '0') {
                      return null;
                  } else {
                      const from = new Date(
                          currentTime.getUTCFullYear(),
                          currentTime.getUTCMonth(),
                          currentTime.getUTCDay(),
                          Number.parseInt(todayTime.from[0]),
                          Number.parseInt(todayTime.from[1]),
                          0,
                          0
                      );

                      const to = new Date(
                          currentTime.getUTCFullYear(),
                          currentTime.getUTCMonth(),
                          currentTime.getUTCDay(),
                          Number.parseInt(todayTime.to[0]),
                          Number.parseInt(todayTime.to[1]),
                          0,
                          0
                      );

                      if (from >= to) {
                          return null;
                      }

                      const final = [];

                      let startTime = from.getHours();
                      let endTime = startTime + 1;

                      for (
                          let i = 0;
                          startTime + i < to.getHours() && i < 30;
                          i++
                      ) {
                          endTime = startTime + i + 1;
                          if (endTime <= to.getHours()) {
                              final.push(
                                  (startTime + i).toString().padStart(2, '0') +
                                      ':' +
                                      from
                                          .getMinutes()
                                          .toString()
                                          .padStart(2, '0') +
                                      ' - ' +
                                      endTime.toString().padStart(2, '0') +
                                      ':' +
                                      from
                                          .getMinutes()
                                          .toString()
                                          .padStart(2, '0')
                              );
                          }
                      }
                      return final;
                  }
              })()
            : null) || [];

    const mainInput =
        timeList && timeList.length > 0 ? (
            <select
                style={{
                    fontSize: 18,
                    paddingLeft: 5,
                    paddingRight: 5,
                    paddingTop: 5,
                    paddingBottom: 5
                }}
                onChange={e => {
                    handleChange(e.target.value);
                }}
            >
                <option value={''} hidden={true} />
                {timeList.map((x, index) => {
                    return (
                        <option key={md_hash(x)} value={x}>
                            {x}
                        </option>
                    );
                })}
            </select>
        ) : (
            <div style={{ marginTop: 5, marginBottom: 5 }}>
                <h3 style={{ color: '#c64756' }}>
                    No available time on this day. Please choose another one.
                </h3>
            </div>
        );

    return (
        <div
            style={{
                display: 'flex',
                flexDirection: 'column',
                marginBottom: 7
            }}
        >
            <label style={{ fontSize: 20, marginBottom: 5 }}>
                {title}
                <span style={{ color: '#c15050' }}> *</span>
            </label>
            {mainInput}
        </div>
    );
};

export default WorkTimePicker;