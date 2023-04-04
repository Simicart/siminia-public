// import { validateEmail } from './Validation';

const SUCCESS = undefined;

export const validateTelephone = value => {
    const phoneRegex = /\(?([0-9]{3})\)?([ .-]?)([0-9]{3})\2([0-9]{4})/;
    return phoneRegex.test(value) ? SUCCESS : 'Telephone is invalid.';
};
