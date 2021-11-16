import React from 'react';
import { Redirect } from 'src/drivers';
import TextBox from 'src/simi/BaseComponents/TextBox';
import Identify from 'src/simi/Helper/Identify';
import Checkbox from 'src/simi/BaseComponents/Checkbox';
import { Whitebtn } from 'src/simi/BaseComponents/Button';
import { showFogLoading, hideFogLoading } from 'src/simi/BaseComponents/Loading/GlobalLoading';
import { smoothScrollToView } from 'src/simi/Helper/Behavior';

import CUSTOMER_UPDATE from 'src/simi/queries/customerUpdate.graphql';
import CUSTOMER_PASSWORD_UPDATE from 'src/simi/queries/customerPasswordUpdate.graphql';
import { GET_CUSTOMER as GET_CUSTOMER_QUERY } from '@magento/peregrine/lib/talons/CreateAccount/createAccount.gql';
import { useProfile } from 'src/simi/talons/Profile/useProfile';

const $ = window.$;

const ProfileForm = props => {
    const { history, isPhone, data, toggleMessages } = props;
    let defaultForm = false;
    if (
        history.location.state
        && history.location.state.hasOwnProperty('profile_edit')
        && history.location.state.profile_edit
    ) {
        defaultForm = history.location.state.profile_edit;
    }

    const onSubmit = () => {
        smoothScrollToView($('#root'));
        toggleMessages([{ type: 'success', message: Identify.__('You saved the account information.'), auto_dismiss: true }])
    }

    const talonProps = useProfile({
        defaultForm,
        updateCustomerMutation: CUSTOMER_UPDATE,
        updateCustomerPasswordMutation: CUSTOMER_PASSWORD_UPDATE,
        customerQuery: GET_CUSTOMER_QUERY,
        onSubmit: onSubmit
    });

    const {
        isSignedIn,
        initialValues,
        handleUpdateInfo,
        errors,
        isActiveForm,
        handleActiveForm,
        isLoading
    } = talonProps;

    if (!isSignedIn) {
        return <Redirect to="/" />;
    }

    if (errors) {
        toggleMessages([{ type: 'error', message: errors, auto_dismiss: true }]);
    }

    const scorePassword = pass => {
        let score = 0;
        if (!pass)
            return score;

        // award every unique letter until 5 repetitions
        let letters = {};
        for (let i = 0; i < pass.length; i++) {
            letters[pass[i]] = (letters[pass[i]] || 0) + 1;
            score += 5.0 / letters[pass[i]];
        }

        // bonus points for mixing it up
        let variations = {
            digits: /\d/.test(pass),
            lower: /[a-z]/.test(pass),
            upper: /[A-Z]/.test(pass),
            nonWords: /\W/.test(pass),
        }

        let variationCount = 0;
        for (let check in variations) {
            variationCount += (variations[check] === true) ? 1 : 0;
        }
        score += (variationCount - 1) * 10;

        return parseInt(score, 10);
    }

    const checkPassStrength = pass => {
        let score = scorePassword(pass);
        switch (true) {
            case score > 70:
                return "Strong";
            case score > 50:
                return "Good";
            case (score >= 30):
                return "Weak";
            default:
                return "No Password"
        }
    }

    const handleOnChange = (e) => {
        if (e.target.name === 'new_password') {
            let str = checkPassStrength(e.target.value);
            $('#strength-value').html(Identify.__(str))
        }
        if (e.target.value !== "" || e.target.value !== null) {
            $(e.target).removeClass("is-invalid");
        }
    }

    const validateForm = (jQForm) => {
        let formCheck = true;
        let msg = "";
        jQForm.find(".required").each(function () {
            const fieldVal = $(this).val().trim();console.log(fieldVal);
            const fieldAttrName = $(this).attr("name");
            if (fieldVal === "" || fieldVal.length === 0) {
                formCheck = false;
                $(this).addClass("is-invalid");
                msg = Identify.__("Please check some required fields");
            } else {
                $(this).removeClass("is-invalid");
                let new_pass_val = jQForm.find('input[name="new_password"]').val();
                if (fieldAttrName === "email" || fieldAttrName === "new_email") {
                    if (!Identify.validateEmail($(this).val())) {
                        formCheck = false;
                        $(this).addClass("is-invalid");
                        msg = Identify.__("Email field is invalid");
                    }
                }
                if (fieldAttrName === "new_password" && new_pass_val && new_pass_val.length < 6) {
                    formCheck = false;
                    $(this).addClass("is-invalid");
                    msg = Identify.__("Password need least 6 characters!");
                }
                if (fieldAttrName === "confirm_password") {
                    if (
                        $(this).val() !== new_pass_val) {
                        formCheck = false;
                        $(this).addClass("is-invalid");
                        msg = Identify.__("Confirm password is not match");
                    }
                }
            }
        });

        if (!formCheck) {
            props.toggleMessages([{ type: 'error', message: msg, auto_dismiss: true }]);
        }

        return formCheck;
    };

    const handleSaveProfile = (e) => {
        e.preventDefault();
        const jQForm = $("#siminia-edit-profile");
        const formValue = jQForm.serializeArray();
        const isValidForm = validateForm(jQForm);

        if (isValidForm) {
            let params = {};
            for (let index in formValue) {
                let field = formValue[index];
                params[field.name] = field.value;
            }
            handleUpdateInfo(params);
        }
    }

    const renderAlternativeForm = () => {
        switch (isActiveForm) {
            case 'email':
                return (
                    <React.Fragment>
                        <h4 className='title'>{Identify.__("Change Email")}</h4>
                        <TextBox
                            label={Identify.__("Email")}
                            name="email"
                            type="email"
                            className="required"
                            required={true}
                            defaultValue={initialValues && initialValues.email ? initialValues.email : ''}
                            onChange={e => handleOnChange(e)}
                        />
                        <TextBox
                            label={Identify.__("Current Password")}
                            name="password"
                            type="password"
                            className='required'
                            required={true}
                            onChange={e => handleOnChange(e)}
                        />
                    </React.Fragment>
                );
            case 'password':
                return (
                    <React.Fragment>
                        <h4 className="title">{Identify.__("Change Password")}</h4>
                        <TextBox
                            label={Identify.__("Current Password")}
                            name="current_password"
                            type="password"
                            className="required"
                            required
                            onChange={e => handleOnChange(e)}
                        />
                        <div className="group-password-strong">
                            <TextBox
                                label={Identify.__("New password")}
                                name="new_password"
                                type="password"
                                className="required"
                                required
                                onChange={e => handleOnChange(e)}
                            />
                            <div className="password-strength"><span>{Identify.__('Password strength:')}</span><span id="strength-value" style={{ marginLeft: 3 }}>{Identify.__('no password')}</span></div>
                        </div>
                        <TextBox
                            label={Identify.__("Confirm new password")}
                            name="confirm_password"
                            type="password"
                            className="required"
                            required
                            onChange={e => handleOnChange(e)}
                        />
                    </React.Fragment>
                )
        }
    }

    return (
        <form onSubmit={handleSaveProfile} id="harlows-edit-profile">
            <div className='row-edit-profile'>
                <div className="main__edit-column">
                    <h4 className="title">
                        {Identify.__("Edit account information")}
                    </h4>
                    <TextBox
                        defaultValue={initialValues && initialValues.firstname ? initialValues.firstname : ''}
                        label={Identify.__("First name")}
                        name="firstname"
                        className="required"
                        required={true}
                        onChange={handleOnChange}
                    />
                    <TextBox
                        defaultValue={initialValues && initialValues.lastname ? initialValues.lastname : ''}
                        label={Identify.__("Last name")}
                        name="lastname"
                        className="required"
                        required={true}
                        onChange={handleOnChange}
                    />
                    <Checkbox
                        className="first"
                        label={Identify.__("Change email")}
                        onClick={() => handleActiveForm(isActiveForm === 'email' ? false : 'email')}
                        selected={isActiveForm === 'email'}
                    />
                    <Checkbox
                        className=""
                        label={Identify.__("Change password")}
                        onClick={() => handleActiveForm(isActiveForm === 'password' ? false : 'password')}
                        selected={isActiveForm === 'password'}
                    />
                    {!isPhone && <Whitebtn
                        text={Identify.__("Save")}
                        className="save-profile"
                        type="submit"
                        disabled={isLoading}
                    />}
                </div>
                <div className='alternative__edit-column'>
                    {renderAlternativeForm()}
                </div>
                {isPhone && <Whitebtn
                    text={Identify.__("Save")}
                    className="save-profile"
                    type="submit"
                    disabled={isLoading}
                />}
            </div>
        </form>
    )
}

export default ProfileForm
