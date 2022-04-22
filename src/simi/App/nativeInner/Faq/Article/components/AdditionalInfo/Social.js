import React from 'react';
import defaultClasses from './Social.module.css'
// import { Facebook, Twitter, Google, Linkedin } from 'react-social-sharing'
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
import { useIntl } from 'react-intl';

const Social = props => {
	const classes = defaultClasses
	// const url = window.location.href
    const { formatMessage } = useIntl();

	const shareProps = {
        url: window.location.href
    };
	return (
		<div className={classes.container_social}>
			{/* <Facebook link={url}/>
			<Twitter link={url}/>
			<Google link={url}/>
			<Linkedin link={url}/> */}
            <span className={classes.wrapFacebook}>
            <FacebookShareButton  {...shareProps}>
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
            
		</div>
	)
}

export default Social