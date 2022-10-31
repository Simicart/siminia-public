import React, { useEffect } from 'react';
import defaultStyle from './style.module.css';
import classify from 'src/classify';
import { compose } from 'redux';
// import Newsletter from './Newsletter';
import Identify from 'src/simi/Helper/Identify';
import { Link } from 'src/drivers';
import Copyright from './Copyright';
// import Facebook from 'src/simi/BaseComponents/Icon/Facebook';
// import Twitter from 'src/simi/BaseComponents/Icon/Twitter';
// import Instagram from 'src/simi/BaseComponents/Icon/Instagram';
import { useWindowSize } from '@magento/peregrine';
import { useIntl } from 'react-intl';
import RichContent from '@magento/venia-ui/lib/components/RichContent';
import { withRouter } from 'react-router-dom';
import { logoUrl } from '../../../Helper/Url';
import { gql, useQuery } from '@apollo/client';
// import CmsBlockGroup from '@magento/venia-ui/lib/components/CmsBlock/cmsBlock';
const GET_CMS_BLOCKS = gql`
    query cmsBlocks($identifiers: [String]!) {
        cmsBlocks(identifiers: $identifiers) {
            items {
                content
                identifier
            }
        }
    }
`;

const Footer = props => {
    const { classes, history } = props;

    const { data: cmsBlocksArr } = useQuery(GET_CMS_BLOCKS, {
        variables: {
            identifiers: [
                'footer-customer',
                'footer-customer-rtl',
                'footer-policies',
                'footer-policies-rtl',
                'footer-address',
                'footer-social'
            ]
        }
    });

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
                        {/* <div
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
                            <Copyright isPhone={isPhone} classes={classes} />
                            <img alt="payment" src={payment} />
                        </div> */}
                        <div
                            style={{ width: '30%' }}
                            className={`${classes['col-custom-20pr']} ${
                                classes['col-mobile-pd-0']
                            }`}
                        >
                            {Identify.isRtl() ? (
                                // <CmsBlockGroup identifiers="footer-customer-rtl" />
                                <RichContent
                                    html={
                                        cmsBlocksArr &&
                                        cmsBlocksArr.cmsBlocks &&
                                        cmsBlocksArr.cmsBlocks.items[1] &&
                                        cmsBlocksArr.cmsBlocks.items[1].content
                                            ? cmsBlocksArr.cmsBlocks.items[1]
                                                  .content
                                            : ''
                                    }
                                />
                            ) : (
                                <RichContent
                                html={
                                    cmsBlocksArr &&
                                    cmsBlocksArr.cmsBlocks &&
                                    cmsBlocksArr.cmsBlocks.items[0] &&
                                    cmsBlocksArr.cmsBlocks.items[0].content
                                        ? cmsBlocksArr.cmsBlocks.items[0]
                                              .content
                                        : ''
                                }
                            />
                            )}
                        </div>
                        <div
                            style={{ width: '30%' }}
                            className={`${classes['col-custom-20pr']} ${
                                classes['col-mobile-pd-0']
                            }`}
                        >
                            {Identify.isRtl() ? (
                                 <RichContent
                                 html={
                                     cmsBlocksArr &&
                                     cmsBlocksArr.cmsBlocks &&
                                     cmsBlocksArr.cmsBlocks.items[3] &&
                                     cmsBlocksArr.cmsBlocks.items[3].content
                                         ? cmsBlocksArr.cmsBlocks.items[3]
                                               .content
                                         : ''
                                 }
                             />
                            ) : (
                                <RichContent
                                html={
                                    cmsBlocksArr &&
                                    cmsBlocksArr.cmsBlocks &&
                                    cmsBlocksArr.cmsBlocks.items[2] &&
                                    cmsBlocksArr.cmsBlocks.items[2].content
                                        ? cmsBlocksArr.cmsBlocks.items[2]
                                              .content
                                        : ''
                                }
                            />
                            )}
                        </div>

                        <div
                            style={{ width: '60%', marginInlineStart: '20%' }}
                            className={`${
                                classes['col-custom-20pr']
                            } text-right ${classes['footer-address']}`}
                        >
                                <RichContent
                                    html={
                                        cmsBlocksArr &&
                                        cmsBlocksArr.cmsBlocks &&
                                        cmsBlocksArr.cmsBlocks.items[4] &&
                                        cmsBlocksArr.cmsBlocks.items[4].content
                                            ? cmsBlocksArr.cmsBlocks.items[4]
                                                  .content
                                            : ''
                                    }
                                />
                            <div className={classes.wrapSocial}>
                                <RichContent
                                    html={
                                        cmsBlocksArr &&
                                        cmsBlocksArr.cmsBlocks &&
                                        cmsBlocksArr.cmsBlocks.items[5] &&
                                        cmsBlocksArr.cmsBlocks.items[5].content
                                            ? cmsBlocksArr.cmsBlocks.items[5]
                                                  .content
                                            : ''
                                    }
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <Copyright isPhone={isPhone} classes={classes} />
        </div>
    );
};
export default compose(
    withRouter,
    classify(defaultStyle)
)(Footer);
