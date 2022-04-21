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

const Social = props => {
	const classes = defaultClasses
	// const url = window.location.href
	const shareProps = {
        url: window.location.href
    };
	return (
		<div className={classes.container_social}>
			{/* <Facebook link={url}/>
			<Twitter link={url}/>
			<Google link={url}/>
			<Linkedin link={url}/> */}
			<FacebookShareButton {...shareProps}>
                <FacebookIcon size={21} round={true} />
            </FacebookShareButton>
            <TwitterShareButton {...shareProps}>
                <TwitterIcon size={21} round={true} />
            </TwitterShareButton>
            <EmailShareButton {...shareProps}>
                <EmailIcon size={21} round={true} />
            </EmailShareButton>
            <TelegramShareButton {...shareProps}>
                <TelegramIcon size={21} round={true} />
            </TelegramShareButton>
		</div>
	)
}

export default Social