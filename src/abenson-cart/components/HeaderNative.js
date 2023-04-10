import React from 'react'
import { ArrowLeft } from 'react-feather'

const HeaderAbsNative = () => {
    return (
        <>
            <div className='abs-header-native'>
                <h1>Your cart</h1>
                <ArrowLeft className='abs-back'></ArrowLeft>
            </div>   
        </>
    )
}

export default HeaderAbsNative