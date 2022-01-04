import React from 'react';
import { string, bool, shape, func } from 'prop-types';
import { Eye, EyeOff } from 'react-feather';

import { mergeClasses } from '@magento/venia-ui/lib/classify';
import { usePassword } from 'src/simi/talons/Password/usePassword';

// import Button from '@magento/venia-ui/lib/components/Button';
import Field from '@magento/venia-ui/lib/components/Field';
import TextInput from '@magento/venia-ui/lib/components/TextInput';
import { isRequired } from '@magento/venia-ui/lib/util/formValidators';

import defaultClasses from './password.module.css';

const Password = props => {
    const {
        classes: propClasses,
        label,
        fieldName,
        isToggleButtonHidden,
        autoComplete,
        validate,
        ...otherProps
    } = props;
    const talonProps = usePassword();
    const { visible, togglePasswordVisibility } = talonProps;
    const classes = mergeClasses(defaultClasses, propClasses);

    const passwordButton = (
        <button priority="high"
            className={classes.passwordButton}
            onClick={togglePasswordVisibility}
            type="button"
        >
            {visible ? <Eye /> : <EyeOff />}
        </button>
    );

    const fieldType = visible ? 'text' : 'password';

    return (
        <Field label={label} classes={{ root: classes.root }}>
            <TextInput
                after={!isToggleButtonHidden && passwordButton}
                autoComplete={autoComplete}
                field={fieldName}
                type={fieldType}
                validate={validate}
                {...otherProps}
            />
        </Field>
    );
};

Password.propTypes = {
    autoComplete: string,
    classes: shape({
        root: string
    }),
    label: string,
    fieldName: string,
    isToggleButtonHidden: bool,
    validate: func
};

Password.defaultProps = {
    isToggleButtonHidden: true,
    validate: isRequired
};

export default Password;
