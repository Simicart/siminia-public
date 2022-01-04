import { createActions } from 'redux-actions';

const prefix = 'SIMIACTIONS';
const actionTypes = ['CHANGE_SAMPLE_VALUE', 'SET_STORE_CONFIG'];

export default createActions(...actionTypes, { prefix });
