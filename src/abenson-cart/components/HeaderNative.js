import React from 'react'
import { ArrowLeft } from 'react-feather'
import { useHistory } from 'react-router-dom'

const HeaderAbsNative = () => {
    const history = useHistory()

    return (
        <>
            <div className='abs-header-native'>
                <h1>Your cart</h1>
                <ArrowLeft className='abs-back' onClick={() => history.goBack()}></ArrowLeft>
            </div>   
        </>
    )
}

export default HeaderAbsNative