import Identify from 'src/simi/Helper/Identify'

const isPasswordComplexEnough = (str = '') => {
    const count = {
        lower: 0,
        upper: 0,
        digit: 0,
        special: 0
    };

    for (const char of str) {
        if (/[a-z]/.test(char)) count.lower++;
        else if (/[A-Z]/.test(char)) count.upper++;
        else if (/\d/.test(char)) count.digit++;
        else if (/\S/.test(char)) count.special++;
    }

    return Object.values(count).filter(Boolean).length >= 3;
};

export const validators = new Map()
    .set('email', value => {
        const trimmed = (value || '').trim();

        if (!trimmed) return ('An email address is required.');
        if (!trimmed.includes('@')) return ('A valid email address is required.');

        return undefined;
    })
    .set('firstName', value => {
        return !(value || '').trim() ? ('A first name is required.') : undefined;
    })
    .set('lastName', value => {
        return !(value || '').trim() ? ('A last name is required.') : undefined;
    })
    .set('oldPass', value => {
        if (!value || value.length < 8) {
            return ('A password must contain at least 8 characters.');
        }
        if (!isPasswordComplexEnough(value)) {
            return ('A password must contain at least 3 of the following: lowercase, uppercase, digits, special characters.');
        }

        return undefined;
    })
    .set('newPassword', value => {
        if (!value || value.length < 8) {
            return ('A password must contain at least 8 characters.');
        }
        if (!isPasswordComplexEnough(value)) {
            return ('A password must contain at least 3 of the following: lowercase, uppercase, digits, special characters.');
        }

        return undefined;
    })
    .set('confirmNewPass', (value, values) => {
        return value !== values.new_password ? ('Passwords must match.') : undefined;
    });
