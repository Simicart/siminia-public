import { fullPageLoadingIndicator } from '@magento/venia-ui/lib/components/LoadingIndicator';
import React from 'react';

/* 
props = {
    pageType: String,
    location: Object,
    isLogic: true|false
} 
*/

const Robots = props => {
    let content = '';

    if (['CATEGORY', 'PRODUCT'].includes(props.pageType)) {
        const metaRobots = document.querySelectorAll('meta[name=robots]');
        if (metaRobots.length && !props.isLogic) {
            metaRobots.forEach(meta => meta.remove());
        }

        if (props.pageType === 'CATEGORY') {
            content = ''; // Default content
        }

        // Get search filter values in url params
        let filterVals = '';
        if (props.location.search) {
            const search = decodeURIComponent(props.location.search).split('?'); // explode 1?2 to [1, 2]
            if (search.length > 1) {
                let attrs = search[1].split('&'); // explode 1&2 to [1, 2]
                if (attrs.length > 0) {
                    attrs.every(param => {
                        const p = param.split('=');
                        if (p[0] === 'filter' && p[1]) {
                            try {
                                filterVals = JSON.parse(p[1]);
                            } catch (error) {}
                            return false; //break loop
                        }
                        return true;
                    });
                }
            }
        }

        // Add count of filters for set NOINDEX, FOLLOW for LN
        if (props.pageType === 'CATEGORY' && filterVals) {
            content = 'index, follow'; // Default for Category Layer Navigation
        }
        if (props.isLogic) return content;
        if (!content) return null;

        return <meta name="robots" content={content.toLowerCase()} />;
    }

    if (props.isLogic) return content;  
    if (!content) return null;
   
    return <meta name="robots" content={content} />;
};

export default Robots;
