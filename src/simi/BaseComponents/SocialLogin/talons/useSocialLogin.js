import { useCallback, useEffect, useRef, useState } from 'react';
// import mergeOperations from '@magento/peregrine/lib/util/shallowMerge';
// import DEFAULT_OPERATIONS from './socialLogin.ggl';
// import { useQuery } from '@apollo/client';
import { BUTTON_SHAPE } from '../constants';
import { useUserContext } from '@magento/peregrine/lib/context/user';
import { useHistory } from 'react-router-dom';
import Identify from '../../../Helper/Identify';

export const useSocialLogin = () => {
    // const operations = mergeOperations(DEFAULT_OPERATIONS, props.operations);
    const smStoreConfig = Identify.getStoreConfig();
    
    // const { getStoreConfigQuery, getSocButtonsConfigsQuery } = operations;
    const [{ isSignedIn }] = useUserContext();
    const prevIsSignedIn = useRef(isSignedIn);
    const history = useHistory();

    // const { data: storeConfigData } = useQuery(getStoreConfigQuery, {
    //     fetchPolicy: 'cache-first',
    //     nextFetchPolicy: 'cache-first',
    //     skip: !smStoreConfig
    // });

    // const { data: buttonsConfigData } = useQuery(getSocButtonsConfigsQuery, {
    //     fetchPolicy: 'cache-first',
    //     nextFetchPolicy: 'cache-first',
    //     skip: !smStoreConfig
    // });

    const [errors, setErrors] = useState(null);

    const handleErrors = useCallback(error => setErrors(error), [setErrors]);

    // const { storeConfig } = storeConfigData || {};
    const storeConfig =
        smStoreConfig && smStoreConfig.storeConfig
            ? smStoreConfig.storeConfig
            : {};
    const buttons =
        smStoreConfig && smStoreConfig.amSocialLoginButtonConfig
            ? smStoreConfig.amSocialLoginButtonConfig
            : {};
    //const { amSocialLoginButtonConfig: buttons } = buttonsConfigData || {};

    const {
        amsociallogin_general_enabled: isEnabled,
        amsociallogin_general_button_shape,
        amsociallogin_general_button_position,
        amsociallogin_general_redirect_type: redirectType,
        amsociallogin_general_custom_url: redirectUrl,
        amsociallogin_general_login_position,
        amsociallogin_general_popup_enabled: popupEnabled
    } = storeConfig || {};

    const enabledModes =
        amsociallogin_general_login_position &&
        amsociallogin_general_login_position.split(',');

    const needRedirect = redirectType === 1 && redirectUrl;

    useEffect(() => {
        if (
            popupEnabled &&
            isSignedIn &&
            prevIsSignedIn.current !== isSignedIn &&
            needRedirect
        ) {
            history.push(`/${redirectUrl.replace(/^\//, '')}`);
        }

        prevIsSignedIn.current = isSignedIn;
    }, [
        needRedirect,
        prevIsSignedIn,
        isSignedIn,
        redirectUrl,
        history,
        popupEnabled
    ]);

    return {
        storeConfig,
        buttons,
        isEnabled: isEnabled && Array.isArray(buttons) && buttons.length,
        buttonShape: BUTTON_SHAPE[amsociallogin_general_button_shape || 0],
        buttonPosition: amsociallogin_general_button_position,
        needRedirect,
        errors,
        handleErrors,
        enabledModes
    };
};
