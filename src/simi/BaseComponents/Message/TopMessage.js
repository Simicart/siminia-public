
import React from 'react'
import defaultClasses from './style.css'
import Identify from "src/simi/Helper/Identify";
import ErrorIcon from 'src/simi/BaseComponents/Icon/Error'
import Success from 'src/simi/BaseComponents/Icon/Success'
import WarningIcon from 'src/simi/BaseComponents/Icon/Warning'
import CloseIcon from 'src/simi/BaseComponents/Icon/TapitaIcons/Close'
import {
    toggleMessages
} from 'src/simi/Redux/actions/simiactions';
import { compose } from 'redux';
import { connect } from 'src/drivers';
import classify from 'src/classify';

class TopMessage extends React.Component {

    removeMessage = (id) => {
        const {simiMessages} = this.props
        if (simiMessages && simiMessages.length) {
            const newMsgs = []
            simiMessages.map((item, index) => {
                if (index !== id) {
                    newMsgs.push(item)
                }
            })
            this.props.toggleMessages(newMsgs)
        }
    }

    renderMsg = (msg, id) => {
        const {classes} = this.props
        let data = {
            className : classes['message-warning'],
            label : 'Warning',
            text : msg.message,
            iconColor: '#333132',
            icon : <WarningIcon color="#333132"/>
        }
        if(msg.type === 'success'){
            data = {
                className : classes['message-success'],
                label : 'Success',
                text : msg.message,
                iconColor: '#0F7D37',
                icon : <Success color="#0F7D37"/>
            }
        }else if(msg.type === 'error'){
            data = {
                className : classes['message-error'],
                label : 'Error',
                text : msg.message,
                iconColor: '#FA0A11',
                icon : <ErrorIcon color="#FA0A11"/>
            }
        }else if(msg.type === 'logout_msg'){
            data = {
                className : classes['message-success'],
                label : '',
                text : msg.message,
                iconColor: '#0F7D37',
                icon : <Success color="#0F7D37"/>
            }
        }
        return(
            <div className={`${classes['message']} ${data.className ? data.className : '' }`} key={id}>
                <div className={classes['message-content']}>
                    {data.icon && (
                        <div className={classes["msg-icon"]}>{data.icon}</div>
                    )}
                    <strong>{Identify.__(data.label)}!</strong>
                    <div className={classes["msg-text"]}>
                        <span>{Identify.__(data.text)}</span>
                    </div>
                </div>
                <div role="presentation" className={classes["msg-close"]} onClick={() => this.removeMessage(id)}>
                    <CloseIcon style={{fill: data.iconColor, width: 12, height: 12}}/>
                </div>
            </div>
        )
    }

    autoDismiss(simiMessages) {
        const { toggleMessages } = this.props
        let reload = false
        const newMessages = []
        simiMessages.forEach(simiMessage => {
            if (simiMessage.auto_dismiss) {
                reload = true
            } else {
                newMessages.push(simiMessage)
            }
        });
        if (reload) {
            toggleMessages(newMessages)
        }
    }

    renderMsgs = (simiMessages) => {
        const obj = this
        setTimeout(function () {
            obj.autoDismiss(simiMessages)
        }, 3000);
        return simiMessages.map((msg, id) => {
            return this.renderMsg(msg, id)
        }, this)
    }

    componentWillMount() {
        const { toggleMessages, history } = this.props
        if (history)
            this.unlisten = history.listen((location, action) => {
                if (toggleMessages)
                    toggleMessages([])
            });
    }

    componentWillUnmount() {
        if (this.unlisten)
            this.unlisten();
    }

    render() {
        const {simiMessages} = this.props || null
        if(!simiMessages || !simiMessages.length) return null;
        return (
            <div className="container">
                {this.renderMsgs(simiMessages)}
            </div>
        );
    }
}

const mapStateToProps = state => {
    const { simireducers } = state;
    const { simiMessages } = simireducers;
    return {
        simiMessages
    };
};

const mapDispatchToProps = {
    toggleMessages
};

export default compose(
    classify(defaultClasses),
    connect(
        mapStateToProps,
        mapDispatchToProps
    )
)(TopMessage);
