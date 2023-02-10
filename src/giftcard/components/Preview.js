import Modal from 'react-modal';
import React from "react";
import '../styles/preview.css'
import { X } from 'react-feather' 

const Preview = ({ open, setShowPreview, template, senderName, recipientName, message, codeColor, messageColor, value }) => {
    const fontStyle = {
      fontSize: 16,
      fontWeight: 'bold',
      marginBottom: 20
    }
      
      Modal.setAppElement('#root')

      return (
      <Modal
        isOpen={open}
        bodyOpenClassName='preview-body'
        portalClassName='preview-portal'
        className={{
          base: 'preview-content',
          afterOpen: 'preview-content-afterOpen',
          beforeClose: 'preview-content-beforeClose'
        }}
        overlayClassName={{
          base: 'preview-overlay',
          afterOpen: 'preview-overlay-afterOpen',
          beforeClose: 'preview-overlay-beforeClose'
        }}
        closeTimeoutMS={500}>
        <div className='preview-wrapper'>
        <button className='close-button' onClick={() => setShowPreview(false)}>
          <X></X>
        </button>
        <div className='preview-title'>    
            <h1 style={{fontSize: 28, fontWeight: 'bold', textAlign: 'center'}}>Selected Gift Card</h1>
        </div>
        <div className='preview-info'> 
            <h1 style={fontStyle}>Sender Name: <span style={{fontWeight: 300}}>{`${senderName}`}</span></h1>
            <h1 style={fontStyle}>Recipient Name: <span style={{fontWeight: 300}}>{`${recipientName}`}</span></h1>
            <h1 style={fontStyle}>Value: <span style={{fontWeight: 300}}>{value}</span></h1>
            <h1 style={fontStyle}>Expires At: <span style={{fontWeight: 300}}>mm-dd-yyyy</span></h1>
            <h1 style={fontStyle}>Message: <span style={{color: `#${messageColor}`, wordBreak: 'break-all'}}>{`${message}`}</span></h1>
            <h1 style={fontStyle}>Gift Card Code: <span style={{color: `#${codeColor}`}}>XXXXXXXXXXXX</span></h1>
        </div>
        <div className='preview-image'>
            <img src={template} className='image'></img>
        </div> 
        </div>
      </Modal>
      )
}

export default Preview