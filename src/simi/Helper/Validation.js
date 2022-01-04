

/**
 * Parse price string
 * @param {String} value
 */
export const parseNumber = (value) => {
    var isDot; var isComa;

    if (typeof value !== 'string') {
        return parseFloat(value);
    }
    isDot = value.indexOf('.');
    isComa = value.indexOf(',');

    if (isDot !== -1 && isComa !== -1) {
        if (isComa > isDot) {
            value = value.replace('.', '').replace(',', '.');
        } else {
            value = value.replace(',', '');
        }
    } else if (isComa !== -1) {
        value = value.replace(',', '.');
    }

    return parseFloat(value);
}

export const isEmpty = (value) => {
    return value === '' || value === undefined || value == null || value.length === 0 || /^\s+$/.test(value);
}

export const validateEmpty = (value) => {
    if (value === undefined || isEmpty(value)) {
        return false;
    }
    return true
}

export const validateEmail = (value) => {
    var validRegexp = /^([a-z0-9,!\#\$%&'\*\+\/=\?\^_`\{\|\}~-]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-z0-9,!\#\$%&'\*\+\/=\?\^_`\{\|\}~-]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*@([a-z0-9-]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-z0-9-]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*\.(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]){2,})$/i; //eslint-disable-line max-len
    if (!validateEmpty(value) || !validRegexp.test(value.trim())) {
        return false;
    }
    return true
}

export const validateTelephone = (value) => {
    var validRegexp = /^(\()?\d{3}(\))?(-|\s)?\d{3}(-|\s)\d{4}$/;
    if (!validateEmpty(value) || !validRegexp.test(value.trim())) {
        return false; //Please enter a valid phone number. For example (123) 456-7890 or 123-456-7890.
    }
    return true
}

export const validateAlpha = (value) => {
    var validRegexp = /^[a-zA-Z]+$/;
    if (!validateEmpty(value) || !validRegexp.test(value.trim())) {
        return false; //Please use letters only (a-z or A-Z) in this field.
    }
    return true
}

export const validateAlphanum = (value) => {
    var validRegexp = /^[a-zA-Z0-9]+$/;
    if (!validateEmpty(value) || !validRegexp.test(value.trim())) {
        return false; //Please use only letters (a-z or A-Z) or numbers (0-9) in this field. No spaces or other characters are allowed.
    }
    return true
}

export const validateCode = (value) => {
    var validRegexp = /^[a-zA-Z]+[a-zA-Z0-9_]+$/;
    if (!validateEmpty(value) || !validRegexp.test(value.trim())) {
        return false; //Please use only letters (a-z or A-Z), numbers (0-9) or underscore (_) in this field, and the first character should be a letter.
    }
    return true
}

export const validateInteger = (value) => {
    var validRegexp = /^-?\d+$/;
    if (!validateEmpty(value) || !validRegexp.test(value.trim())) {
        return false; //A positive or negative non-decimal number please
    }
    return true
}

//zip-range
export const validateZipRange = (value) => {
    var validRegexp = /^90[2-5]-\d{2}-\d{4}$/;
    if (!validateEmpty(value) || !validRegexp.test(value.trim())) {
        return false; //Your ZIP-code must be in the range 902xx-xxxx to 905-xx-xxxx
    }
    return true
}

//validate-number
export const validateNumber = (value) => {
    var validRegexp = /^\s*-?\d*(\.\d*)?\s*$/;
    if (!validateEmpty(value) || isNaN(parseNumber(value)) || !validRegexp.test(value.trim())) {
        return false; //Please enter a valid number in this field.
    }
    return true
}

//validate-digits
export const validateDigits = (value) => {
    var validRegexp = /[^\d]/;
    if (!validateEmpty(value) || !validRegexp.test(value.trim())) {
        return false; //Please enter a valid number in this field.
    }
    return true
}

//validate-date
export const validateDate = (value) => {
    var validRegexp = /^(0?[1-9]|1[012])[\/\-](0?[1-9]|[12][0-9]|3[01])[\/\-]\d{4}$/;
    // Match the date format through regular expression
    if(value.match(validRegexp)) {
        //Test which seperator is used '/' or '-'
        var opera1 = value.split('/');
        var opera2 = value.split('-');
        lopera1 = opera1.length;
        lopera2 = opera2.length;
        // Extract the string into month, date and year
        if (lopera1>1) {
            var pdate = value.split('/');
        } else if (lopera2>1) {
            var pdate = value.split('-');
        }
        var mm = parseInt(pdate[0]);
        var dd = parseInt(pdate[1]);
        var yy = parseInt(pdate[2]);
        // Create list of days of a month [assume there is no leap year by default]
        var ListofDays = [31,28,31,30,31,30,31,31,30,31,30,31];
        if (mm==1 || mm>2) {
            if (dd>ListofDays[mm-1]) {
                return false;
            }
        }
        if (mm==2) {
            var lyear = false;
            if ( (!(yy % 4) && yy % 100) || !(yy % 400)) {
                lyear = true;
            }
            if ((lyear==false) && (dd>=29)) {
                return false;
            }
            if ((lyear==true) && (dd>29)) {
                return false;
            }
        }
    } else {
        return false;
    }
} 
