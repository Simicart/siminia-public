import React from 'react';
import { Form } from 'informed';
import { FormattedMessage, useIntl } from 'react-intl';
import { useStyle } from '@magento/venia-ui/lib/classify';
import { useNotification } from '../../talons/useNotification'
import Checkbox from '@magento/venia-ui/lib/components/Checkbox';
import defaultClasses from './notification.module.css';
import Button from '@magento/venia-ui/lib/components/Button';

const Notification = (props) => {
    
    const { formatMessage } = useIntl();

    const classes = useStyle(defaultClasses, props.classes);

    const talonProps = useNotification({
        formatMessage
    })

    const {
        handleSubmit,
        loading
    } = talonProps

    const textButton = loading ? (
        <FormattedMessage id={'Loading...'} defaultMessage={'Loading...'} />
    ) : (
        <FormattedMessage id={'Apply'} defaultMessage={'Apply'} />
    );

    return (
        <Form className={classes.root} onSubmit={handleSubmit}>
            <div className={classes.checkbox}>
                <Checkbox
                    field="notify_balance"
                    label={formatMessage({
                        id: 'Notify when balance is updated',
                        defaultMessage: 'Notify when balance is updated'
                    })}
                />
            </div>
            <div className={classes.checkbox}>
                <Checkbox
                    field="notify_expiration"
                    label={formatMessage({
                        id: 'Notify before expiration',
                        defaultMessage: 'Notify before expiration'
                    })}
                />
            </div>
            <Button priority="high" type="submit" disabled={loading}>
                {textButton}
            </Button>
        </Form>
    )
}

export default Notification