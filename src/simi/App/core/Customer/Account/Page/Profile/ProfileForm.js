import React, { useEffect, useState } from 'react';

import TextBox from 'src/simi/BaseComponents/TextBox';
import Identify from 'src/simi/Helper/Identify';
import Checkbox from 'src/simi/BaseComponents/Checkbox';
import { Whitebtn } from 'src/simi/BaseComponents/Button';
import { editCustomer } from 'src/simi/Model/Customer';
import {showFogLoading, hideFogLoading} from 'src/simi/BaseComponents/Loading/GlobalLoading'
const $ = window.$;

const ProfileForm = props => {
    const {history, isPhone, data} = props;
    // const [data, setData] = useState(data);
    const [changeForm, handleChangeForm] = useState(false);

    useEffect(() => {
        if(
            history.location.state
            && history.location.state.hasOwnProperty('profile_edit') 
            && history.location.state.profile_edit
        ) {
            const {profile_edit} = history.location.state;
            handleChangeForm(profile_edit);
        } 
    })

    const scorePassword = pass => {
        let score = 0;
        if (!pass)
            return score;

        // award every unique letter until 5 repetitions
        let letters = {};
        for (let i=0; i<pass.length; i++) {
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

        return parseInt(score,10);
    }

    const checkPassStrength = pass => {
        let score = scorePassword(pass);
        switch (true){
            case score > 70:
                return "Strong";
            case score > 50:
                return "Good";
            case (score >= 30):
                return "Weak";
            default:
                return "no password"
        }
    }

    const handleOnChange = (e) => {
        if(e.target.name === 'new_password'){
            let str = checkPassStrength(e.target.value);
            $('#strength-value').html(Identify.__(str))
        }
        if (e.target.value !== "" || e.target.value !== null) {
            $(e.target).removeClass("is-invalid");
        }
    }

    const validateForm = () => {
        let formCheck = true;
        let msg = "";
        $("#harlows-edit-profile")
            .find(".required")
            .each(function() {
                if ($(this).val() === "" || $(this).val().length === 0) {
                    formCheck = false;
                    $(this).addClass("is-invalid");
                    msg = Identify.__("Please check some required fields");
                } else {
                    $(this).removeClass("is-invalid");
                    let new_pass_val = $("#harlows-edit-profile").find('input[name="new_password"]').val();
                    if ($(this).attr("name") === "email" || $(this).attr("name") === "new_email") {
                        if (!Identify.validateEmail($(this).val())) {
                            formCheck = false;
                            $(this).addClass("is-invalid");
                            msg = Identify.__("Email field is invalid");
                        }
                    }
                    if($(this).attr("name") === "new_password" && new_pass_val && new_pass_val.length < 6){
                        formCheck = false;
                        $(this).addClass("is-invalid");
                        msg = Identify.__("Password need least 6 characters!");
                    }
                    if ($(this).attr("name") === "com_password") {
                        if (
                            $(this).val() !== new_pass_val ) {
                            formCheck = false;
                            $(this).addClass("is-invalid");
                            msg = Identify.__("Confirm password is not match");
                        }
                    }
                }
            });

        if (!formCheck) {
            props.toggleMessages([{type: 'error', message: msg, auto_dismiss: true}]);
        }

        return formCheck;
    };

    const processData = (data) => {
        if(data.hasOwnProperty('errors') && data.errors) {
            const messages = data.errors.map(value => {
                return {type: 'error', message: value.message, auto_dismiss: true}
            })
            props.toggleMessages(messages)
        } else if(data.message && data.hasOwnProperty('customer')) {
            props.getUserDetails();
            props.toggleMessages([{type: 'success', message: data.message, auto_dismiss: true}])
        }
        hideFogLoading()
    }

    const handleSaveProfile = (e) => {
        e.preventDefault();
        const formValue = $("#harlows-edit-profile").serializeArray();
        const isValidForm = validateForm(formValue);
        if (isValidForm) {
            let params = {
                email: data.email
            }
            if(changeForm === 'password'){
                params['change_password'] = 1;
            }
            if(changeForm === 'email'){
                params['change_email'] = 1;
            }
            for (let index in formValue) {
                let field = formValue[index];
                params[field.name] = field.value;
            }
            showFogLoading()
            editCustomer(processData, params);
        }
    }

    const renderAlternativeForm = () => {
        switch(changeForm) {
            case 'email':
                return (
                    <React.Fragment>
                        {/* <h4 className={classes["title"]}>{Identify.__("Change Email")}</h4>
                        <TextBox
                            label={Identify.__("Email")}
                            name="new_email"
                            type="email"
                            className="required"
                            defaultValue={data.email}
                            onChange={e => handleOnChange(e)}
                        />
                        <TextBox
                            label={Identify.__("Current Password")}
                            name="old_password"
                            type="password"
                            className={`${classes["required"]} required`}
                            onChange={e => handleOnChange(e)}
                        /> */}
                        <div className='email-not-edit'>{Identify.__('Email cannot be edit')}</div>
                    </React.Fragment>
                );
            case 'password': 
                return (
                    <React.Fragment>
                        <h4 className="title">{Identify.__("Change Password")}</h4>
                        <TextBox
                            label={Identify.__("Current Password")}
                            name="old_password"
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
                            <div className="password-strength"><span>{Identify.__('Password strength:')}</span><span id="strength-value" style={{marginLeft: 3}}>{Identify.__('no password')}</span></div>
                        </div>
                        <TextBox
                            label={Identify.__("Confirm new password")}
                            name="com_password"
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
                        defaultValue={data.firstname}
                        label={Identify.__("First name")}
                        name="firstname"
                        className="required"
                        required={true}
                        onChange={handleOnChange}
                    />
                    <TextBox
                        defaultValue={data.lastname}
                        label={Identify.__("Last name")}
                        name="lastname"
                        className="required"
                        required={true}
                        onChange={handleOnChange}
                    />
                    <Checkbox
                        className="first"
                        label={Identify.__("Change email")}
                        onClick={() => handleChangeForm(changeForm === 'email' ? false : 'email')}
                        selected={changeForm === 'email'}
                    />
                    <Checkbox
                        className=""
                        label={Identify.__("Change password")}
                        onClick={() => handleChangeForm(changeForm === 'password' ? false : 'password')}
                        selected={changeForm === 'password'}
                    />
                    {!isPhone && <Whitebtn
                                text={Identify.__("Save")}
                                className="save-profile"
                                type="submit"
                            />}
                </div>
                <div className='alternative__edit-column'>
                    {renderAlternativeForm()}
                </div>
                {isPhone && <Whitebtn
                                text={Identify.__("Save")}
                                className="save-profile"
                                type="submit"
                            />}
            </div>
            
        </form>
    )
}

export default ProfileForm