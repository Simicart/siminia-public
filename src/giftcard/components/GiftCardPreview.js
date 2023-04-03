import Modal from 'react-modal';
import React from "react";
import { X } from 'react-feather'
import { FormattedMessage } from 'react-intl' 

const GiftCardPreview = ({ open, setShowPreview, template, senderName, recipientName, message, codeColor, messageColor, value }) => {
    const fontStyle = {
      fontSize: 16,
      fontWeight: 'bold',
      marginBottom: 20
    }
      
      Modal.setAppElement('#root')

      return (
      <Modal
        isOpen={open}
        bodyOpenClassName='gift-card-preview-body'
        portalClassName='gift-card-preview-portal'
        className={{
          base: 'gift-card-preview-content',
          afterOpen: 'gift-card-preview-content-afterOpen',
          beforeClose: 'gift-card-preview-content-beforeClose'
        }}
        overlayClassName={{
          base: 'gift-card-preview-overlay',
          afterOpen: 'gift-card-preview-overlay-afterOpen',
          beforeClose: 'gift-card-preview-overlay-beforeClose'
        }}
        closeTimeoutMS={500}>
        <div className='gift-card-preview-wrapper'>
        <button className='gift-card-preview-close-button' onClick={() => setShowPreview(false)}>
          <X></X>
        </button>
        <div className='gift-card-preview-title'>    
            <h1 style={{fontSize: 28, fontWeight: 'bold', textAlign: 'center'}}>
              <FormattedMessage id='Selected Gift Card' defaultMessage='Selected Gift Card'></FormattedMessage>
              </h1>
        </div>
        <div className='gift-card-preview-info'> 
            <h1 style={fontStyle}>
              <FormattedMessage id='Sender Name: ' defaultMessage='Sender Name: '></FormattedMessage>
              <span style={{fontWeight: 300}}>{senderName}</span></h1>
            <h1 style={fontStyle}>
              <FormattedMessage id='Recipient Name: ' defaultMessage='Recipient Name: '></FormattedMessage>
              <span style={{fontWeight: 300}}>{recipientName}</span></h1>
            <h1 style={fontStyle}>
              <FormattedMessage id='Value: ' defaultMessage='Value: '></FormattedMessage>
              <span style={{fontWeight: 300}}>{value}</span></h1>
            <h1 style={fontStyle}>
              <FormattedMessage id='Expires At: ' defaultMessage='Expires At: '></FormattedMessage>
              <span style={{fontWeight: 300}}>
                <FormattedMessage id='mm-dd-yyyy' defaultMessage='mm-dd-yyyy'></FormattedMessage>
              </span>
            </h1>
            <h1 style={fontStyle}>
              <FormattedMessage id='Message: ' defaultMessage='Message: '></FormattedMessage>
              <span style={{color: `#${messageColor}`, wordBreak: 'break-all'}}>{message}</span></h1>
            <h1 style={fontStyle}>
              <FormattedMessage id='Gift Card Code: ' defaultMessage='Gift Card Code: '></FormattedMessage>
              <span style={{color: `#${codeColor}`}}>
                <FormattedMessage id='XXXXXXXXXXXX' defaultMessage='XXXXXXXXXXXX'></FormattedMessage>
              </span>
            </h1>
        </div>
        <div className='gift-card-preview-image'>
            <img src={template} className='image' alt=''></img>
        </div> 
        </div>
      </Modal>
      )
}

export default GiftCardPreview