import React from 'react';
import PropTypes from 'prop-types';
import { Form } from 'informed';
import Field from '@magento/venia-ui/lib/components/Field';
import TextInput from '@magento/venia-ui/lib/components/TextInput';
import { isRequired } from 'src/util/formValidators';
import { configColor } from 'src/simi/Config';
import Identify from 'src/simi/Helper/Identify';

require('./forgotPasswordForm.scss');

const ForgotPasswordForm = props => {
    const { isResettingPassword, onSubmit } = props;

    return (
        <Form className='root forgot-pass-form' onSubmit={onSubmit}>
            <Field label={Identify.__("Email Address")} required={false} after={'*'} >
                <TextInput
                    autoComplete="email"
                    field="email"
                    validate={isRequired}
                    validateOnBlur
                />
            </Field>
            <div className='buttonContainer'>
                <button priority="high" className='submitButton' type="submit" disabled={isResettingPassword}
                    style={{ backgroundColor: configColor.button_background, color: configColor.button_text_color }}>
                    {Identify.__('Submit')}
                </button>
            </div>
        </Form>
    )
}

ForgotPasswordForm.propTypes = {
    onSubmit: PropTypes.func.isRequired
}

export default ForgotPasswordForm;
