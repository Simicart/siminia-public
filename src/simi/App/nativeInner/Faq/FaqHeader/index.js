import React, { Fragment, useState } from 'react';
import { useMainPage } from '../talons/useMainPage';
import { useStoreConfig } from '../talons/useStoreConfig';
import { Helmet } from 'react-helmet';
import { useIntl } from 'react-intl';
import defaultClasses from './faqHeader.module.css';
import { useParams } from 'react-router-dom';
import { useFaqQuestion } from '../talons/useFaqQuestion';
import Loader from '../../Loader';
import RichContent from '@magento/venia-ui/lib/components/RichContent/richContent';
import { FaQuestion } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { useStyle } from '@magento/venia-ui/lib/classify';

const faqsEnabled =
    window.SMCONFIGS &&
    window.SMCONFIGS.plugins &&
    window.SMCONFIGS.plugins.SM_ENABLE_FAQS &&
    parseInt(window.SMCONFIGS.plugins.SM_ENABLE_FAQS) === 1;

const FaqHeader = props => {
    const {
        storeConfig,
        storeConfigLoading,
        storeConfigError
    } = useStoreConfig();
    const { enable } = storeConfig?.bssFaqsConfig || '';
    const { classes: propClasses } = props;
    const classes = useStyle(defaultClasses, propClasses);
    const { formatMessage } = useIntl();
    if (!faqsEnabled || parseInt(enable) === 0) return '';
    return (
        <div className={classes['right-bar-item']}>
            <Link className={classes.faqUrl} to={`/faqs`}>
                <div className={classes.faqIcon}>
                    <FaQuestion size={20} />
                </div>

                <div
                    className={classes['item-text']}
                    style={{ whiteSpace: 'nowrap' }}
                >
                    {formatMessage({
                        id: 'FAQs',
                        defaultMessage: 'FAQs'
                    })}
                </div>
            </Link>
        </div>
    );
};

export default FaqHeader;
