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

const SocialShare = props => {
    const shareProps = { url: window.location.href };
    return (
        <div className={props.className}>
            <FacebookShareButton {...shareProps}>
                <FacebookIcon size={30} round={true} />
            </FacebookShareButton>
            <TwitterShareButton {...shareProps}>
                <TwitterIcon size={30} round={true} />
            </TwitterShareButton>
            <EmailShareButton {...shareProps}>
                <EmailIcon size={30} round={true} />
            </EmailShareButton>
            <PinterestShareButton {...shareProps}>
                <PinterestIcon size={30} round={true} />
            </PinterestShareButton>
        </div>
    );
};
export default SocialShare;
