import React, { useState } from 'react';
import defaultStyle from './style.module.css';
import classify from 'src/classify';
// import Newsletter from './Newsletter';
import Identify from 'src/simi/Helper/Identify';
import { Link } from 'src/drivers';
import Copyright from './Copyright';
import Facebook from 'src/simi/BaseComponents/Icon/Facebook';
import Twitter from 'src/simi/BaseComponents/Icon/Twitter';
import Instagram from 'src/simi/BaseComponents/Icon/Instagram';
import { useWindowSize } from '@magento/peregrine';
import { useIntl } from 'react-intl';

const Footer = props => {
    const { classes } = props;
    const { formatMessage } = useIntl();
    const windowSize = useWindowSize();
    const isPhone = windowSize.innerWidth < 1024;
    const pagec1 = 1;
    const pagep2 = 2;
    const pageCustomerServices = [
        {
            id: 1,
            link: '/about-us-fashion',
            title: 'About'
        },
        {
            id: 2,
            link: '/customer-service',
            title: 'Delivery & returns'
        },
        {
            id: 3,
            link: '/customer-service',
            title: 'Trade services'
        },
        {
            id: 4,
            link: '#',
            title: 'Branch Finder'
        },
        {
            id: 5,
            link: '/contact.html',
            title: 'Contact us'
        }
    ];

    const pagePolicies = [
        {
            id: 1,
            link: '/term-condition-fashion',
            title: 'Terms & Conditions of supply'
        },
        {
            id: 2,
            link: '/term-condition-fashion',
            title: 'Terms of use'
        },
        {
            id: 3,
            link: '/privacy-policy-fashion',
            title: 'Privacy & cookie policy'
        }
    ];

    const listPages = pages => {
        let result = null;
        if (pages.length > 0) {
            result = pages.map((page, index) => {
                return (
                    <li key={index}>
                        <Link to={page.link}>
                            {/* formatMessage({ id: page.title }) */}
                            {page.title}
                        </Link>
                    </li>
                );
            });
        }

        return <ul>{result}</ul>;
    };

    return (
        <div className={classes['footer-app']}>
            {/* <Newsletter classes={classes}/> */}
            <div className={classes['footer-middle']}>
                <div className={`container ${classes['col-mobile-pd-0']}`}>
                    <div className={`row ${classes['app--flex']}`}>
                        <div
                            className={`${classes['col-custom-20pr']} ${
                                classes['col-mobile-pd-0']
                            }`}
                        >
                            <span className={classes['footer--custom_title']}>
                                {formatMessage({ id: 'Customer Services' })}
                            </span>
                            {listPages(pageCustomerServices)}
                        </div>
                        <div
                            className={`${classes['col-custom-20pr']} ${
                                classes['col-mobile-pd-0']
                            }`}
                        >
                            <span className={classes['footer--custom_title']}>
                                {formatMessage({ id: 'Our policies"' })}
                            </span>
                            {listPages(pagePolicies)}
                        </div>
                        <div
                            className={`${
                                classes['col-custom-20pr']
                            } hidden-xs`}
                        />
                        <div
                            className={`${
                                classes['col-custom-20pr']
                            } hidden-xs`}
                        />
                        <div
                            className={`${
                                classes['col-custom-20pr']
                            } text-right`}
                        >
                            <span className={classes['footer--custom_title']}>
                                {formatMessage({ id: 'Get in touch today on' })}
                            </span>
                            <ul className={classes['list-contact']}>
                                <li>
                                    <a href={`tel:842466517968`}>
                                        84 - 24 - 6651 - 7968
                                    </a>
                                </li>
                                <li>
                                    {/* <a href={`mailto:Support@simicart.com `}>Support@simicart.com</a> */}
                                </li>
                            </ul>
                            <span
                                className={classes['footer--custom_title']}
                                style={{
                                    display: 'block',
                                    marginTop: '40px'
                                }}
                            >
                                {formatMessage({ id: 'Connect' })}
                            </span>
                            <div className={classes['social__md-block']}>
                                <a
                                    href="https://www.facebook.com/simicart"
                                    target="__blank"
                                >
                                    <Facebook
                                        className={classes['facebook-icon']}
                                        style={{
                                            width: '50px',
                                            height: '50px'
                                        }}
                                    />
                                </a>
                                <a
                                    href="https://twitter.com/SimiCart"
                                    target="__blank"
                                >
                                    <Twitter
                                        className={classes['twitter-icon']}
                                        style={{
                                            width: '50px',
                                            height: '50px'
                                        }}
                                    />
                                </a>
                                <a
                                    href="https://www.instagram.com/simicart.official/"
                                    target="__blank"
                                >
                                    <Instagram
                                        className={classes['instagram-icon']}
                                        style={{
                                            width: '50px',
                                            height: '50px'
                                        }}
                                    />
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <Copyright isPhone={isPhone} classes={classes} />
        </div>
    );
};
export default classify(defaultStyle)(Footer);
