import React, { useState } from 'react';
import PopUpContent from './PopUpContent';
import SizeChartIcon from '../assets/images/size-chart-icon.png';
import RichContent from '@magento/venia-ui/lib/components/RichContent/richContent';
import '../styles/sizechart.css';
import { useIntl } from 'react-intl';

const SizeChart = ({ display, isMobileSite, sizeChartData }) => {
    const { formatMessage } = useIntl();
    const [openSizeChart, setOpenSizeChart] = useState(false);
    if (display === 0 && !isMobileSite) {
        return (
            <>
                <div className="pop-up-size-chart">
                    <button
                        style={{ marginRight: 10 }}
                        onClick={() => setOpenSizeChart(true)}
                    >
                        <button type="button">
                            <p
                                className="button-title"
                                style={{
                                    color: sizeChartData.storeConfig
                                        .linkPopupColor
                                        ? sizeChartData.storeConfig
                                              .linkPopupColor
                                        : 'orange'
                                }}
                            >
                                {sizeChartData.storeConfig.linkPopupText
                                    ? sizeChartData.storeConfig.linkPopupText
                                    : 'Size Chart'}
                            </p>
                        </button>
                    </button>
                    <button
                        style={{ cursor: 'pointer' }}
                        onClick={() => setOpenSizeChart(true)}
                    >
                        <img
                            alt="sizeChart"
                            src={
                                sizeChartData.storeConfig.icon !== 'false'
                                    ? sizeChartData.storeConfig.icon
                                    : SizeChartIcon
                            }
                            style={{ width: 30, height: 30 }}
                        />
                    </button>
                </div>

                <PopUpContent
                    data={sizeChartData}
                    isMobileSite={isMobileSite}
                    openSizeChart={openSizeChart}
                    setOpenSizeChart={setOpenSizeChart}
                />
            </>
        );
    } else if (display === 0 && isMobileSite) {
        return (
            <>
                <div className="pop-up-size-chart-native">
                    <button
                        style={{ marginRight: 10 }}
                        onClick={() => setOpenSizeChart(true)}
                    >
                        <button type="button">
                            <p
                                className="button-title-native"
                                style={{
                                    color: sizeChartData.storeConfig
                                        .linkPopupColor
                                        ? sizeChartData.storeConfig
                                              .linkPopupColor
                                        : 'orange'
                                }}
                            >
                                {formatMessage({
                                    id: 'Size Chart',
                                    defaultMessage: 'Size Chart'
                                })}
                            </p>
                        </button>
                    </button>
                    <button
                        style={{ cursor: 'pointer' }}
                        onClick={() => setOpenSizeChart(true)}
                    >
                        <img
                            alt="sizeChart"
                            src={
                                sizeChartData.storeConfig.icon !== 'false'
                                    ? sizeChartData.storeConfig.icon
                                    : SizeChartIcon
                            }
                            style={{ width: 20, height: 20, marginTop: 3 }}
                        />
                    </button>
                </div>

                <PopUpContent
                    data={sizeChartData}
                    isMobileSite={isMobileSite}
                    openSizeChart={openSizeChart}
                    setOpenSizeChart={setOpenSizeChart}
                />
            </>
        );
    } else if (display === 1) {
        return (
            <div className="tab-size-chart">
                <h1 style={{ fontSize: 24, fontWeight: 'bold' }}>
                    {sizeChartData?.title}
                </h1>
                <RichContent html={sizeChartData?.content} />
            </div>
        );
    } else if (display === 2 && !isMobileSite) {
        return (
            <div className="inline-size-chart">
                <h1 style={{ fontSize: 16, fontWeight: 'bold' }}>
                    {sizeChartData?.title}
                    {formatMessage({
                        id: ':'
                    })}
                </h1>
                <div className="inline-image">
                    <RichContent html={sizeChartData?.content} />
                </div>
            </div>
        );
    } else if (display === 2 && isMobileSite) {
        return (
            <div className="inline-size-chart">
                <h1 style={{ fontSize: 14, marginLeft: '1.5rem' }}>
                    {sizeChartData?.title}
                    {formatMessage({
                        id: ':'
                    })}
                </h1>
                <div className="inline-image-native">
                    <RichContent html={sizeChartData?.content} />
                </div>
            </div>
        );
    } else return <></>;
};

export default SizeChart;
