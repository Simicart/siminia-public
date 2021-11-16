import Identify from './Identify'

let address_fields_config

const getAddressFieldsConfig = () => {
    if (!address_fields_config) {
        try {
            const storeConfig = Identify.getStoreConfig();
            address_fields_config = storeConfig.simiStoreConfig.config.customer.address_fields_config
        } catch (err) {
            return false
        }
    }
    return address_fields_config
}

/**
 *  get CIM enabled or not
 * @return Bool
 */
export const isSimiCIMEnabled = () => {
    const address_fields_config = getAddressFieldsConfig()
    return !!parseInt(address_fields_config.enable)
}

/**
 *  get CIM field config
 *  @param: fieldCode(String!)
 *  @return: 1 - required, 2 - optional, 3 - hide || false,
 */
export const getCIMConf = (fieldCode) => {
    const address_fields_config = getAddressFieldsConfig()
    if (!address_fields_config)
        return false
    return parseInt(address_fields_config[fieldCode + '_show'])
}

/**
 * fullfill the form with hidden addresses using configuration value
 * @param Object values
 * @return Object
 * 
 */
export const fullFillAddress = (values, billingForm = false) => {
    const address_fields_config = getAddressFieldsConfig()
    if (address_fields_config) {
        const submitValues = { ...values }
        if (!submitValues.city) submitValues.city = address_fields_config.city_default || 'NA';
        if (billingForm) {
            if (!submitValues.street1) submitValues.street1 = address_fields_config.street_default || 'NA'; //billing address using street1 and street2 instead of array
            if (!submitValues.postalCode) submitValues.postalCode = address_fields_config.zipcode_default || 'NA'; //billing address using postalCode key
            if (!submitValues.phoneNumber) submitValues.phoneNumber = address_fields_config.telephone_default || 'NA';
            if (!submitValues.region) submitValues.region = address_fields_config.region_id_default || 'NA';
        } else {
            if (!submitValues.street || !submitValues.street[0]) submitValues.street = [address_fields_config.street_default || 'NA'];
            if (!submitValues.postcode) submitValues.postcode = address_fields_config.zipcode_default || 'NA';
            if (!submitValues.telephone) submitValues.telephone = address_fields_config.telephone_default || 'NA';
            if (!submitValues.region) submitValues.region = address_fields_config.region_id_default || 'NA';
        }
        return submitValues
    }
    return values
}
