import React, { useCallback } from 'react';
import { Form } from 'informed';
import { Redirect } from 'src/drivers';
import { useToasts } from '@magento/peregrine';

import Loading from 'src/simi/BaseComponents/Loading';
import Button from '@magento/venia-ui/lib/components/Button';
import Checkbox from '@magento/venia-ui/lib/components/Checkbox';
import FormErrors from '@magento/venia-ui/lib/components/FormError';
import NewsletterOperations from './newsletter.gql.js';
import { useNewsletter } from 'src/simi/talons/MyAccount/useNewsletter';
import LeftMenu from '../LeftMenu/leftMenu.js';
import defaultClasses from './accountSubcriptionPage.module.css';
import { useStyle } from '@magento/venia-ui/lib/classify.js';
import { StoreTitle } from '@magento/venia-ui/lib/components/Head';
import { FormattedMessage, useIntl } from 'react-intl';

const AccountSubcriptionPage = props => {
    const [, { addToast }] = useToasts();
    const { formatMessage } = useIntl();

    const afterSubmit = useCallback(() => {
        addToast({
            type: 'info',
            message: formatMessage({
                id: 'subcriptionPage.title',
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
        isSignedIn
    } = talonProps;
    const title = formatMessage({
        id: 'subcriptionPage.title',
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
            <div className={classes.wrapper}>
                <LeftMenu label="Account Subcriptions" />
                <div className={classes.container}>
                    <div className={classes.containerSub}>
                        <StoreTitle>{title}</StoreTitle>
                        <h1 className={classes.heading}>
                            <FormattedMessage
                                id={'subcriptionPage.text'}
                                defaultMessage={'My Account'}
                            />
                        </h1>
                        <h2 className={classes.title}>
                            <FormattedMessage
                                id={'subcriptionPage.titleEdit'}
                                defaultMessage={'Newsletter Subcription'}
                            />
                        </h2>
                        <p className={classes.textSpan}>
                            <FormattedMessage
                                id={'subcriptionPage.optInText'}
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
                                    id: 'subcriptionPage.eNewsletterText',
                                    defaultMessage: 'General Subcription'
                                })}
                            />
                            <div className={classes.buttonsContainer}>
                                <Button
                                    disabled={isDisabled}
                                    type="submit"
                                    priority="high"
                                >
                                    {isDisabled
                                    ? formatMessage({
                                        id: 'subcriptionPage.savingText',
                                        defaultMessage: 'Saving'
                                    })
                                    : formatMessage({
                                        id: 'subcriptionPage.changesText',
                                        defaultMessage: 'Save Changes'
                                    })}
                                </Button>
                            </div>
                        </Form>
                    
                    </div>
                </div>
            </div>
        </div>
    );
};
export default AccountSubcriptionPage;
