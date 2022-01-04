import React from 'react';
import { DownloadMiniOptions } from './components/DownloadMiniOptions/DownloadMiniOptions';
import { DownloadLinks } from './components/DownloadLinks/DownloadLinks';

export const DownloadableOptions = props => {
    return (
        <div className="downloadable-option" style={{ padding: '1rem' }}>
            <DownloadLinks {...props} />
            <DownloadMiniOptions {...props} />
        </div>
    );
};
