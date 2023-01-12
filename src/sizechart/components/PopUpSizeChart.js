import React from 'react'
import Modal from 'react-modal'
import RichContent from '@magento/venia-ui/lib/components/RichContent/richContent'
import * as Icon from 'react-feather';

const PopUpSizeChart = ({ isMobileSite, data, openSizeChart, setOpenSizeChart }) => {
    Modal.setAppElement('#root')

    return (
        <>
            <Modal
            isOpen={openSizeChart}
            bodyOpenClassName='body'
            portalClassName='portal'
            className={{
                base: 'content',
                afterOpen: 'content-afterOpen',
                beforeClose: 'content-beforeClose'
            }}
            overlayClassName={{
                base: 'overlay',
                afterOpen: 'overlay-afterOpen',
                beforeClose: 'overlay-beforeClose'
            }}
            closeTimeoutMS={500}>
                <div className={isMobileSite ? 'size-chart-content-native' : 'size-chart-content'}>
                    <div className='size-chart-button'>
                        <Icon.X onClick={() => setOpenSizeChart(false)} size={24} className='x-button'></Icon.X>
                    </div>
                    <div style={{paddingTop: 60}}>
                        <h1 style={{fontSize: 30}}>{data?.title}</h1>
                    </div>
                    <RichContent html={data?.content}></RichContent>
                </div>
            </Modal>
        </>
    )
}

export default PopUpSizeChart