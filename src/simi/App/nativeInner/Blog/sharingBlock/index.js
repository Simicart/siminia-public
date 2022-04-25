import React, { useState } from 'react';
// import { Twitter, Facebook, Mail, Linkedin, Google, Whatsapp,Tumblr, Telegram, Pinterest, Reddit } from 'react-social-sharing';

const SharingBlock = props => {
    const [showMore, setShowMore] = useState(false);
    const { classes } = props;
    const urlToShare = window.location.href;
    return (
        <div className={classes.sharingBlock}>
            <div className={classes.sharingLabel}>
                {`Share this post`}
            </div>
            {/* <div className={classes.sharingItems}>
                <Twitter link={urlToShare}/>
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
                }
            </div> */}
        </div>
    )
}

export default SharingBlock