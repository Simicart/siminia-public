import React from 'react';
import EmailIcon from '../../../../BaseComponents/Icon/TapitaIcons/Email';
import Phone from '../../../../BaseComponents/Icon/TapitaIcons/Phone-call';
import Home from '../../../../BaseComponents/Icon/TapitaIcons/Homepage';
import Identify from 'src/simi/Helper/Identify'
import classify from "src/classify";
import defaultClasses from "../style.css";

const Info = (props) => {
    const {classes} = props;

    return (
        <div className={classes['contact-info']}>
            <div className={classes['contact-item']}>
                <div className="contact-item-icon">
                    <EmailIcon />
                </div>
                <div className={classes['item-content']}>
                    <div className={classes['contact-title']}>
                        {Identify.__("Email")}
                    </div>
                    <ul className="list-sub-item">
                        <li className="sub-item">
                            <a href="mailto:sales@simicart.com">sales@simicart.com</a>
                        </li>
                        <li className="sub-item">
                            <a href="mailto:info@simicart.com">info@simicart.com</a>
                        </li>
                    </ul>
                </div>
            </div>

            <div className={classes['contact-item']}>
                <div className="contact-item-icon">
                    <Phone />
                </div>
                <div className={classes['item-content']}>
                    <div className={classes['contact-title']}>
                        {Identify.__("Hotline")}
                    </div>
                    <ul className="list-sub-item">
                        <li className="sub-item">
                            <a href="tel:840432171357">840432171357</a>
                        </li>
                        <li className="sub-item">
                            <a href="tel:123456789">123456789</a>
                        </li>
                    </ul>
                </div>
            </div>

            <div className={classes['contact-item']}>
                <div className="contact-item-icon">
                    <EmailIcon />
                </div>
                <div className={classes['item-content']}>
                    <div className={classes['contact-title']}>
                        {Identify.__("SMS")}
                    </div>
                    <ul className="list-sub-item">
                        <li className="sub-item">
                            <a href="tel:840432171357">840432171357</a>
                        </li>
                        <li className="sub-item">
                            <a href="tel:123456789">123456789</a>
                        </li>
                    </ul>
                </div>
            </div>

            <div className={classes['contact-item']}>
                <div className="contact-item-icon">
                    <Home />
                </div>
                <div className={classes['item-content']}>
                    <div className={classes['contact-title']}>
                        {Identify.__("website")}
                    </div>
                    <ul className="list-sub-item">
                        <li className="sub-item">
                            <a href="https://cody.pwa-commerce.com/">https://cody.pwa-commerce.com/</a>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    )
}

export default classify(defaultClasses)(Info);