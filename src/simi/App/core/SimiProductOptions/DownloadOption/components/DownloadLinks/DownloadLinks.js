import React from 'react';
import './DownloadLink.scss'

export const DownloadLinks = (props) => {
    const {product} = props
    const {downloadable_product_samples} = product

    if (downloadable_product_samples && downloadable_product_samples.length > 0) {
        const returnedSamples = [...downloadable_product_samples]
            .sort((a, b) => a.sort_order < b.sort_order)
            .map((downloadSample, index) => {
                return (
                    <div className={'sample-link'} key={index}>
                        <a key={index} href={downloadSample.sample_url} target="_blank"
                           className={"download-sample-item"}>
                            {downloadSample.title}
                        </a>
                    </div>
                )
            })
        return (
            <div className={"download-samples"}>
                <h4 className={'sample-title'}>Samples</h4>
                <div className={"download-sample-title"}>
                    {/*{downloadSamples.title}*/}
                </div>
                <div className={'samples-list'}>
                    {returnedSamples}
                </div>
            </div>
        )
    }
    return null
};

