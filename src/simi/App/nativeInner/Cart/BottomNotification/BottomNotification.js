import React from 'react';
import {useStyle} from '@magento/venia-ui/lib/classify';
import defaultClass from './BottomNotification.module.css'
import {bottomNotificationType} from "../bottomNotificationHook";

export const BottomNotification = (props) => {
    const {text = '', icon, type, forwardRef} = props
    const classes = useStyle(defaultClass, props.classes)

    const isSuccess = type === bottomNotificationType.SUCCESS

    return (
        <div className={classes.notificationContainer} ref={forwardRef}>
            <div className={isSuccess ? classes.successContainer : classes.failContainer}>
                <div className={classes.innerContainer}>
                    <div className={classes.iconContainer}>
                        {icon}
                    </div>
                    <h3 className={classes.text}>{text}</h3>
                </div>
            </div>
        </div>
    );
};

