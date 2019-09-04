import { handleActions } from 'redux-actions';

import simiActions from 'src/simi/Redux/actions/simiactions';


const initialState = {
    simiValue: 'cody_initialize_value',
    simiCheckoutUpdating: false,
    simiMessages: [],// [{type: 'success', message: 'sample', auto_dismiss: true}]
};

const reducerMap = {
    [simiActions.changeSampleValue]: (state, { payload }) => {
        return {
            ...state,
            simiValue: payload
        };
    },
    [simiActions.toggleMessages]: (state, { payload }) => {
        return {
            ...state,
            simiMessages: payload
        };
    },
    [simiActions.changeCheckoutUpdating]: (state, { payload }) => {
        return {
            ...state,
            simiCheckoutUpdating: payload
        };
    },
};

export default handleActions(reducerMap, initialState);
