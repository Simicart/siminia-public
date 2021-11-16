import React from 'react';
import Identify from 'src/simi/Helper/Identify';
import { shape, string } from 'prop-types';
import { formatPriceLabel } from 'src/simi/Helper/Pricing';

const TierPrices = props => {
    const { price_tiers } = props;
    if (!price_tiers || !price_tiers instanceof Array || !price_tiers.length) return null;

    const tier_label = price_tiers.map((tier, idx) => {
        const { discount, final_price, quantity } = tier;

        const finalLabel = Identify.__('Buy %s for %k each and').replace('%s', quantity).replace('%k', formatPriceLabel(final_price.value, final_price.currency));
        const finalSave = <b>{Identify.__('save %c%').replace('%c', discount.percent_off)}</b>
        return <li key={idx}>
            {finalLabel + ' '}
            {finalSave}
        </li>
    });

    return (<ul className='tier-prices-bundle' style={{padding: 15}}>{tier_label}</ul>);
}

TierPrices.propTypes = {
    classes: shape({ root: string })
};
TierPrices.defaultProps = {};
export default TierPrices;
