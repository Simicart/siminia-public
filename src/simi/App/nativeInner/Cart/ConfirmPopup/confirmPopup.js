import React from 'react';
import Popup from 'reactjs-popup';
import defaultClasses from './confirmPopup.module.css'
    ;
import {useStyle} from "@magento/venia-ui/lib/classify";
import {RectButton} from "../RectButton";
import {RectOutlineButton} from "../RectButton/RectOutlineButton";

export const ConfirmPopup = (props) => {
    const {
        isOpen = true,
        children,
        trigger,
        content,
        confirmCallback,
        cancelCallback
    } = props

    const classes = useStyle(defaultClasses, props.classes)

    return (
        <Popup trigger={trigger}
               modal={true}
               overlayStyle={{
                   backgroundColor: 'rgba(0, 0, 0, 0.5)',
                   cursor: 'pointer'
               }}
               position="top center"
        >
            {close => (
                <div className={classes.modal}>
                    <div className={classes.closeContainer}>
                        <button className={classes.close} onClick={close}>&times;</button>
                    </div>
                    <div className={classes.content}>
                        {content}
                    </div>
                    <div className={classes.actionWrapper}>
                        <div className={classes.actions}>
                            <RectOutlineButton
                                classes={classes.cancelButton}
                                onClick={() => {
                                    cancelCallback ? cancelCallback() : null
                                    close();
                                }}>Cancel</RectOutlineButton>

                            <RectButton
                                classes={classes.confirmButton}
                                onClick={() => {
                                    confirmCallback ? confirmCallback() : null
                                    close();
                                }}>OK</RectButton>
                        </div>
                    </div>
                </div>
            )}
        </Popup>
    );
};

