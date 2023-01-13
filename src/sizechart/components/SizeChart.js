import React, {useState} from 'react'
import PopUpContent from './PopUpContent'
import SizeChartIcon from '../assets/images/size-chart-icon.png'
import RichContent from '@magento/venia-ui/lib/components/RichContent/richContent'
import '../styles/sizechart.css'

const SizeChart = ({ display, isMobileSite, sizeChartData }) => {
    const [openSizeChart, setOpenSizeChart] = useState(false)

    if(display===0 && !isMobileSite) {
        return (
            <>
                <div className = 'pop-up-size-chart'>
                    <div style={{marginRight: 10}} onClick={() => setOpenSizeChart(true)}>
                        <button type='button'><p className='button-title'>Size chart</p></button>
                    </div>
                    <div style={{cursor: 'pointer'}} onClick={() => setOpenSizeChart(true)}>
                        <img src={SizeChartIcon} style={{width: 30, height: 30}}></img>
                    </div>
                </div>

                <PopUpContent data={sizeChartData} isMobileSite={isMobileSite}
                              openSizeChart={openSizeChart} setOpenSizeChart={setOpenSizeChart}
                ></PopUpContent>
            </>
        )
    }

    else if(display===0 && isMobileSite) {
        return (
            <>
                <div className = 'pop-up-size-chart-native'>
                    <div style={{marginRight: 10}} onClick={() => setOpenSizeChart(true)}>
                        <button type='button'><p className='button-title-native'>Size chart</p></button>
                    </div>
                    <div style={{cursor: 'pointer'}} onClick={() => setOpenSizeChart(true)}>
                        <img src={SizeChartIcon} style={{width: 20, height: 20, marginTop: 3}}></img>
                    </div>
                </div>

                <PopUpContent data={sizeChartData} isMobileSite={isMobileSite}
                              openSizeChart={openSizeChart} setOpenSizeChart={setOpenSizeChart}
                ></PopUpContent>
            </>
        )
    }

    else if(display===1) {
        return (
            <div className='tab-size-chart'>
                <h1 style={{fontSize: 24, fontWeight: 'bold'}}>{sizeChartData?.title}</h1>
                <RichContent html={sizeChartData?.content}></RichContent>
            </div>  
        )
    }

    else if(display===2 && !isMobileSite) {
        return (
            <div className='inline-size-chart'>
                <h1 style={{fontSize: 16, fontWeight: 'bold'}}>{`${sizeChartData?.title}:`}</h1>
                <div className='inline-image'>
                    <RichContent html={sizeChartData?.content}></RichContent>
                </div>
            </div>    
        )
    }

    else if(display===2 && isMobileSite) {
        return (
            <div className='inline-size-chart'>
                <h1 style={{fontSize: 14, marginLeft: '1.5rem'}}>{`${sizeChartData?.title}:`}</h1>
                <div className='inline-image-native'>
                    <RichContent html={sizeChartData?.content}></RichContent>
                </div>
            </div>
        )
    }

    else return <></>
}

export default SizeChart