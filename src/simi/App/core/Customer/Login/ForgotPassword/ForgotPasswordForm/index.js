import React from 'react';
import PropTypes from 'prop-types';
import { Form } from 'informed';
import Field from 'src/components/Field';
import TextInput from 'src/components/TextInput';
import { isRequired } from 'src/util/formValidators';
import {configColor} from 'src/simi/Config'
import Identify from 'src/simi/Helper/Identify'
import classes from './forgotPasswordForm.css';

const ForgotPasswordForm  =  props => {
    const { onSubmit } = props;

    return (
        <Form
            className={classes.root}
            onSubmit={onSubmit}
        >
            <Field label="Email Address" required={true}>
                <TextInput
                    autoComplete="email"
                    field="email"
                    validate={isRequired}
                    validateOnBlur
                />
            </Field>
            <div className={classes.buttonContainer}>
                <button 
                    priority="high" className={classes.submitButton} type="submit" 
                    style={{backgroundColor: configColor.button_background, color: configColor.button_text_color}}>
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
