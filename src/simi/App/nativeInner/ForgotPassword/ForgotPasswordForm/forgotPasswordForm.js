import React from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { func, shape, string } from 'prop-types';
import { Form } from 'informed';

import { useStyle } from '@magento/venia-ui/lib/classify.js';
import { isRequired } from '@magento/venia-ui/lib/util/formValidators';
import Button from '@magento/venia-ui/lib/components/Button';
import Field from '../../Field';
import TextInput from '../../TextInput';
import defaultClasses from './forgotPasswordForm.module.css';
import { useWindowSize } from '@magento/peregrine';

const ForgotPasswordForm = props => {
    const classes = useStyle(defaultClasses, props.classes);
    const { initialValues, isResettingPassword, onSubmit, onCancel } = props;
    const windowSize = useWindowSize();
    const isPhone = windowSize.innerWidth < 450
    const { formatMessage } = useIntl();

    return (
        <Form
            className={classes.root}
            initialValues={initialValues}
            onSubmit={onSubmit}
        >
            <Field
                label={!isPhone ? formatMessage({
                    id: 'forgotPasswordForm.emailAddressText',
                    defaultMessage: 'Email address'
                }) : null}
                
            >
                <TextInput
                    autoComplete="email"
                    field="email"
                    validate={isRequired}
                    placeholder="Your email address"
                />
            </Field>
            
            <div className={classes.buttonContainer}>
                {!isPhone ? <Button
                    className={classes.cancelButton}
                    disabled={isResettingPassword}
                    type="button"
                    priority="low"
                    onClick={onCancel}
                >
                    <FormattedMessage
                        id={'forgotPasswordForm.cancelButtonText'}
                        defaultMessage={'Cancel'}
                    />
                </Button> :null}
                <Button
                    className={classes.submitButton}
                    disabled={isResettingPassword}
                    type="submit"
                    priority="high"
                >
                    <FormattedMessage
                        id={'forgotPasswordForm.submitButtonText'}
                        defaultMessage={'Submit'}
                    />
                </Button>
            </div>
        </Form>
    );
};

ForgotPasswordForm.propTypes = {
    classes: shape({
        form: string,
        buttonContainer: string
    }),
    initialValues: shape({
        email: string
    }),
    onCancel: func.isRequired,
    onSubmit: func.isRequired
};

ForgotPasswordForm.defaultProps = {
    initialValues: {}
};

export default ForgotPasswordForm;
