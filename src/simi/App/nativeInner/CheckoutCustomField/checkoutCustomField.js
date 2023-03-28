import React, {
    forwardRef,
    useState,
    useImperativeHandle,
    useEffect
} from 'react';
import defaultClasses from './checkoutCustomField.module.css';
import Identify from 'src/simi/Helper/Identify';
import { useStyle } from '@magento/venia-ui/lib/classify';
import { useCheckoutCustomFieldConfig } from './talons/useCheckoutCustomFieldConfig';
import { useCheckoutCustomFieldData } from './talons/useCheckoutCustomFieldData';
import { randomString } from '../../core/TapitaPageBuilder/CarefreeHorizontalScroll/randomString';
import RadioCheckbox from 'src/simi/BaseComponents/RadioCheckbox';
import Checkbox from '@magento/venia-ui/lib/components/Checkbox';
import { Form } from 'informed';
import RadioGroup from '@magento/venia-ui/lib/components/RadioGroup';
import Radio from '@magento/venia-ui/lib/components/RadioGroup/radio';
import TextInput from '@magento/venia-ui/lib/components/TextInput';
import Field from '@magento/venia-ui/lib/components/Field';
import {
    isRequired,
    hasLengthAtLeast,
    validatePassword,
    isNotEqualToField,
    isEqualToField
} from '@magento/venia-ui/lib/util/formValidators';
import DatePicker from 'react-datepicker';
import TextArea from '@magento/venia-ui/lib/components/TextArea';
import Dropdownoption from 'src/simi/BaseComponents/Dropdownoption/';
import { useBaseInput } from '../../core/SimiProductOptions/CustomOption/utils/useBaseInput';
import { useCartContext } from '@magento/peregrine/lib/context/cart';
import { useMutation } from '@apollo/client';
import { SET_QUOTE_CHECKOUT_CUSTOM_FIELD } from './talons/checkoutCustomField.gql';
import Button from '@magento/venia-ui/lib/components/Button';
import { FormattedMessage } from 'react-intl';
import Loader from '../Loader';

const CheckoutCustomField = props => {
    const storeConfig = Identify.getStoreConfig();
    const { id } = storeConfig?.storeConfig || '';

    const classes = useStyle(defaultClasses, props.classes);
    const {
        handleSubmit,
        handleChange,
        inputs,
        setInputs,
        checkoutCustomFieldData,
        loading,
        setQuoteCheckoutCustomFieldData,
        checkoutCustomFieldError
    } = useCheckoutCustomFieldData();

    const {
        checkoutCustomFieldConfig,
        checkoutCustomFieldConfigLoading,
        checkoutCustomFieldConfigError
    } = useCheckoutCustomFieldConfig();
    const {
        is_enabled
    } = checkoutCustomFieldConfig?.getCheckoutCustomFieldConfig;
    const { getAllCheckoutCustomFieldData } = checkoutCustomFieldData || [];

    const handleCustomField = () => {
        return getAllCheckoutCustomFieldData?.map(customField => {
            const {
                applied_customer_group,
                attribute_code,
                attribute_id,
                backend_label,
                customer_group,
                frontend_input,
                frontend_label,
                is_required,
                options,
                show_in_checkout,
                show_in_email,
                show_in_order,
                show_in_pdf,
                sort_order,
                store_id,
                visible_backend,
                visible_frontend
            } = customField;
            switch (frontend_input) {
                case 'multiselect':
                    return (
                        options.length > 0 && (
                            <div
                                className={classes.multiselect}
                                key={attribute_id}
                            >
                                <label className={classes.label}>
                                    {frontend_label}
                                </label>
                                <div className={classes.options}>
                                    {options
                                        .filter(item => item.store_id === id)
                                        .map(option => {
                                            return (
                                                <div className={classes.option}>
                                                    <input
                                                        onChange={handleChange}
                                                        id={option.value_id}
                                                        value={option.value_id}
                                                        name={attribute_code}
                                                        type="checkbox"
                                                        // checked = {isChecked}
                                                    />
                                                    <label for={option.value}>
                                                        {option.value}
                                                    </label>
                                                </div>
                                            );
                                        })}
                                </div>
                            </div>
                        )
                    );
                case 'select':
                    return (
                        <div className={classes.select} key={attribute_id}>
                            <label className={classes.label}>
                                {frontend_label}
                            </label>
                            <div className={classes.options}>
                                {options
                                    .filter(item => item.store_id === id)
                                    .map(option => {
                                        return (
                                            <div className={classes.option}>
                                                <input
                                                    onChange={handleChange}
                                                    type="radio"
                                                    id={option.value_id}
                                                    name={attribute_code}
                                                    value={option.value_id}
                                                />
                                                <label for={option.value}>
                                                    {option.value}
                                                </label>
                                            </div>
                                        );
                                    })}
                            </div>
                        </div>
                    );
                case 'text':
                    return (
                        <div className={classes.customField} key={attribute_id}>
                            <label className={classes.label}>
                                {frontend_label}
                            </label>
                            <div>
                                <input
                                    onChange={handleChange}
                                    type="text"
                                    id={attribute_code}
                                    name={attribute_code}
                                />
                            </div>
                        </div>
                    );
                case 'textarea':
                    return (
                        <div className={classes.customField} key={attribute_id}>
                            <label className={classes.label}>
                                {frontend_label}
                            </label>
                            <div>
                                <textarea
                                    onChange={handleChange}
                                    id={attribute_code}
                                    name={attribute_code}
                                />
                            </div>
                        </div>
                    );
                case 'date':
                    return (
                        <div className={classes.dateTime} key={attribute_id}>
                            <label className={classes.label}>
                                {frontend_label}
                            </label>
                            <input
                                id={attribute_code}
                                name={attribute_code}
                                onChange={handleChange}
                                type="date"
                            />
                        </div>
                    );
                case 'dropdown':
                    return (
                        <div className={classes.customField} key={attribute_id}>
                            <label className={classes.label}>
                                {frontend_label}
                            </label>
                            <div>
                                <select
                                    name={attribute_code}
                                    onChange={handleChange}
                                >
                                    <option value="Please select">
                                        Please select
                                    </option>
                                    {options
                                        .filter(item => item.store_id === id)
                                        .map(option => {
                                            return (
                                                <option value={option.value_id}>
                                                    {option.value}
                                                </option>
                                            );
                                        })}
                                </select>
                            </div>
                        </div>
                    );
                case 'boolean':
                    return (
                        <div className={classes.customField} key={attribute_id}>
                            <label className={classes.label}>
                                {frontend_label}
                            </label>
                            <div>
                                <select
                                    name={attribute_code}
                                    onChange={handleChange}
                                >
                                    <option value="Please select">
                                        Please select
                                    </option>
                                    <option value="1">Yes</option>
                                    <option value="0">No</option>
                                </select>
                            </div>
                        </div>
                    );
            }
        });
    };

    if (loading) {
        return <Loader />;
    }

    return is_enabled ? (
        <div className={classes.root}>
            <h5 className={classes.title}>Custom field</h5>
            <form onSubmit={handleSubmit} className={classes.form}>
                {handleCustomField()}
                <Button
                    className={classes.btnApply}
                    // onClick={() => handleSubmit()}
                    priority={'normal'}
                    type={'submit'}
                    disabled={Object.entries(inputs).length === 0}
                >
                    <FormattedMessage id={'Apply'} defaultMessage={'Apply'} />
                </Button>
            </form>
        </div>
    ) : (
        ''
    );
};

export default CheckoutCustomField;
