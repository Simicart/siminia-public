import React, {Fragment} from 'react';
import TextInput from "@magento/venia-ui/lib/components/TextInput";
import {useIntl} from "react-intl";
import {useFormApi, useFormState} from "informed";

export const RemovableTextInput = (props) => {
    const {classes} = props
    const {formatMessage} = useIntl();
    const formAPI = useFormApi()


    const removeCurrentTextIcon = (
        <span>
                <img
                    src={require('../../../../../../static/icons/close-circle.svg')}
                    alt={'remove'}
                    className={classes.removeCurrentTextIcon}
                    onClick={() => {
                        formAPI.resetField('couponCode')
                    }}
                />
        </span>
    )

    return (
        <Fragment>
            <span className={classes.internalTextContainer}>
            <TextInput
                field="couponCode"
                id={'couponCode'}
                placeholder={formatMessage({
                    id: 'couponCode.enterCode',
                    defaultMessage: 'Enter a coupon code'
                })}
                mask={value => value && value.trim()}
                maskOnBlur={true}
                classes={{
                    input: classes.couponCodeInput,
                    input_error: classes.couponCodeInputError
                }}
            />
                {removeCurrentTextIcon}
            </span>
        </Fragment>
    );
};

