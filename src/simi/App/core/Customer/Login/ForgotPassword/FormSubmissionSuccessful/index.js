import React from 'react';
import Identify from 'src/simi/Helper/Identify';
import { configColor } from 'src/simi/Config';

require('./formSubmissionSuccessful.scss');

const FormSubmissionSuccessful = props => {
    const { history, email } = props;
    const textMessage = Identify.__('If there is an account associated with %s you will receive an email with a link to change your password.').replace('%s', email);

    return (
        <div className="form-successful">
            <p className='text'>{textMessage}</p>
            <div className='buttonContainer'>
                <button
                    onClick={() => history.push('/')}
                    className='submitButton'
                    style={{ backgroundColor: configColor.button_background, color: configColor.button_text_color }}>
                    {Identify.__('Continue Shopping')}
                </button>
            </div>
        </div>
    );
}

export default FormSubmissionSuccessful;
