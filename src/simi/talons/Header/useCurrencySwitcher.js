import { useQuery } from '@apollo/client';
import { useCallback, useMemo } from 'react';
import { useHistory } from 'react-router-dom';
import { useDropdown } from '@magento/peregrine/lib/hooks/useDropdown';
import { useTypePolicies } from '@magento/peregrine';
import { BrowserPersistence } from '@magento/peregrine/lib/util';
import DEFAULT_OPERATIONS, { CUSTOM_TYPES } from './currencySwitcher.gql';
import Identify from 'src/simi/Helper/Identify';

const storage = new BrowserPersistence();

/**
 * The useCurrencySwitcher talon complements the CurrencySwitcher component.
 *
 * @param {*} props.operations the currency switcher data getCurrencyQuery
 * @param {*} props.typePolicies customization of the apollo cache's behavior for 'current_currency_code' field
 *
 * @returns {Array}     talonProps.availableCurrencies - List of available currency codes.
 * @returns {String}    talonProps.currentCurrencyCode - Currently used display currency code.
 * @returns {Boolean}   talonProps.storeMenuIsOpen - Whether the menu that this trigger toggles is open or not.
 * @returns {Ref}       talonProps.storeMenuRef - A React ref to the menu that this trigger toggles.
 * @returns {Ref}       talonProps.storeMenuTriggerRef - A React ref to the trigger element itself.
 * @returns {Function}  talonProps.handleTriggerClick - A function for handling when the trigger is clicked.
 * @returns {Function}  talonProps.handleSwitchCurrency - A function for handling when the menu item is clicked.
 */

export const useCurrencySwitcher = (props = {}) => {
    const {
        operations = DEFAULT_OPERATIONS,
        typePolicies = CUSTOM_TYPES
    } = props;
    const { getCurrencyQuery } = operations;

    useTypePolicies(typePolicies);

    // const { data: currencyData } = useQuery(getCurrencyQuery, {
    //     fetchPolicy: 'cache-and-network',
    //     nextFetchPolicy: 'cache-first'
    // });

    // const currentCurrencyCode = useMemo(() => {
    //     if (currencyData) {
    //         return currencyData.currency.current_currency_code;
    //     }
    // }, [currencyData]);

    // const availableCurrencies = useMemo(() => {
    //     if (currencyData) {
    //         return currencyData.currency.available_currency_codes;
    //     }
    // }, [currencyData]);
    //simi use currencies from settings, cause the listing is missing currency name
    const merchantConfigs = Identify.getStoreConfig();
    const currentCurrencyCode = merchantConfigs.simiStoreConfig.config.base.currency_code
    const availableCurrencies = merchantConfigs.simiStoreConfig.config.base.currencies;

    const history = useHistory();

    const handleSwitchCurrency = useCallback(
        currencyCode => {
            // Do nothing when currency code is not present in available currencies
            //simi comment if (!availableCurrencies.includes(currencyCode)) return;
            Identify.clearStoreConfig() //simi remove saved store config
            storage.setItem('store_view_currency', currencyCode);

            // Refresh the page to re-trigger the queries once currency are saved in local storage.
            history.go(0);
        },
        [availableCurrencies, history]
    );

    const {
        elementRef: currencyMenuRef,
        expanded: currencyMenuIsOpen,
        setExpanded: setCurrencyMenuIsOpen,
        triggerRef: currencyMenuTriggerRef
    } = useDropdown();

    const handleTriggerClick = useCallback(() => {
        // Toggle Stores Menu.
        setCurrencyMenuIsOpen(isOpen => !isOpen);
    }, [setCurrencyMenuIsOpen]);

    return {
        currentCurrencyCode,
        availableCurrencies,
        currencyMenuRef,
        currencyMenuTriggerRef,
        currencyMenuIsOpen,
        handleTriggerClick,
        handleSwitchCurrency
    };
};
