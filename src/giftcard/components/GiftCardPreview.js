import Modal from 'react-modal';
import React from "react";
import { X } from 'react-feather' 

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
            <h1 style={{fontSize: 28, fontWeight: 'bold', textAlign: 'center'}}>Selected Gift Card</h1>
        </div>
        <div className='gift-card-preview-info'> 
            <h1 style={fontStyle}>Sender Name: <span style={{fontWeight: 300}}>{`${senderName}`}</span></h1>
            <h1 style={fontStyle}>Recipient Name: <span style={{fontWeight: 300}}>{`${recipientName}`}</span></h1>
            <h1 style={fontStyle}>Value: <span style={{fontWeight: 300}}>{value}</span></h1>
            <h1 style={fontStyle}>Expires At: <span style={{fontWeight: 300}}>mm-dd-yyyy</span></h1>
            <h1 style={fontStyle}>Message: <span style={{color: `#${messageColor}`, wordBreak: 'break-all'}}>{`${message}`}</span></h1>
            <h1 style={fontStyle}>Gift Card Code: <span style={{color: `#${codeColor}`}}>XXXXXXXXXXXX</span></h1>
        </div>
        <div className='gift-card-preview-image'>
            <img src={template} className='image'></img>
        </div> 
        </div>
      </Modal>
      )
}

export default GiftCardPreview