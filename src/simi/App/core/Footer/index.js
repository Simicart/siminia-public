import React, { useState, useEffect } from 'react';
import defaultStyle from './style.module.css';
import classify from 'src/classify';
import { compose } from 'redux';
// import Newsletter from './Newsletter';
import Identify from 'src/simi/Helper/Identify';
import { Link } from 'src/drivers';
import Copyright from './Copyright';
import Facebook from 'src/simi/BaseComponents/Icon/Facebook';
import Twitter from 'src/simi/BaseComponents/Icon/Twitter';
import Instagram from 'src/simi/BaseComponents/Icon/Instagram';
import { useWindowSize } from '@magento/peregrine';
import { useIntl } from 'react-intl';
import RichContent from '@magento/venia-ui/lib/components/RichContent';
import { withRouter } from 'react-router-dom';
import { logoUrl } from '../../../Helper/Url';
import CmsBlockGroup from '@magento/venia-ui/lib/components/CmsBlock/cmsBlock';

const Footer = props => {
    const { classes, history } = props;
    const { formatMessage } = useIntl();
    const windowSize = useWindowSize();
    const storeConfig = Identify.getStoreConfig();
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

    let showBlockFooter = false;
    if (
        storeConfig &&
        storeConfig.simiStoreConfig &&
        storeConfig.simiStoreConfig.config &&
        storeConfig.simiStoreConfig.config.catalog &&
        storeConfig.simiStoreConfig.config.catalog.frontend &&
        storeConfig.simiStoreConfig.config.catalog.frontend.footer_block
    ) {
        showBlockFooter = true;
    }

    useEffect(() => {
        if (showBlockFooter) {
            const linkNodes = document.querySelectorAll('#footer a');
            for (let i = 0; i < linkNodes.length; i++) {
                if (linkNodes[i]) {
                    linkNodes[i].addEventListener('click', function(e) {
                        e.preventDefault();
                        const href = this.getAttribute('href');
                        if (href) {
                            if (href.length > 0 && href[0] === '/') {
                                history.push(href);
                            } else {
                                const target = this.getAttribute('target');
                                window.open(href, target ? target : '_self');
                            }
                        }
                    });
                }
            }
        }
    }, [showBlockFooter]);

    // if (showBlockFooter) {
    //     return (
    //         <div id="footer" className={classes['footer-app']}>
    //             <RichContent
    //                 html={
    //                     storeConfig.simiStoreConfig.config.catalog.frontend
    //                         .footer_block
    //                 }
    //             />
    //         </div>
    //     );
    // }

    return (
        <div className={classes['footer-app']}>
            {/* <Newsletter classes={classes}/> */}
            <div className={classes['footer-middle']}>
                <div className={`container ${classes['col-mobile-pd-0']}`}>
                    <div className={`row ${classes['app--flex']}`}>
                        <div
                            style={{ width: '20%' }}
                            className={`${
                                classes['col-custom-20pr']
                            } hidden-xs`}
                        >
                            <img
                                style={{ maxHeight: '80px', maxWidth: '120px' }}
                                alt="logo"
                                src={logoUrl()}
                            />
                            {/* <Copyright isPhone={isPhone} classes={classes} /> */}
                            {/* <img alt="payment" src={payment} /> */}
                        </div>
                        <div
                            style={{ width: '15%' }}
                            className={`${classes['col-custom-20pr']} ${
                                classes['col-mobile-pd-0']
                            }`}
                        >
                            {Identify.isRtl() ? (
                                <CmsBlockGroup identifiers="footer-customer-rtl" />
                            ) : (
                                <CmsBlockGroup identifiers="footer-customer" />
                            )}
                        </div>
                        <div
                            style={{ width: '15%' }}
                            className={`${classes['col-custom-20pr']} ${
                                classes['col-mobile-pd-0']
                            }`}
                        >
                            {Identify.isRtl() ? (
                                <CmsBlockGroup identifiers="footer-policies-rtl" />
                            ) : (
                                <CmsBlockGroup identifiers="footer-policies" />
                            )}
                        </div>

                        <div
                            style={{ width: '40%', marginInlineStart: '100px' }}
                            className={`${
                                classes['col-custom-20pr']
                            } text-right ${classes['footer-address']}`}
                        >
                            <CmsBlockGroup identifiers="footer-address" />
                            <div className={classes.wrapSocial}>
                                <CmsBlockGroup identifiers="footer-social" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {/* <Copyright isPhone={isPhone} classes={classes} /> */}
        </div>
    );
};
export default compose(
    withRouter,
    classify(defaultStyle)
)(Footer);
