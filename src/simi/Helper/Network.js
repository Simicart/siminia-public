import Identify from './Identify'
import * as Constants from 'src/simi/Config/Constants';

export const addRequestVars = (variables) => {
    variables = variables?variables:{}
    const simiSessId = Identify.getDataFromStoreage(Identify.LOCAL_STOREAGE, Constants.SIMI_SESS_ID)
    if (simiSessId && !variables.hasOwnProperty(simiSessId))
        variables.simiSessId = simiSessId
    const appSettings = Identify.getAppSettings()
    if (appSettings) {
        if (appSettings.store_id)
            variables.simiStoreId = appSettings.store_id
        if (appSettings.currency)
            variables.simiCurrency = appSettings.currency
    }
    return variables
}
