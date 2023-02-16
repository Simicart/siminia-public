import { useCallback } from 'react';
import checkEnabledGiftCard from '../../../giftcard/functions/gift-card-store-config/checkEnabledGiftCard'

/**
 * @param {Object}      props
 * @param {Function}    props.onSignOut - A function to call when sign out occurs.
 *
 * @returns {Object}    result
 * @returns {Function}  result.handleSignOut - The function to handle sign out actions.
 */
export const useAccountMenuItems = props => {
    const { onSignOut } = props;

    const handleSignOut = useCallback(() => {
        onSignOut();
    }, [onSignOut]);
    const rewardPointEnabled =
        window.SMCONFIGS &&
        window.SMCONFIGS.plugins &&
        window.SMCONFIGS.plugins.SM_ENABLE_REWARD_POINTS &&
        parseInt(window.SMCONFIGS.plugins.SM_ENABLE_REWARD_POINTS) === 1;

        const giftCardEnabled = checkEnabledGiftCard()

    let MENU_ITEMS = [
        {
            name: 'Order History',
            id: 'accountMenu.orderHistoryLink',
            url: '/order-history'
        },
        // Hide links until features are completed
        // {
        //     name: 'Store Credit & Gift Cards',
        //     id: 'accountMenu.storeCreditLink',
        //     url: ''
        // },
        {
            name: 'WishList',
            id: 'WishList',
            url: '/wishlist'
        },
        {
            name: 'Address Book',
            id: 'accountMenu.addressBookLink',
            url: '/address-book'
        },
        // {
        //     name: 'Saved Payments',
        //     id: 'Saved Payments',
        //     url: '/saved-payments'
        // },
        // {
        //     name: 'Product Review',
        //     id: 'Product Review',
        //     url: '/product-review'
        // },
        // {
        //     name: 'Communications',
        //     id:  'Communications',
        //     url: '/communications'
        // },
        {
            name: 'Account Information',
            id: 'Account Information',
            url: '/account-information'
        },
        {
            name: 'Account Subcriptions',
            id: 'Account Subcriptions',
            url: '/account-subcriptions'
        },
        {
            name: 'Product Alert',
            id: 'Product Alert',
            url: '/product-alert'
        },
    ];
    const rewardItems = [
        {
            name: 'Reward Points',
            id: 'Reward Points',
            url: '/reward-points'
        },
        {
            name: 'Reward Transactions',
            id: 'Reward Transactions',
            url: '/reward-transactions'
        }
    ];

    const giftCardContent = [
        {
            name: 'My Gift Cards',
            id: 'My Gift Cards',
            url: '/my-gift-cards'
        }
    ];

    if(rewardPointEnabled){
        MENU_ITEMS = MENU_ITEMS.concat(rewardItems)
    }

    if(giftCardEnabled){
        MENU_ITEMS = MENU_ITEMS.concat(giftCardContent)
    }

    return {
        handleSignOut,
        menuItems: MENU_ITEMS
    };
};