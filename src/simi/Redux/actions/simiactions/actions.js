import { createActions } from 'redux-actions';

const prefix = 'SIMIACTIONS';
const actionTypes = [
    'CHANGE_SAMPLE_VALUE',
    'TOGGLE_MESSAGES',
];

export default createActions(...actionTypes, { prefix });
