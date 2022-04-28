import React from 'react';
import { AlertTableEntry } from './AlertTableEntry';
import AlertTableEntryMb from './AlertTableEntryMb';
export const AlertTable = props => {
    const title = props ? props.title : '';
    const data = props ? props.data : null;
    const reInitialize = props ? props.reInitialize : null;
    const setLoading = props ? props.setLoading : null;
    const { isMobileSite } = props;

    const items = data ? data.items : [];

    return (
        <div style={{}}>
            <div
                style={{
                    marginTop: 15,
                    marginBottom: 10
                }}
            >
                { !!title &&  (
                    <h3
                        style={{
                            fontSize: 20,
                            marginLeft: 10
                        }}
                    >
                        {title}
                    </h3>
                )}
            </div>

            {!isMobileSite ? (
                <div>
                    <table style={{}}>
                        <thead style={{}}>
                            <th
                                scope={'col'}
                                style={{ padding: '11px 10px', minWidth: 170 }}
                            />
                            <th
                                scope={'col'}
                                style={{ padding: '11px 10px', minWidth: 250 }}
                            >
                                Product Name
                            </th>
                            <th scope={'col'} style={{ padding: '11px 10px' }}>
                                Alert Status
                            </th>
                            <th
                                scope={'col'}
                                style={{ padding: '11px 10px', minWidth: 250 }}
                            >
                                Subscribed On
                            </th>
                            <th scope={'col'} style={{ padding: '11px 10px' }}>
                                Action
                            </th>
                        </thead>

                        {!!data && (
                            <tbody style={{}}>
                                {items.map(sub => {
                                    return (
                                        <AlertTableEntry
                                            data={sub}
                                            key={sub.product_id}
                                            reInitialize={reInitialize}
                                            setLoading={setLoading}
                                        />
                                    );
                                })}
                            </tbody>
                        )}
                    </table>
                </div>
            ) : (
                !!data && (
                    <div style={{padding: '0px 10px'}}>
                        {items.map(sub => {
                            return (
                                <AlertTableEntryMb
                                    data={sub}
                                    key={sub.product_id}
                                    reInitialize={reInitialize}
                                    setLoading={setLoading}
                                />
                            );
                        })}
                    </div>
                )
            )}
        </div>
    );
};
