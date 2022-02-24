import React, {Fragment, useEffect} from 'react';
import {defineMessages, FormattedMessage, useIntl} from 'react-intl';
import {AlertCircle as AlertCircleIcon, Trash} from 'react-feather';
import {useToasts} from '@magento/peregrine';
import {deriveErrorMessage} from '@magento/peregrine/lib/util/deriveErrorMessage';
import {useCouponCode} from '../couponCodeHook';
import {useStyle} from '@magento/venia-ui/lib/classify';
import {Form, useFormState} from 'informed';
import Icon from '@magento/venia-ui/lib/components/Icon';
import LinkButton from '@magento/venia-ui/lib/components/LinkButton';
import defaultClasses from './couponCode.module.css';
import {RectButton} from "../RectButton";
import {RemovableTextInput} from "../RemovableTextInput";
import {bottomNotificationType} from "../bottomNotificationHook";
import {ConfirmPopup} from "../ConfirmPopup";
import LoadingIndicator from "@magento/venia-ui/lib/components/LoadingIndicator";

const errorIcon = (
    <Icon
        src={AlertCircleIcon}
        attrs={{
            width: 18
        }}
    />
);

/**
 * A child component of the PriceAdjustments component.
 * This component renders a form for addingg a coupon code to the cart.
 *
 * @param {Object} props
 * @param {Function} props.setIsCartUpdating Function for setting the updating state for the cart.
 * @param {Object} props.classes CSS className overrides.
 * See [couponCode.module.css]{@link https://github.com/magento/pwa-studio/blob/develop/packages/venia-ui/lib/components/CartPage/PriceAdjustments/CouponCode/couponCode.module.css}
 * for a list of classes you can override.
 *
 * @returns {React.Element}
 *
 * @example <caption>Importing into your project</caption>
 * import CouponCode from "@magento/venia-ui/lib/components/CartPage/PriceAdjustments/CouponCode";
 */

const messages = defineMessages({
    successApplyCoupon: {
        id: 'couponCode.successCouponApply',
        defaultMessage: `You have successfully applied coupon code "{code}"`,
        description: 'Successfully apply a coupon to cart',
    },
    successRemoveCoupon: {
        id: 'couponCode.successCouponRemove',
        defaultMessage: `You have successfully removed coupon code "{code}"`,
        description: 'Successfully remove a coupon to cart',
    },
})

const CouponCode = props => {
    const {makeNotification} = props
    const classes = useStyle(defaultClasses, props.classes);

    const {formatMessage} = useIntl();

    const talonProps = useCouponCode({
        setIsCartUpdating: props.setIsCartUpdating,
        applyCouponCallback: (code) => makeNotification({
            text: formatMessage(messages.successApplyCoupon, {
                code: code
            }),
            type: bottomNotificationType.SUCCESS
        }),
        removeCouponCallback: (code) => makeNotification({
            text: formatMessage(messages.successRemoveCoupon, {
                code: code
            }),
            type: bottomNotificationType.SUCCESS
        })
    });
    const [, {addToast}] = useToasts();
    const {
        applyingCoupon,
        data,
        errors,
        handleApplyCoupon,
        handleRemoveCoupon,
        removingCoupon
    } = talonProps;


    const error = [...errors.values()].find(x => !!x)

    useEffect(() => {
        if (error) {
            makeNotification({
                type: bottomNotificationType.FAIL,
                text: error.message
            })
        }
    }, [addToast, error]);


    if (!data) {
        return null;
    }

    if (applyingCoupon || removingCoupon) {
        return (
            <LoadingIndicator classes={{
                root: classes.loadingRoot
            }}>
                <FormattedMessage
                    id={'coupon.loading'}
                    defaultMessage={'Loading coupon...'}
                />
            </LoadingIndicator>
        )
    }

    if (errors.get('getAppliedCouponsQuery')) {
        return (
            <div className={classes.errorContainer}>
                <FormattedMessage
                    id={'couponCode.errorContainer'}
                    defaultMessage={
                        'Something went wrong. Please refresh and try again.'
                    }
                />
            </div>
        );
    }

    if (data.cart.applied_coupons) {
        const codes = data.cart.applied_coupons.map(({code}) => {
            return (
                <Fragment key={code}>
                    <span>{code}</span>
                    <ConfirmPopup
                        disabled={removingCoupon}
                        trigger={<LinkButton
                            className={classes.removeButton}
                            disabled={removingCoupon}
                        >
                            <FormattedMessage
                                id={'couponCode.removeButton'}
                                defaultMessage={'Remove'}
                            />
                        </LinkButton>
                        }
                        content={<FormattedMessage
                            id={'Delete Warning'}
                            defaultMessage={'Are you sure about remove\n' +
                                ' this coupon from the shopping cart?'}
                        />
                        }
                        confirmCallback={() => {
                            handleRemoveCoupon(code);
                        }}
                    />

                </Fragment>
            );
        });

        return <div className={classes.appliedCoupon}>{codes}</div>;
    } else {
        const errorMessage = deriveErrorMessage([
            errors.get('applyCouponMutation')
        ]);

        const formClass = errorMessage
            ? classes.entryFormError
            : classes.entryForm;

        return (
            <Form className={formClass} onSubmit={handleApplyCoupon}>
                <RemovableTextInput classes={classes}/>
                <div className={classes.applyButtonContainer}>
                    <RectButton
                        disabled={applyingCoupon}
                        priority={'normal'}
                        type={'submit'}
                    >
                        <FormattedMessage
                            id={'couponCode.apply'}
                            defaultMessage={'Apply'}
                        />
                    </RectButton>
                </div>
            </Form>
        );
    }
};

export default CouponCode;
