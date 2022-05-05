import React, { useState } from 'react';
import { useIntl } from 'react-intl';
// import { Twitter, Facebook, Mail, Linkedin, Google, Whatsapp,Tumblr, Telegram, Pinterest, Reddit } from 'react-social-sharing';
import {
    EmailShareButton,
    FacebookShareButton,
    TelegramShareButton,
    TwitterShareButton,
    EmailIcon,
    FacebookIcon,
    TelegramIcon,
    TwitterIcon
} from 'react-share';
import classes from './sharingBlock.module.css';

const SharingBlock = props => {
    const [showMore, setShowMore] = useState(false);
    const { formatMessage } = useIntl();
    const shareProps = {
        url: window.location.href
    };
    // const { classes } = props;
    return (
        <div className={classes.sharingBlock}>
            <div className={classes.sharingLabel}>
                {formatMessage({
                    id: 'shareThisPost',
                    defaultMessage: 'Share this post'
                })}
            </div>
            <div className={classes.container_social}>
                <span className={classes.wrapFacebook}>
                    <FacebookShareButton {...shareProps}>
                        <FacebookIcon size={30} round={false} />
                        <span className={classes.label}>
                            {formatMessage({
                                id: 'facebook',
                                defaultMessage: 'Facebook'
                            })}
                        </span>
                    </FacebookShareButton>
                </span>
                <span className={classes.wrapTwitter}>
                    <TwitterShareButton {...shareProps}>
                        <TwitterIcon size={30} round={false} />
                        <span className={classes.label}>
                            {formatMessage({
                                id: 'twitter',
                                defaultMessage: 'Twitter'
                            })}
                        </span>
                    </TwitterShareButton>
                </span>
                <span className={classes.wrapEmail}>
                    <EmailShareButton {...shareProps}>
                        <EmailIcon size={30} round={false} />
                        <span className={classes.label}>
                            {formatMessage({
                                id: 'email',
                                defaultMessage: 'Email'
                            })}
                        </span>
                    </EmailShareButton>
                </span>
                <span className={classes.wrapTelegram}>
                    <TelegramShareButton {...shareProps}>
                        <TelegramIcon size={30} round={false} />
                        <span className={classes.label}>
                            {formatMessage({
                                id: 'telegram',
                                defaultMessage: 'Telegram'
                            })}
                        </span>
                    </TelegramShareButton>
                </span>
                {/* <Twitter link={urlToShare}/>
                <Facebook link={urlToShare} />
                <Google link={urlToShare} />
                <div className={classes.shareMoreBtn} onClick={() => setShowMore(!showMore)}>
                    {`More +`}
                </div>
                {showMore &&
                    <div className={classes.shareMore}>
                        <Mail link={urlToShare} />
                        <Whatsapp link={urlToShare} />
                        <Pinterest link={urlToShare} />
                        <Linkedin link={urlToShare} />
                        <Reddit link={urlToShare} />
                        <Tumblr link={urlToShare} />
                        <Telegram link={urlToShare} />
                    </div>
                } */}
            </div>
        </div>
    );
};

export default SharingBlock;
