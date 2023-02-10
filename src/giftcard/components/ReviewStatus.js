import Modal from 'react-modal';
import React from "react";
import { Check } from 'react-feather'
import { AlertCircle } from 'react-feather'; 

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
          portalClassName='review-status-portal'
          className={{
            base: 'review-status-content',
            afterOpen: 'review-status-content-afterOpen',
            beforeClose: 'review-status-content-beforeClose'
          }}
          overlayClassName={{
            base: 'review-status-overlay',
            afterOpen: 'review-status-overlay-afterOpen',
            beforeClose: 'review-status-overlay-beforeClose'
          }}
          closeTimeoutMS={1000}
        >
        <div className={reviewStatus.includes('successful') ? 'successPopUp' : 'errorPopUp'}>
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