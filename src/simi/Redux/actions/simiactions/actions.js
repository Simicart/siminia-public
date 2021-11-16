import { createActions } from 'redux-actions';

const prefix = 'SIMIACTIONS';
const actionTypes = [
    'CHANGE_SAMPLE_VALUE',
    'SET_STORE_CONFIG',
    'TOGGLE_MESSAGES',
    'CHANGE_CHECKOUT_UPDATING',
];

export default createActions(...actionTypes, { prefix });
