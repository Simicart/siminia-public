import React, { Fragment, Suspense, useRef, useState } from 'react';
import { useIntl } from 'react-intl';
require('./statusBar.scss');

const arr = ['Ready to Ship', 'Fast Dispatch', 'In Stock'];
const StatusBar = props => {
    const { position } = props;
    const mainPosition = 100 - position + 1;
    const { formatMessage } = useIntl();

    return (
        <div style={{ top: `${mainPosition}%` }} className="main-status-bar">
            {arr.map((item, index) => {
                return (
                    <p
                        key={index}
                        className={index === 0 ? 'first-item' : 'nth-item'}
                    >
                        {formatMessage({
                            id: `${item}`,
                            default: `${item}`
                        })}
                    </p>
                );
            })}
        </div>
    );
};

export default StatusBar;
