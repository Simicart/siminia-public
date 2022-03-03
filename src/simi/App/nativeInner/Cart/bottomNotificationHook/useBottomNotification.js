import React, {useState, useMemo, useCallback, useRef} from 'react';
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

const animationPromise = (el, animations, args) => {
    const duration = args.duration || 0
    if (el) {
        el.animate(animations, args)
    }

    return new Promise((resolve, reject) => {
        if (el) {
            return setTimeout(() => resolve(duration), duration)
        } else {
            return reject(duration)
        }
    })
}

const BASE_HEIGHT_DEFAULT = 0
const TIME_IN_DEFAULT = 200
const TIME_PERSIST_DEFAULT = 1200
const TIME_OUT_DEFAULT = 200


//baseHeight: starting height to start animation
export const useBottomNotification = (props) => {

    const {
        baseHeight: _baseHeight = BASE_HEIGHT_DEFAULT,
        timeIn: _timeIn = TIME_IN_DEFAULT,
        timePersist: _timePersist = TIME_PERSIST_DEFAULT,
        timeOut: _timeOut = TIME_OUT_DEFAULT
    } = props || {}

    const baseHeight = useRef(_baseHeight).current
    const timeIn = useRef(_timeIn).current
    const timePersist = useRef(_timePersist).current
    const timeOut = useRef(_timeOut).current

    const [currentText, setCurrentText] = useState('base')
    const [currentIcon, setCurrentIcon] = useState(null)
    const [currentType, setCurrentType] = useState(bottomNotificationType.SUCCESS)

    const notificationRef = useRef(null)

    const isSuccess = currentType === bottomNotificationType.SUCCESS

    const actualIcon = currentIcon ? currentIcon : (
        isSuccess ?
            <SuccessIcon/> : <FailureIcon/>
    )

    const noti = useMemo(() => {
            return <BottomNotification text={currentText}
                                       icon={actualIcon}
                                       type={currentType}
                                       forwardRef={notificationRef}
            />
        },
        [currentType, currentText, currentIcon]
    )

    const makeNotification = useCallback((settings) => {
            setCurrentType(settings.type || bottomNotificationType.SUCCESS)
            setCurrentIcon(settings.icon || null)
            setCurrentText(settings.text || null)

            if (notificationRef.current) {
                const rectHeight = notificationRef.current.offsetHeight

                animationPromise(notificationRef.current, [
                    {transform: `translateY(${-rectHeight - baseHeight}px)`},
                    {transform: `translateY(${-baseHeight}px)`},
                ], {
                    duration: timeIn,
                })
                    .then(() => {
                        return animationPromise(notificationRef.current, [
                            {transform: `translateY(${-baseHeight}px)`},
                            {transform: `translateY(${-baseHeight}px)`},
                        ], {
                            duration: timePersist,
                        })
                    })
                    .then(() => {
                        return animationPromise(notificationRef.current, [
                            {transform: `translateY(${-baseHeight}px)`},
                            {transform: `translateY(${-rectHeight - baseHeight}px)`},
                        ], {
                            duration: timeOut,
                        })
                    })
                    .catch(_ => {
                        console.warn('No element')
                    })
            }
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
