import React, { useEffect } from 'react';
import ContactForm from './Components/Form';
import Info from './Components/Info';
import { compose } from 'redux';
import classify from 'src/classify';
import defaultClasses from './style.css';
import TitleHelper from 'src/simi/Helper/TitleHelper';
import Identify from 'src/simi/Helper/Identify';
import BreadCrumb from 'src/simi/BaseComponents/BreadCrumb';
import { smoothScrollToView } from 'src/simi/Helper/Behavior';

const Contact = props => {
    const { classes } = props;
    useEffect(() => {
        smoothScrollToView($('#root'));
    }, []);

    return (
        <div className="contact-page">
            {TitleHelper.renderMetaHeader({
                title: Identify.__('Contact'),
                desc: Identify.__('Contact')
            })}
            <BreadCrumb
                breadcrumb={[
                    { name: 'Home', link: '/' },
                    { name: 'Contact Us' }
                ]}
            />
            <div className={`container ${classes['contact-ctn']}`}>
                <ContactForm />
                <Info />
            </div>
        </div>
    );
};

export default compose(classify(defaultClasses))(Contact);
