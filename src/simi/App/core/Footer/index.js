import React, { useState } from 'react';
import defaultStyle from './style.css';
import classify from 'src/classify';
// import Newsletter from './Newsletter';
import Identify from "src/simi/Helper/Identify";
import { Link } from 'src/drivers';
import Copyright from './Copyright';
import Facebook from 'src/simi/BaseComponents/Icon/Facebook'
import Twitter from 'src/simi/BaseComponents/Icon/Twitter'
import Instagram from 'src/simi/BaseComponents/Icon/Instagram'
import Expansion from 'src/simi/BaseComponents/Expansion'
import { useWindowSize } from '@magento/peregrine';

const Footer = props => {
    const { classes } = props;
    const windowSize = useWindowSize();
    const isPhone = windowSize.innerWidth < 1024;
    const [expanded, setExpanded] = useState(null);
    const pagec1 = 1;
    const pagep2 = 2;
    const pageCustomerServices = [
        {
            id: 1,
            link: "/about-us-fashion",
            title: "About"
        },
        {
            id: 2,
            link: "/customer-service",
            title: "Delivery & returns"
        },
        {
            id: 3,
            link: "/customer-service",
            title: "Trade services"
        },
        {
            id: 4,
            link: "#",
            title: "Branch Finder"
        },
        {
            id: 5,
            link: "/contact.html",
            title: "Contact us"
        }
    ];

    const pagePolicies = [
        {
            id: 1,
            link: "/term-condition-fashion",
            title: "Terms & Conditions of supply"
        },
        {
            id: 2,
            link: "/term-condition-fashion",
            title: "Terms of use"
        },
        {
            id: 3,
            link: "/privacy-policy-fashion",
            title: "Privacy & cookie policy"
        }
    ];

    const listPages = pages => {

        let result = null;
        if (pages.length > 0) {
            result = pages.map((page, index) => {
                return (
                    <li key={index}>
                        <Link to={page.link}>{Identify.__(page.title)}</Link>
                    </li>
                );
            })
        }

        return <ul>{result}</ul>;
    }

    const handleExpand = (expanded) => {
        setExpanded(expanded);
    }

    return (
        <div className={classes['footer-app']}>
            {/* <Newsletter classes={classes}/> */}
            <div className={classes['footer-middle']}>
                <div className={`container ${classes['col-mobile-pd-0']}`}>
                    <div className={`row ${classes['app--flex']}`}>
                        <div className={`${classes['col-custom-20pr']} ${classes['col-mobile-pd-0']}`}>
                            {!isPhone ? <React.Fragment>
                                <span className={classes["footer--custom_title"]}>
                                    {Identify.__("Customer Services")}
                                </span>
                                {listPages(pageCustomerServices)}
                            </React.Fragment> : <Expansion id={pagec1} title={Identify.__("Customer Services")} content={listPages(pageCustomerServices)} icon_color="#FFFFFF" handleExpand={(pagec1) => handleExpand(pagec1)} expanded={expanded} />}
                        </div>
                        <div className={`${classes['col-custom-20pr']} ${classes['col-mobile-pd-0']}`}>
                            {!isPhone ? <React.Fragment>
                                <span className={classes["footer--custom_title"]}>
                                    {Identify.__("Our Policies")}
                                </span>
                                {listPages(pagePolicies)}
                            </React.Fragment> : <Expansion id={pagep2} title={Identify.__("Our Policies")} content={listPages(pagePolicies)} icon_color="#FFFFFF" handleExpand={(pagep2) => handleExpand(pagep2)} expanded={expanded} />}
                        </div>
                        <div className={`${classes['col-custom-20pr']} hidden-xs`} />
                        <div className={`${classes['col-custom-20pr']} hidden-xs`} />
                        <div className={`${classes["col-custom-20pr"]} text-right`}>
                            <span className={classes["footer--custom_title"]}>
                                {Identify.__("Get in touch today on")}
                            </span>
                            <ul className={classes["list-contact"]}>
                                <li>
                                    <a href={`tel:842466517968`}>84 - 24 - 6651 - 7968</a>
                                </li>
                                <li>
                                    {/* <a href={`mailto:Support@simicart.com `}>Support@simicart.com</a> */}
                                </li>
                            </ul>
                            <span
                                className={classes["footer--custom_title"]}
                                style={{
                                    display: "block",
                                    marginTop: "40px"
                                }}
                            >
                                {Identify.__("Connect")}
                            </span>
                            <div className={classes["social__md-block"]}>
                                <a href='https://www.facebook.com/simicart' target="__blank">
                                    <Facebook className={classes["facebook-icon"]} style={{ width: "50px", height: "50px" }} />
                                </a>
                                <a href='https://twitter.com/SimiCart' target="__blank">
                                    <Twitter className={classes["twitter-icon"]} style={{ width: "50px", height: "50px" }} />
                                </a>
                                <a href='https://www.instagram.com/simicart.official/' target="__blank">
                                    <Instagram className={classes["instagram-icon"]} style={{ width: "50px", height: "50px" }} />
                                </a>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
            <Copyright isPhone={isPhone} classes={classes} />
        </div>
    )
}
export default classify(defaultStyle)(Footer)
