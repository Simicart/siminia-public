import Modal from 'react-modal';
import React from "react";
import { Check, AlertCircle } from 'react-feather'

const ReviewStatus = ({reviewStatus, showReviewStatus, setShowReviewStatus}) => {
      Modal.setAppElement('#root')
      
      if(reviewStatus === 'Submit review successful!') {
        if(showReviewStatus) {
          setTimeout(() => {
          setShowReviewStatus(false)
        }, 2000)
      }}

      return (
        <Modal
          isOpen={showReviewStatus}
          portalClassName='gift-card-review-status-portal'
          className={{
            base: 'gift-card-review-status-content',
            afterOpen: 'gift-card-review-status-content-afterOpen',
            beforeClose: 'gift-card-review-status-content-beforeClose'
          }}
          overlayClassName={{
            base: 'gift-card-review-status-overlay',
            afterOpen: 'gift-card-review-status-overlay-afterOpen',
            beforeClose: 'gift-card-review-status-overlay-beforeClose'
          }}
          closeTimeoutMS={1000}
        >
        <div className={reviewStatus.includes('successful') ? 'gift-card-review-success' : 'gift-card-review-error'}>
            <div style={{width: '10%', marginRight: '10%'}}>
                {reviewStatus.includes('successful') ? (<Check style={{color: 'green'}}></Check>) : (<AlertCircle style={{color: 'red'}}></AlertCircle>)}
            </div>
            <div style={{width: '80%'}}>
                <p style={{textAlign: 'left'}}>{reviewStatus}</p>
            </div>
        </div>
        </Modal>
      )
}

export default ReviewStatus