import React from 'react';
import Loader from '../../Loader';
import { useStoreConfig } from '../talons/useStoreConfig';
const faqsEnabled =
    window.SMCONFIGS &&
    window.SMCONFIGS.plugins &&
    window.SMCONFIGS.plugins.SM_ENABLE_FAQS &&
    parseInt(window.SMCONFIGS.plugins.SM_ENABLE_FAQS) === 1;

const ButtonFaq = props => {
    const { showTab, setShowTab } = props;
    const {
        storeConfig,
        storeConfigLoading,
        storeConfigError
    } = useStoreConfig();
   
    const { enable } = storeConfig?.bssFaqsConfig || '';

    if(storeConfigLoading){
        return <Loader/>
    }

    if (!faqsEnabled || parseInt(enable) === 0) return '';

    return (
        <button
            type="button"
            className={showTab === 3 ? 'selected-button' : 'deselected-button'}
            onClick={() => setShowTab(3)}
        >
            FAQs
        </button>
    );
};

export default ButtonFaq;
