import React from 'react';
import { useStyle } from '@magento/venia-ui/lib/classify';
import defaultClass from './BottomNotification.module.css';
import { bottomNotificationType } from '../bottomNotificationHook';
import { useIntl } from 'react-intl';

export const BottomNotification = props => {
    const { text = '', icon, type, forwardRef } = props;
    const classes = useStyle(defaultClass, props.classes);
    const { formatMessage } = useIntl();

    const isSuccess = type === bottomNotificationType.SUCCESS;

    return (
        <div className={classes.notificationContainer} ref={forwardRef}>
            <div
                className={
                    isSuccess ? classes.successContainer : classes.failContainer
                }
            >
                <div className={classes.innerContainer}>
                    <div className={classes.iconContainer}>{icon}</div>
                    <h3 className={classes.text}>
                        {/* {text} */}

                        {formatMessage({
                            id: 'Failed to apply coupon code',
                            defaultMessage: `${text}`
                        })}
                    </h3>
                </div>
            </div>
        </div>
    );
};
