import React from "react"
import GoogleRecaptcha from 'src/simi/App/nativeInner/GoogleReCaptcha';
import { useGoogleReCaptcha } from '../../talons/useReCatcha'

const ReCaptcha = props => {
    const {classes} = props
    const talonProps = useGoogleReCaptcha({
        formAction: "callForPrice"
    })

    const {
        recaptchaWidgetProps
    } = talonProps;

    return (
        <div className={classes.buttons}>
            <GoogleRecaptcha {...recaptchaWidgetProps} />
        </div>

    )
}

export default ReCaptcha