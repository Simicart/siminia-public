import { gql } from '@apollo/client';
import { CartPageFragment } from './cartPageFragments.gql';

const giftCardEnabled =
    window.SMCONFIGS &&
    window.SMCONFIGS.plugins &&
    window.SMCONFIGS.plugins.SM_ENABLE_GIFT_CARD &&
    parseInt(window.SMCONFIGS.plugins.SM_ENABLE_GIFT_CARD) === 1;


const GET_CART_DETAILS = gql`
    query GetCartDetails($cartId: String!) {
        cart(cart_id: $cartId) {
            id
            ...CartPageFragment
            ${giftCardEnabled ? 
                `
                mp_giftcard_config {
                    giftCardUsed {
                      code
                      amount
                    }
                    listGiftCard {
                        balance
                        code
                        hidden
                    }
                    creditUsed
                    maxUsed
                }
                `
            : ''}
            
        }
    }
    ${CartPageFragment}
`;

export default {
    getCartDetailsQuery: GET_CART_DETAILS
};
