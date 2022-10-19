import React, { Fragment } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import Price from '@magento/venia-ui/lib/components/Price';

import { useStyle } from '@magento/venia-ui/lib/classify';
/**
 * A component that renders the shipping summary line item after address and
 * method are selected
 *
 * @param {Object} props.classes
 * @param {Object} props.data fragment response data
 */
const GiftCardSummary = props => {
    const classes = useStyle({}, props.classes);
    const { data, currencyCode } = props;
    const { formatMessage } = useIntl();

    if (!data && !data.giftCardUsed && data.giftCardUsed.length == 0) {
        return null;
    }

    return data &&
        data.giftCardUsed &&
        data.giftCardUsed[0] &&
        data.giftCardUsed[0].amount ? (
        <Fragment>
            <span className={classes.lineItemLabel}>
                <FormattedMessage
                    id={'Discount Gift Cards'}
                    defaultMessage={'Discount Gift Cards'}
                />
            </span>
            <span className={classes.price}>
                <Price
                    value={data.giftCardUsed[0].amount}
                    currencyCode={currencyCode}
                />
            </span>
        </Fragment>
    ) : null;
};

export default GiftCardSummary;
