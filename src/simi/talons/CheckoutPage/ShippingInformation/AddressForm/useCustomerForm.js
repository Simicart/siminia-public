import { useCallback, useEffect } from 'react';
import { simiUseMutation as useMutation, simiUseQuery as useQuery } from 'src/simi/Network/Query';

export const useCustomerForm = props => {
    const {
        afterSubmit,
        mutations: {
            createCustomerAddressMutation,
            updateCustomerAddressMutation
        },
        onCancel,
        queries: {
            getCustomerQuery,
            getCustomerAddressesQuery,
            getDefaultShippingQuery
        },
        shippingData
    } = props;

    const [
        createCustomerAddress,
        {
            error: createCustomerAddressError,
            loading: createCustomerAddressLoading
        }
    ] = useMutation(createCustomerAddressMutation);

    const [
        updateCustomerAddress,
        {
            error: updateCustomerAddressError,
            loading: updateCustomerAddressLoading
        }
    ] = useMutation(updateCustomerAddressMutation);

    const {
        error: getCustomerError,
        data: customerData,
        loading: getCustomerLoading
    } = useQuery(getCustomerQuery);

    useEffect(() => {
        if (getCustomerError) {
            console.error(getCustomerError);
        }
    }, [getCustomerError]);

    const isSaving =
        createCustomerAddressLoading || updateCustomerAddressLoading;

    // Simple heuristic to indicate form was submitted prior to this render
    const isUpdate = !!shippingData.city;

    const { country, region } = shippingData;
    const { code: countryCode } = country;
    const { id: regionId, region_id, region_code, region: regionText } = region;
    // Deprecated "id: regionId"
    // We provide text value if region id is zero (mean that no region option selection) 
    const regionValue = parseInt(region_id) !== 0 ? region_id : (regionText || region_code || '');

    let initialValues = {
        ...shippingData,
        country: countryCode,
        region: regionValue
    };

    const hasDefaultShipping =
        !!customerData && !!customerData.customer.default_shipping;

    // For first time creation pre-fill the form with Customer data
    if (!isUpdate && !getCustomerLoading && !hasDefaultShipping) {
        const { customer } = customerData;
        const { email, firstname, lastname } = customer;
        const defaultUserData = { email, firstname, lastname };
        initialValues = {
            ...initialValues,
            ...defaultUserData
        };
    }

    const handleSubmit = useCallback(
        async (formValues, isRegionTextField) => {
            // eslint-disable-next-line no-unused-vars
            const { country, email, region, ...address } = formValues;
            try {
                const customerAddress = {
                    ...address,
                    country_code: country,
                    region: {
                        region_id: region
                    }
                };
                if (isRegionTextField) {
                    customerAddress.region = { region }
                }

                if (isUpdate) {
                    const { id: addressId } = shippingData;
                    await updateCustomerAddress({
                        variables: {
                            addressId,
                            address: customerAddress
                        },
                        refetchQueries: [{ query: getCustomerAddressesQuery }]
                    });
                } else {
                    await createCustomerAddress({
                        variables: {
                            address: customerAddress
                        },
                        refetchQueries: [
                            { query: getCustomerAddressesQuery },
                            { query: getDefaultShippingQuery }
                        ]
                    });
                }
            } catch {
                return;
            }

            if (afterSubmit) {
                afterSubmit();
            }
        },
        [
            afterSubmit,
            createCustomerAddress,
            getCustomerAddressesQuery,
            getDefaultShippingQuery,
            isUpdate,
            shippingData,
            updateCustomerAddress
        ]
    );

    const handleCancel = useCallback(() => {
        onCancel();
    }, [onCancel]);

    return {
        formErrors: [createCustomerAddressError, updateCustomerAddressError],
        handleCancel,
        handleSubmit,
        hasDefaultShipping,
        initialValues,
        isLoading: getCustomerLoading,
        isSaving,
        isUpdate
    };
};
