/* eslint-disable prefer-const */
import React, { Component, useEffect } from 'react';
import Identify from 'src/simi/Helper/Identify';
import { validateEmail } from 'src/simi/Helper/Validation';
// import {compose} from 'redux';
import classify from 'src/classify';
import defaultClasses from '../style.css';
import { Colorbtn } from '../../../../BaseComponents/Button';
import {
    showFogLoading,
    hideFogLoading
} from 'src/simi/BaseComponents/Loading/GlobalLoading';
import { toggleMessages } from 'src/simi/Redux/actions/simiactions';
import { connect } from 'src/drivers';
import { compose } from 'redux';
import { smoothScrollToView } from 'src/simi/Helper/Behavior';
import { configColor } from 'src/simi/Config';
import { gql } from '@apollo/client';
import { simiUseMutation as useMutation } from 'src/simi/Network/Query';

const $ = window.$;
const Form = props => {
    const [
        submitForm,
        { data: submitResult, loading: submitLoading, error: submitError }
    ] = useMutation(SUBMIT_CONTACT);
    const proceedData = data => {
        smoothScrollToView($('#root'));
        if (data) {
            hideFogLoading();
            if (data.errors && data.errors.length) {
                const errors = data.errors.map(error => {
                    return {
                        type: 'error',
                        message: error.message,
                        auto_dismiss: true
                    };
                });
                props.toggleMessages(errors);
            } else {
                $('#contact-form .form-control').val('');
                props.toggleMessages([
                    {
                        type: 'success',
                        message: Identify.__(
                            'Thank you, we will contact you soon !'
                        ),
                        auto_dismiss: true
                    }
                ]);
            }
        }
    };

    const validateForm = () => {
        let formCheck = true;
        $('#contact-form')
            .find('.required')
            .each(function() {
                if ($(this).val() === '' || $(this).val().length === 0) {
                    formCheck = false;
                    $(this).addClass('is-invalid');
                    if ($(this).find('is-invalid')) {
                        $(this).css({ border: '1px solid #fa0a11' });
                    }
                } else {
                    $(this).removeClass('is-invalid');
                    if ($(this).attr('name') === 'email') {
                        if (!validateEmail($(this).val())) {
                            formCheck = false;
                            $(this).css({ border: '1px solid #fa0a11' });
                            $('.invalid-email').show();
                        } else {
                            $('.invalid-email').hide();
                        }
                    }
                }
            });

        if (!formCheck) {
            smoothScrollToView($('#root'));
            props.toggleMessages([
                {
                    type: 'error',
                    message: Identify.__('Please check some required fields'),
                    auto_dismiss: true
                }
            ]);
        }

        return formCheck;
    };

    const onChange = e => {
        if (e.target.value !== '' || e.target.value !== null) {
            $(e.target).removeClass('is-invalid');
            $(e.target).removeAttr('style');
        }
    };

    const handleSubmit = e => {
        e.preventDefault();
        const isValidated = validateForm();
        const form = $('#contact-form').serializeArray();
        let value = {};
        if (isValidated) {
            for (let i in form) {
                let field = form[i];
                value[field.name] = field.value;
            }
            showFogLoading();
            submitForm({
                variables: { contactInput: value }
            });
        }
    };
    useEffect(() => {
        hideFogLoading();
        smoothScrollToView($('#root'));
        if (submitResult) {
            if (
                submitResult &&
                submitResult.contactusFormSubmit &&
                submitResult.contactusFormSubmit.success_message
            ) {
                $('#contact-form .form-control').val('');
                props.toggleMessages([
                    {
                        type: 'success',
                        message: Identify.__(
                            submitResult.contactusFormSubmit.success_message
                        ),
                        auto_dismiss: true
                    }
                ]);
            }
        } else if (submitError) {
            let derivedErrorMessage;
            if (submitError.graphQLErrors) {
                derivedErrorMessage = submitError.graphQLErrors
                    .map(({ message, debugMessage }) =>
                        debugMessage ? debugMessage : message
                    )
                    .join(', ');
            } else {
                derivedErrorMessage = submitError.message;
            }
            if (derivedErrorMessage)
                props.toggleMessages([
                    {
                        type: 'error',
                        message: derivedErrorMessage,
                        auto_dismiss: true
                    }
                ]);
        }
    }, [submitResult, submitError]);

    const { classes } = props;
    const errorEmail = (
        <small
            className="invalid-email"
            style={{ display: 'none', color: '#fa0a11' }}
        >
            {Identify.__('Invalid email')}
        </small>
    );

    return (
        <div className={classes['form-container']}>
            <form id="contact-form" onSubmit={handleSubmit}>
                <h2>{Identify.__('Contact Us')}</h2>
                <div className="form-group">
                    <input
                        type="text"
                        onChange={onChange}
                        className={`form-control ${
                            classes['base-textField']
                        } required`}
                        name="name"
                        placeholder="Name *"
                    />
                </div>
                <div className="form-group">
                    <input
                        type="text"
                        onChange={onChange}
                        className={`form-control ${
                            classes['base-textField']
                        } required`}
                        name="company"
                        placeholder="Company Name *"
                    />
                </div>
                <div className="form-group">
                    <input
                        type="text"
                        onChange={onChange}
                        className={`form-control ${
                            classes['base-textField']
                        } required`}
                        name="email"
                        placeholder="Email Address *"
                    />
                    {errorEmail}
                </div>
                <div className="form-group">
                    <input
                        type="text"
                        onChange={onChange}
                        className={`form-control ${
                            classes['base-textField']
                        } required`}
                        name="phone"
                        placeholder="Telephone *"
                    />
                </div>
                <div className="form-group fg-textarea">
                    <textarea
                        onChange={onChange}
                        className={`form-control ${
                            classes['base-textareaField']
                        } required`}
                        name="message"
                        cols="30"
                        rows="5"
                        placeholder="Enter your message here"
                    />
                </div>
                <div className={classes['contact-action-flex']}>
                    <span className={classes['requirement']}>
                        {Identify.__('* Required fields')}
                    </span>
                    <Colorbtn
                        type="submit"
                        className={classes['submit-btn']}
                        text="Submit"
                        style={{
                            backgroundColor: configColor.button_background,
                            color: configColor.button_text_color
                        }}
                    />
                </div>
                {/* <button></button> */}
            </form>
        </div>
    );
};

const mapDispatchToProps = {
    toggleMessages
};

export default compose(
    classify(defaultClasses),
    connect(
        null,
        mapDispatchToProps
    )
)(Form);

const SUBMIT_CONTACT = gql`
    mutation contactusFormSubmit($contactInput: ContactusInput!) {
        contactusFormSubmit(input: $contactInput) {
            success_message
        }
    }
`;
// export default classify(defaultClasses)(Form);
