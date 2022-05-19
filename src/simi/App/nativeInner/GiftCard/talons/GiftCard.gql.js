import gql from 'graphql-tag';
import { CartTriggerFragment } from '@magento/venia-ui/lib/components/Header/cartTriggerFragments.gql';
import { MiniCartFragment } from '@magento/venia-ui/lib/components/MiniCart/miniCart.gql';

export const ADD_GIFT_CARD_TO_CART = gql`
	mutation(
		$cart_id: String!
		$quantity: Float!
		$sku: String!
		$amount: String!
		$delivery: Int!
		$delivery_date: String
		$email: String
		$from: String
		$image: String
		$message: String
		$phone_number: String
		$range_amount: Boolean!
		$template: Int
		$timezone: String
		$to: String
	){
		addMpGiftCardProductsToCart(input: {
			cart_id: $cart_id
			cart_items: {
				data: {
					quantity: $quantity
					sku: $sku
				}
				giftcard_options: {
					amount: $amount
					delivery: $delivery
					delivery_date: $delivery_date
					email: $email
					from: $from
					image: $image
					message: $message
					phone_number: $phone_number
					range_amount: $range_amount
					template: $template
					timezone: $timezone
					to: $to
				}
			}
		}){
			cart {
				id
				# Update the cart trigger when adding an item.
                ...CartTriggerFragment
                # Update the mini cart when adding an item.
                ...MiniCartFragment
			}
		}
	}
	${CartTriggerFragment}
    ${MiniCartFragment}
`

export const GET_GIFT_CARD_DASHBOARD_CONFIG = gql`
	query mpGiftCardDashboardConfig {
	  	mpGiftCardDashboardConfig {
		    balance
		    baseUrl
		    code
		    customerEmail
		    giftCardLists {
		      	giftcard_id
		      	hidden_code
		      	balance_formatted
		      	code
		      	can_redeem
		      	created_at
		      	expired_at_formatted
		      	status_label
		      	histories {
		        	giftcard_id
		        	action_label
		        	amount_formatted
		        	status_label
		        	created_at_formatted
		      	}
		    }
		    transactions {
		      	transaction_id
		      	created_at_formatted
		      	action_label
		      	amount_formatted
		      	action_detail
		    }
		    isEnableCredit
		    notification {
		      	creditNotification
		      	giftcardNotification
		    }
	  	}
	}
`

export const UPLOAD_GIFT_CARD_IMAGE = gql`
	mutation($url: String!, $name: String!){
	  	uploadMpGiftCardImage(base64_encoded_data: $url, name: $name){
		    error
		    file
		    name
		    size
		    type
		    url
	  	}
	}
`

export const CHECK_GIFT_CARD_CODE = gql`
	query($code: String!){
	  	mpGiftCardCheckCode(code: $code) {
		    balance
		    balance_formatted
		    expired_at
		    status
		    status_label
	  	}
	}
`

export const REDEEM_GIFT_CARD = gql`
	mutation ($code: String!){
	  	redeemMpGiftCard(code: $code){
	   		customer_balance
	  	}
	}
`

export const SAVE_NOTIFICATIONS = gql`
	mutation(
		$credit_noti: Boolean, 
		$gc_noti: Boolean
	){
  		saveMpGiftCardDashBoardNotificationSettings(
  			giftcard_notification: $gc_noti, 
  			credit_notification: $credit_noti
  		)
	}
`

export const REMOVE_GIFT_CARD_FROM_LIST = gql`
	mutation ($code: String!){
	  	removeMpGiftCardFromList(code: $code){
		    balance
		    balance_formatted
		    can_redeem
		    code
		    conditions_serialized
		    created_at
		    customer_ids
		    delivery_address
		    delivery_date
		    delivery_method
		    expired_at
		    expired_at_formatted
		    extra_content
		    giftcard_id
		    hidden_code
		    histories {
			    giftcard_id
			    action_label
			    amount_formatted
			    status_label
			    created_at_formatted
		    }
		    image
		    init_balance
		    is_sent
		    order_increment_id
		    order_item_id
		    pool_id
		    status
		    status_label
		    store_id
		    template_fields
		    template_id
		    timezone
	  	}
	}
`

export const ADD_GIFT_CARD_TO_LIST = gql`
	mutation ($code: String!){
	  	addMpGiftCardList(code: $code){
		    balance
		    balance_formatted
		    can_redeem
		    code
		    conditions_serialized
		    created_at
		    customer_ids
		    delivery_address
		    delivery_date
		    delivery_method
		    expired_at
		    expired_at_formatted
		    extra_content
		    giftcard_id
		    hidden_code
		    histories {
		      	giftcard_id
			    action_label
			    amount_formatted
			    status_label
			    created_at_formatted
		    }
		    image
		    init_balance
		    is_sent
		    order_increment_id
		    order_item_id
		    pool_id
		    status
		    status_label
		    store_id
		    template_fields
		    template_id
		    timezone
	  	}
	}
`

export const SET_GIFT_CARD_CODE_TO_CART = gql`
	mutation($cartId: String!, $code: String!){
	  	setMpGiftCardCodeToCart(cartId: $cartId, code: $code) @connection(key: "setMpGiftCardCodeToCart")
	}
`

export const SET_GIFT_CARD_CREDIT_TO_CART = gql`
	mutation($cartId: String!, $amount: String!){
	  	setMpGiftCardCreditToCart(cartId: $cartId, amount: $amount) @connection(key: "setMpGiftCardCreditToCart")
	  	
	}
`

export const REMOVE_GIFT_CARD_CODE_FROM_CART = gql`
	mutation($cartId: String!, $code: String!){
	  	removeMpGiftCardCodeFromCart(cartId: $cartId, code: $code)
	}
` 

export const GET_GIFT_CARD_LIST = gql`
	query mpGiftCardDashboardConfig {
	  	mpGiftCardDashboardConfig {
		    giftCardLists {
		      	hidden_code
		      	balance_formatted
		      	balance
		      	code
		      	status_label
		    } 	
	  	}
	}
`