import React from 'react';
import { arrayOf, shape, string } from 'prop-types';

import { useStyle } from '@magento/venia-ui/lib/classify';
import defaultClasses from './card.module.css';

const Card = props => {
    const { classes: propClasses, shippingData } = props;

    const {
        city,
        country: { label: country },
        email,
        firstname,
        lastname,
        postcode,
        region: { region },
        street,
        telephone
    } = shippingData;

    const streetRows = street.map((row, index) => {
        return <span key={index}>{row}</span>;
    });

    const classes = useStyle(defaultClasses, propClasses);

    const nameString = `${firstname} ${lastname}`;
    const additionalAddressString = `${city}, ${region} ${postcode} ${country}`;

    return (
        <div className={classes.root}>
            <span>{`${nameString} | ${telephone} `}</span>
            <div className={classes.address}>
                {streetRows}
                <span>{additionalAddressString}</span>
            </div>
            <span>{email}</span>
        </div>
    );
};

export default Card;

Card.propTypes = {
    classes: shape({
        root: string,
        address: string,
        area: string
    }),
    shippingData: shape({
        city: string.isRequired,
        country: shape({
            label: string.isRequired
        }).isRequired,
        email: string.isRequired,
        firstname: string.isRequired,
        lastname: string.isRequired,
        postcode: string.isRequired,
        region: shape({
            region: string.isRequired
        }).isRequired,
        street: arrayOf(string).isRequired,
        telephone: string.isRequired
    }).isRequired
};
