import React from 'react';
import {
    EmailShareButton,
    FacebookShareButton,
    // InstapaperShareButton,
    TelegramShareButton,
    TwitterShareButton,
    // InstapaperIcon,
    // EmailIcon,
    // FacebookIcon,
    // TelegramIcon,
    // TwitterIcon
} from 'react-share';
import {FaFacebookF, FaTwitter , FaTelegramPlane} from 'react-icons/fa'
import {GrMail} from 'react-icons/gr'
import { useWindowSize } from '@magento/peregrine';
require('./socialShare.scss');

const SocialShare = props => {
    const url_key =
        props && props.product && props.product.url_key
            ? props.product.url_key
            : '';
    const url_suffix =
        props && props.product && props.product.url_suffix
            ? props.product.url_suffix
            : '.html';
    const shareProps = {
        url: `${window.location.host}/${url_key}${url_suffix}`
    };
    const windowSize = useWindowSize();
    const isMobileSite = windowSize.innerWidth <= 390;
    const size = isMobileSite ? 16 : 21;
    return (
        <div className={`${props.className} socialShare` }>
            <FacebookShareButton {...shareProps}>
                {/* <FacebookIcon size={size} round={true} /> */}
                <FaFacebookF size={size} round={true}/>
            </FacebookShareButton>
            <TwitterShareButton {...shareProps}>
                {/* <TwitterIcon size={size} round={true} /> */}
                <FaTwitter size={size} round={true} />
            </TwitterShareButton>
            <TelegramShareButton {...shareProps}>
                <FaTelegramPlane size={size} round={true} />
            </TelegramShareButton>
            <EmailShareButton {...shareProps}>
                {/* <EmailIcon size={size} round={true} /> */}
                <GrMail size={size} round={true} />
            </EmailShareButton>
        </div>
    );
};
export default SocialShare;
