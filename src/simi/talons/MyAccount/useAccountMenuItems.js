import { useCallback } from 'react';
import { getRewardPointActive } from 'src/simi/BaseComponents/RewardPoint/utils'

/**
 * @param {Object}      props
 * @param {Function}    props.onSignOut - A function to call when sign out occurs.
 *
 * @returns {Object}    result
 * @returns {Function}  result.handleSignOut - The function to handle sign out actions.
 */
export const useAccountMenuItems = props => {
    const { onSignOut } = props;
    const rewardPointActive = getRewardPointActive()

    const handleSignOut = useCallback(() => {
        onSignOut();
    }, [onSignOut]);

    const rewardPointEnabled =
        window.SMCONFIGS &&
        window.SMCONFIGS.plugins &&
        window.SMCONFIGS.plugins.SM_ENABLE_REWARD_POINTS &&
        parseInt(window.SMCONFIGS.plugins.SM_ENABLE_REWARD_POINTS) === 1;

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
        }
    ];
    const rewardItems = [
        {
            name: 'Reward Points',
            id: 'Reward Points',
            url: '/reward-points'
        }
    ];
    if(rewardPointActive){
        MENU_ITEMS = MENU_ITEMS.concat(rewardItems)
    }

    return {
        handleSignOut,
        menuItems: MENU_ITEMS
    };
};