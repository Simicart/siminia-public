import React, { useCallback } from 'react';
import { Form } from 'informed';
import { Redirect } from 'src/drivers';
import { useToasts } from '@magento/peregrine';
import AlertMessages from '../ProductFullDetail/AlertMessages';

import Loading from 'src/simi/BaseComponents/Loading';
import Button from '@magento/venia-ui/lib/components/Button';
import Checkbox from '@magento/venia-ui/lib/components/Checkbox';
import FormErrors from '@magento/venia-ui/lib/components/FormError';
import NewsletterOperations from './newsletter.gql.js';
import { useNewsletter } from '../talons/MyAccount/useNewsletter';
import LeftMenu from '../../core/LeftMenu';
import defaultClasses from './accountSubcriptionPage.module.css';
import { useStyle } from '@magento/venia-ui/lib/classify.js';
import { StoreTitle } from '@magento/venia-ui/lib/components/Head';
import { FormattedMessage, useIntl } from 'react-intl';
import { useWindowSize } from '@magento/peregrine';

const AccountSubcriptionPage = props => {
    const [, { addToast }] = useToasts();
    const { formatMessage } = useIntl();
    const windowSize = useWindowSize();
    const isPhone = windowSize.innerWidth < 450

  

    const afterSubmit = useCallback(() => {
        addToast({
            type: 'info',
            message: formatMessage({
                id: 'Your preferences have been updated.',
                defaultMessage: 'Your preferences have been updated.'
            }),
            timeout: 5000
        });
    }, [addToast]);

    const talonProps = useNewsletter({
        afterSubmit,
        ...NewsletterOperations
    });
    const classes = useStyle(defaultClasses);

    const {
        formErrors,
        handleSubmit,
        initialValues,
        isDisabled,
        isSignedIn,
        alertMsg, 
        setAlertMsg
    } = talonProps;

    const alertText = formatMessage({
        id: 'Your preferences have been updated.',
        defaultMessage: 'Your preferences have been updated.'
    });
    const title = formatMessage({
        id: 'Account Subcription',
        defaultMessage: 'Account Subcriptions'
    });

    if (!isSignedIn) {
        return <Redirect to="/" />;
    }

    if (!initialValues) {
        return <Loading />;
    }

    return (
        <div className={`${classes.root} container`}>
             <AlertMessages
                message={alertText}
                setAlertMsg={setAlertMsg}
                alertMsg={alertMsg}
                status='success'
            />
            <div className={classes.wrapper}>
                <LeftMenu label="Account Subcriptions" />
                <div className={classes.container}>
                    <div className={classes.containerSub}>
                        <StoreTitle>{title}</StoreTitle>
                        {!isPhone && <h1 className={classes.heading}>
                            <FormattedMessage
                                id={'My Account'}
                                defaultMessage={'My Account'}
                            />
                        </h1>}
                        <h2 className={classes.title}>
                            <FormattedMessage
                                id={'Newsletter Subcription'}
                                defaultMessage={'Newsletter Subcription'}
                            />
                        </h2>
                        <p className={classes.textSpan}>
                            <FormattedMessage
                                id={'Subscription option'}
                                defaultMessage={'Subscription option'}
                            />
                        </p>
                        <FormErrors errors={formErrors} />
                        <Form
                            className={classes.form}
                            onSubmit={handleSubmit}
                            initialValues={initialValues}
                        >
                            <Checkbox
                                field="isSubscribed"
                                label={formatMessage({
                                    id: 'General Subcription',
                                    defaultMessage: 'General Subcription'
                                })}
                            />
                            <div className={!isDisabled ? classes.buttonsContainer : classes.disabled}>
                                <button
                                    disabled={isDisabled}
                                    type="submit"
                                    priority="high"
                                    
                                >
                                    {isDisabled
                                    ? formatMessage({
                                        id: 'Saving',
                                        defaultMessage: 'Saving'
                                    })
                                    : formatMessage({
                                        id: 'Save changes',
                                        defaultMessage: 'Save Changes'
                                    })}
                                </button>
                            </div>
                        </Form>
                    
                    </div>
                </div>
            </div>
        </div>
    );
};
export default AccountSubcriptionPage;
