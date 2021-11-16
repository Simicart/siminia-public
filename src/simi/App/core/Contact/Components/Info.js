import React from 'react';
import EmailIcon from '../../../../BaseComponents/Icon/TapitaIcons/Email';
import Phone from '../../../../BaseComponents/Icon/TapitaIcons/Phone-call';
import Home from '../../../../BaseComponents/Icon/TapitaIcons/Homepage';
import Identify from 'src/simi/Helper/Identify';
import classify from 'src/classify';
import defaultClasses from '../style.css';
import { simiUseQuery as useQuery } from 'src/simi/Network/Query';
import Loading from 'src/simi/BaseComponents/Loading';
import gql from 'graphql-tag';

const GET_CONTACTUS_CONFIG = gql`
    query getContactConfig {
        simiStoreConfig {
            config {
                pwacontactus {
                    listEmail {
                        contact_email
                    }
                    listHotline {
                        contact_hotline
                    }
                    listSms {
                        contact_sms
                    }
                    listWebsite {
                        contact_website
                    }
                }
            }
        }
    }
`;

const Info = props => {
    const { classes } = props;
    let contactus = null;
    let listEmails = [];
    let listHotlines = [];
    let listSmsPhoneNumber = [];
    let listWebsites = [];
    const { data: storeConfig, loading } = useQuery(GET_CONTACTUS_CONFIG);
    if (loading) {
        return <Loading />;
    }
    if (
        storeConfig &&
        storeConfig.simiStoreConfig &&
        storeConfig.simiStoreConfig.config &&
        storeConfig.simiStoreConfig.config.pwacontactus
    ) {
        contactus = storeConfig.simiStoreConfig.config.pwacontactus;
    }
    
    if (contactus && contactus.listEmail) {
        listEmails = contactus.listEmail;
    }
    if (contactus && contactus.listHotline) {
        listHotlines = contactus.listHotline;
    }
    if (contactus && contactus.listSms) {
        listSmsPhoneNumber = contactus.listSms;
    }
    if (contactus && contactus.listWebsite) {
        listWebsites = contactus.listWebsite;
    }

    const listEmailHtml = list => {
        let html = null;
        html = list.map((item, index) => {
            return (
                <li key={index} className="sub-item">
                    <a href={`mailto:${item.contact_email}`}>
                        {item.contact_email}
                    </a>
                </li>
            );
        });
        return html;
    };

    const listHotlinelHtml = list => {
        let html = null;
        html = list.map((item, index) => {
            return (
                <li key={index} className="sub-item">
                    <a href={`tel:${item.contact_hotline}`}>
                        {item.contact_hotline}
                    </a>
                </li>
            );
        });
        return html;
    };

    const listSmslHtml = list => {
        let html = null;
        html = list.map((item, index) => {
            return (
                <li key={index} className="sub-item">
                    <a href={`tel:${item.contact_sms}`}>{item.contact_sms}</a>
                </li>
            );
        });
        return html;
    };
    const listWebsitelHtml = list => {
        let html = null;
        html = list.map((item, index) => {
            return (
                <li key={index} className="sub-item">
                    <a href={item.contact_website}>{item.contact_website}</a>
                </li>
            );
        });
        return html;
    };

    return (
        <div className={classes['contact-info']}>
            <div className={classes['contact-item']}>
                <div className="contact-item-icon">
                    <EmailIcon />
                </div>
                <div className={classes['item-content']}>
                    <div className={classes['contact-title']}>
                        {Identify.__('Email')}
                    </div>
                    <ul className="list-sub-item">
                        {listEmailHtml(listEmails)}
                    </ul>
                </div>
            </div>

            <div className={classes['contact-item']}>
                <div className="contact-item-icon">
                    <Phone />
                </div>
                <div className={classes['item-content']}>
                    <div className={classes['contact-title']}>
                        {Identify.__('Hotline')}
                    </div>
                    <ul className="list-sub-item">
                        {listHotlinelHtml(listHotlines)}
                    </ul>
                </div>
            </div>

            <div className={classes['contact-item']}>
                <div className="contact-item-icon">
                    <EmailIcon />
                </div>
                <div className={classes['item-content']}>
                    <div className={classes['contact-title']}>
                        {Identify.__('SMS')}
                    </div>
                    <ul className="list-sub-item">
                        {listSmslHtml(listSmsPhoneNumber)}
                    </ul>
                </div>
            </div>

            <div className={classes['contact-item']}>
                <div className="contact-item-icon">
                    <Home />
                </div>
                <div className={classes['item-content']}>
                    <div className={classes['contact-title']}>
                        {Identify.__('website')}
                    </div>
                    <ul className="list-sub-item">
                        {listWebsitelHtml(listWebsites)}
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default classify(defaultClasses)(Info);
