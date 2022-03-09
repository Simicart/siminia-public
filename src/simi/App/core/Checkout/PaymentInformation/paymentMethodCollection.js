/**
 * This file is augmented at build time using the @magento/venia-ui build
 * target "checkoutPagePaymentTypes", which allows third-party modules to
 * add new payment component mappings for the checkout page.
 *
 * @see [Payment definition object]{@link PaymentDefinition}
 */
//export default {};

/**
 * A payment definition object that describes a payment in your storefront.
 *
 * @typedef {Object} PaymentDefinition
 * @property {string} paymentCode is use to map your payment
 * @property {string} importPath Resolvable path to the component the
 *   Route component will render
 *
 * @example <caption>A custom payment method</caption>
 * const myCustomPayment = {
 *      paymentCode: 'cc',
 *      importPath: '@partner/module/path_to_your_component'
 * }
 */
//simi
import {
    CheckMo,
    BankTransfer,
    COD,
    PaypalExpress,
    MyFatoorah
} from 'src/simi/BaseComponents/Payment/PlainOffline';
import { PaypalButtons } from 'src/simi/BaseComponents/Payment/PaypalButtons';
import BrainTree from '@magento/venia-ui/lib/components/CheckoutPage/PaymentInformation/creditCard';

export default {
    braintree: BrainTree,
    checkmo: CheckMo,
    banktransfer: BankTransfer,
    cashondelivery: COD,
    myfatoorah_gateway: MyFatoorah,
    paypal_express: PaypalButtons
};
