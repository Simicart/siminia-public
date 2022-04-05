import React, { Fragment } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { Form } from 'informed';
import { func, shape, string } from 'prop-types';
import { useShippingForm } from '@magento/peregrine/lib/talons/CartPage/PriceAdjustments/ShippingMethods/useShippingForm';

import { useStyle } from '@magento/venia-ui/lib/classify';
import { isRequired } from '@magento/venia-ui/lib/util/formValidators';
import Button from '@magento/venia-ui/lib/components/Button';

import Country from '@magento/venia-ui/lib/components/Country';
import FormError from '@magento/venia-ui/lib/components/FormError';
import Region from '@magento/venia-ui/lib/components/Region';
import Postcode from '@magento/venia-ui/lib/components/Postcode';
import defaultClasses from './shippingForm.module.css';
import {configColor} from "../../../../../Config";

const ShippingForm = props => {
    const { hasMethods, selectedShippingFields, setIsCartUpdating } = props;
    const talonProps = useShippingForm({
        selectedValues: selectedShippingFields,
        setIsCartUpdating
    });
    const {
        errors,
        handleOnSubmit,
        handleZipChange,
        isSetShippingLoading
    } = talonProps;
    const { formatMessage } = useIntl();

    const classes = useStyle(defaultClasses, props.classes);

    const shippingStatusMessage = isSetShippingLoading
        ? formatMessage({
              id: 'shippingForm.loading',
              defaultMessage: 'Loading Methods...'
          })
        : formatMessage({
              id: 'shippingForm.getShippingOptions',
              defaultMessage: 'Get Shipping Options'
          });

    return (
        <Fragment>
            <h3 className={classes.formTitle}>
                <FormattedMessage
                    id={'shippingForm.formTitle'}
                    defaultMessage={'Destination'}
                />
            </h3>
            <FormError errors={Array.from(errors.values)} />
            <Form
                className={classes.root}
                initialValues={selectedShippingFields}
                onSubmit={handleOnSubmit}
            >
                <Country validate={isRequired} />
                <Region validate={isRequired} />
                <Postcode
                    fieldInput="zip"
                    validate={isRequired}
                    onValueChange={handleZipChange}
                />
                {!hasMethods ? (
                    <Button
                        classes={{
                            root_normalPriority: classes.submit
                        }}
                        disabled={isSetShippingLoading}
                        priority="normal"
                        type="submit"
                        style={{
                            backgroundColor: configColor.button_background,
                            color: configColor.button_text_color,
                        }}
                    >
                        {shippingStatusMessage}
                    </Button>
                ) : null}
            </Form>
        </Fragment>
    );
};

export default ShippingForm;

ShippingForm.propTypes = {
    classes: shape({
        zip: string
    }),
    selectedShippingFields: shape({
        country: string.isRequired,
        region: string.isRequired,
        zip: string.isRequired
    }),
    setIsFetchingMethods: func
};
