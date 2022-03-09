import React from 'react';
import TitleHelper from 'src/simi/Helper/TitleHelper';
import { useIntl } from 'react-intl';

const CheckoutFailure = props => {
    const { formatMessage } = useIntl();
    return (
        <div>
            {TitleHelper.renderMetaHeader({
                title: formatMessage({
                    id: 'Payment Failure, please try again.'
                })
            })}
            <div style={{ padding: 50, textAlign: 'center' }}>
                {formatMessage({ id: 'Payment Failure, please try again.' })}
            </div>
        </div>
    );
};

export default CheckoutFailure;
