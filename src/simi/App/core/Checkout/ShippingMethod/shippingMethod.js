import React, { Fragment } from 'react';
import { bool, func, shape, string } from 'prop-types';
import { Form } from 'informed';

import {
    displayStates,
    useShippingMethod
} from 'src/simi/talons/CheckoutPage/useShippingMethod';

import { mergeClasses } from '@magento/venia-ui/lib/classify';
import Button from '@magento/venia-ui/lib/components/Button';
import FormError from '@magento/venia-ui/lib/components/FormError';
import LoadingIndicator from '@magento/venia-ui/lib/components/LoadingIndicator';
import CompletedView from './completedView';
import ShippingRadios from './shippingRadios';
import UpdateModal from './updateModal';
import defaultClasses from './shippingMethod.css';
import Identify from 'src/simi/Helper/Identify';

import shippingMethodOperations from './shippingMethod.gql';

const initializingContents = (
    <LoadingIndicator>{Identify.__('Loading shipping methods...')}</LoadingIndicator>
);

const ShippingMethod = props => {
    const { onSave, pageIsUpdating, setPageIsUpdating } = props;

    const talonProps = useShippingMethod({
        onSave,
        setPageIsUpdating,
        ...shippingMethodOperations
    });

    const {
        displayState,
        formErrors,
        handleCancelUpdate,
        handleSubmit,
        isLoading,
        isUpdateMode,
        selectedShippingMethod,
        shippingMethods,
        showUpdateMode
    } = talonProps;

    const classes = mergeClasses(defaultClasses, props.classes);

    let contents;

    if (displayState === displayStates.DONE) {
        const updateFormInitialValues = {
            shipping_method: selectedShippingMethod.serializedValue
        };

        contents = (
            <Fragment>
                <div className={classes.done}>
                    <CompletedView
                        selectedShippingMethod={selectedShippingMethod}
                        showUpdateMode={showUpdateMode}
                    />
                </div>
                <UpdateModal
                    formErrors={formErrors}
                    formInitialValues={updateFormInitialValues}
                    handleCancel={handleCancelUpdate}
                    handleSubmit={handleSubmit}
                    isLoading={isLoading}
                    isOpen={isUpdateMode}
                    pageIsUpdating={pageIsUpdating}
                    shippingMethods={shippingMethods}
                />
            </Fragment>
        );
    } else {
        // We're either initializing or editing.
        let bodyContents = <div className={classes.shippingMethodLoading}>{initializingContents}</div>;

        if (displayState === displayStates.EDITING) {
            const lowestCostShippingMethodSerializedValue = shippingMethods.length
                ? shippingMethods[0].serializedValue
                : '';
            const lowestCostShippingMethod = {
                shipping_method: selectedShippingMethod ? selectedShippingMethod.serializedValue : lowestCostShippingMethodSerializedValue
            };

            bodyContents = (
                <Form
                    className={classes.form}
                    initialValues={lowestCostShippingMethod}
                    onSubmit={handleSubmit}
                >
                    <ShippingRadios
                        disabled={pageIsUpdating}
                        shippingMethods={shippingMethods}
                    />
                    {
                        (shippingMethods && shippingMethods.length) ?
                            <div className={classes.formButtons}>
                                <Button
                                    priority="normal"
                                    type="submit"
                                    disabled={pageIsUpdating}
                                >
                                    {Identify.__('Save')}
                                </Button>
                            </div> : ''
                    }
                </Form>
            );
        }

        contents = (
            <div className={classes.root}>
                <h3 className={classes.editingHeading}>{'Shipping Method'}</h3>
                <FormError errors={formErrors} />
                {bodyContents}
            </div>
        );
    }

    return <Fragment>{contents}</Fragment>;
};

ShippingMethod.propTypes = {
    classes: shape({
        done: string,
        editingHeading: string,
        form: string,
        formButtons: string,
        root: string
    }),
    onSave: func.isRequired,
    pageIsUpdating: bool,
    setPageIsUpdating: func.isRequired
};

export default ShippingMethod;
