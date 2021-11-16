import React, { useCallback } from 'react';
import { Form } from 'informed';
import Identify from 'src/simi/Helper/Identify'
import { Redirect } from 'src/drivers';
import { useToasts } from '@magento/peregrine';

import Loading from "src/simi/BaseComponents/Loading";
import Button from '@magento/venia-ui/lib/components/Button';
import Checkbox from '@magento/venia-ui/lib/components/Checkbox';
import FormErrors from '@magento/venia-ui/lib/components/FormError';
import NewsletterOperations from './newsletter.gql.js';
import { useNewsletter } from 'src/simi/talons/MyAccount/useNewsletter';
import PageTitle from '../../Components/PageTitle';

require('./style.scss');

const Newsletter = props => {

    const [, { addToast }] = useToasts();

    const afterSubmit = useCallback(() => {
        addToast({
            type: 'info',
            message: Identify.__('Your preferences have been updated.'),
            timeout: 5000
        });
    }, [addToast]);

    const talonProps = useNewsletter({
        afterSubmit,
        ...NewsletterOperations
    });

    const {
        formErrors,
        handleSubmit,
        initialValues,
        isDisabled,
        isSignedIn
    } = talonProps;

    if (!isSignedIn) {
        return <Redirect to="/" />;
    }

    if (!initialValues) {
        return <Loading />;
    }

    return (
        <div className='newsletter-wrap'>
            <PageTitle title={Identify.__("Newsletter Subscription")} />
            <div className='subscription-title'>{Identify.__('Subscription option')}</div>
            <FormErrors errors={formErrors} />
            <Form className='newsletter-form' onSubmit={handleSubmit} initialValues={initialValues}>
                <Checkbox field="isSubscribed" label={Identify.__("General Subscription")} />
                <div className={'buttonsContainer'}>
                    <Button disabled={isDisabled} type="submit" priority="high">
                        {isDisabled ? Identify.__('Saving') : Identify.__('Save Changes')}
                    </Button>
                </div>
            </Form>
        </div>
    );
};

export default Newsletter;
