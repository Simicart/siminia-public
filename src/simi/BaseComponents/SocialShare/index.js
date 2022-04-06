import React from 'react';
import {
    EmailShareButton,
    FacebookShareButton,
    PinterestShareButton,
    TwitterShareButton,
    EmailIcon,
    FacebookIcon,
    PinterestIcon,
    TwitterIcon
} from 'react-share';
import { useWindowSize } from '@magento/peregrine';

const SocialShare = props => {
    const shareProps = { url: window.location.href };
    const windowSize = useWindowSize();
    const isMobileSite = windowSize.innerWidth <= 390;
    const size = isMobileSite ? 21 : 30;
    return (
        <div className={props.className}>
            <FacebookShareButton {...shareProps}>
                <FacebookIcon size={size} round={true} />
            </FacebookShareButton>
            <TwitterShareButton {...shareProps}>
                <TwitterIcon size={size} round={true} />
            </TwitterShareButton>
            <EmailShareButton {...shareProps}>
                <EmailIcon size={size} round={true} />
            </EmailShareButton>
            <PinterestShareButton {...shareProps}>
                <PinterestIcon size={size} round={true} />
            </PinterestShareButton>
        </div>
    );
};
export default SocialShare;
