import React from 'react';
import { FormattedMessage } from 'react-intl';
import Price from '@magento/venia-ui/lib/components/Price';
import { CrossedOutPrice } from './CrossedOutPrice';

export const PriceWrapper = props => {
    const { fromValue, toValue, currencyCode, value, baseValue } = props;

    const isFromToPrice = !!fromValue && !!toValue;

    if (!!baseValue && baseValue > value) {
        return (
            <>
                <CrossedOutPrice
                    currencyCode={currencyCode}
                    value={baseValue}
                />
                <span> </span>
                <Price currencyCode={currencyCode} value={value} />
            </>
        );
    }

    if (isFromToPrice) {
        if (fromValue !== toValue) {
            return (
                <>
                    <FormattedMessage
                        id={'productDetail.fromPrice'}
                        defaultMessage={'From'}
                    />
                    <span> </span>
                    <Price currencyCode={currencyCode} value={fromValue} />
                    <span> </span>
                    <FormattedMessage
                        id={'productDetail.toPrice'}
                        defaultMessage={'to'}
                    />
                    <span> </span>
                    <Price currencyCode={currencyCode} value={toValue} />
                </>
            );
        } else {
            return <Price currencyCode={currencyCode} value={fromValue} />;
        }
    } else {
        return <Price currencyCode={currencyCode} value={value} />;
    }
};

export default PriceWrapper;
