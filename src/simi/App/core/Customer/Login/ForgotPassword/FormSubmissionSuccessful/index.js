import React from 'react';
import PropTypes from 'prop-types';

import Identify from 'src/simi/Helper/Identify'
import {configColor} from 'src/simi/Config'

require('./formSubmissionSuccessful.scss');

const FormSubmissionSuccessful = props => {
    const {successMessage} = props
    const textMessage = successMessage?successMessage:Identify.__('If there is an account associated with that email, you will receive an email with a link to change your password');
    const { onContinue } = props;

    return (
        <div className="form-successful">
            <p className='text'>{textMessage}</p>
            <div className='buttonContainer'>
                <button 
                    onClick={onContinue}
                    className='submitButton'
                    style={{backgroundColor: configColor.button_background, color: configColor.button_text_color}}>
                    {Identify.__('Continue Shopping')}
                </button>
            </div>
        </div>
    );
}
FormSubmissionSuccessful.propTypes = {
    onContinue: PropTypes.func.isRequired,
    successMessage: PropTypes.string
};


export default FormSubmissionSuccessful;
