import React from 'react';
import { BiCheckCircle, BiErrorCircle, BiError } from 'react-icons/bi';

require('./styles.scss');

const AlertMessages = props => {
    const { message, status, alertMsg, setAlertMsg } = props;
    setTimeout(() => {
        if(alertMsg !== -1) {

            setAlertMsg(false);
        }
    }, 2000);
    const handleSetClass = s => {
        if (s === -1) {
            return 'null';
        } else if (!s) {
            return 'close';
        } else return 'open';
    };
    const handleRenderIcon = (status) => {
        if (status == "success"){
            return <BiCheckCircle />
        } 
        if (status == "error") {
            return <BiErrorCircle />
        }
        if(status == "warning") {
            return <BiError />
        }
    }

    return (
        <div className={`main-alert ${handleSetClass(alertMsg)} ${status}`}>
            {handleRenderIcon(status)}
            <h1>{message}</h1>
        </div>
    );
};

export default AlertMessages;
