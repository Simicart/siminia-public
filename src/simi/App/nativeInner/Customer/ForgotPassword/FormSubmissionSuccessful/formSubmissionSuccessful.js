import React from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { shape, string } from 'prop-types';

import { useStyle } from '@magento/venia-ui/lib/classify';
import defaultClasses from './formSubmissionSuccessful.module.css';

const FormSubmissionSuccessful = props => {
    const { email } = props;
    const { formatMessage } = useIntl();
    const classes = useStyle(defaultClasses, props.classes);

    // const textMessage = formatMessage(
    //     {
    //         id: 'formSubmissionSuccessful.textMessage',
    //         defaultMessage:
    //             'If there is an account associated with {email} you will receive an email with a link to change your password.'
    //     },
    //     { email }
    // );

    return (
        <div className={classes.root}>
            <h2 className={classes.title}>
                <FormattedMessage
                    id={'RECOVER PASSWORD'}
                    defaultMessage={'Recover Password'}
                />
            </h2>
            <p className={classes.text} data-cy="formSubmissionSuccessful-text">
                {/* {textMessage} */}
                {formatMessage({
                    id: 'If there is an account associated with',
                    defaultMessage: 'If there is an account associated with'
                })}
                {formatMessage({
                    id: `${email}`,
                    defaultMessage: `${email}`
                })}
                {formatMessage({
                    id:
                        'you will receive an email with a link to change your password.',
                    defaultMessage:
                        'you will receive an email with a link to change your password.`'
                })}
            </p>
        </div>
    );
};

export default FormSubmissionSuccessful;

FormSubmissionSuccessful.propTypes = {
    classes: shape({
        root: string,
        text: string
    }),
    email: string
};
