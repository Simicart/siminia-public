import React, {useState, useEffect, useMemo, useCallback} from 'react';
import {BottomNotification} from "../BottomNotification";
import {AlertCircle} from 'react-feather'

export const bottomNotificationType = {
    'SUCCESS': 1,
    'FAIL': 2
}

const SuccessIcon = () => {
    return (
        <span>
            <img src={require('../../../../../../static/icons/checkmark-circle.svg')}
                 alt={'ok'}
                 width={25}
            />
        </span>
    )
}

const FailureIcon = () => {
    return (
        <AlertCircle fill={'#FF5F59'}/>
    )
}

export const useBottomNotification = (props) => {

    const [currentText, setCurrentText] = useState('base')
    const [currentIcon, setCurrentIcon] = useState(null)
    const [currentType, setCurrentType] = useState(bottomNotificationType.SUCCESS)

    const isSuccess = currentType === bottomNotificationType.SUCCESS

    const actualIcon = currentIcon ? currentIcon : (
        isSuccess ?
            <SuccessIcon/> : <FailureIcon/>
    )


    const noti = useMemo(() => {
            return <BottomNotification text={currentText}
                                       icon={actualIcon}
                                       type={currentType}
            />
        },
        [currentType, currentText, currentIcon]
    )

    const makeNotification = useCallback((settings) => {
            setCurrentType(settings.type || bottomNotificationType.SUCCESS)
            setCurrentIcon(settings.icon || null)
            setCurrentText(settings.text || null)
        },
        [setCurrentType, setCurrentIcon, setCurrentIcon]
    )

    return {
        component: noti,
        setCurrentText,
        setCurrentIcon,
        setCurrentType,
        makeNotification
    }
};
