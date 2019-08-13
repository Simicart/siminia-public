import React from 'react'
import Identify from 'src/simi/Helper/Identify';
import {configColor} from 'src/simi/Config';
import { Link } from 'react-router-dom';

const Page404 = ()=>{
    return (
        <div className="page-404 text-center" style={{marginTop : '20%'}}>
            <p style={{
                fontSize : '16px',
                textTransform : 'uppercase'
            }}>{Identify.__('404 error')}</p>
            <p style={{
                fontSize : '16px'
            }}>{Identify.__('Page not found')}</p>
            <div style={{marginTop: 15}}>
                <Link
                    to={'/'}
                    style={{
                        padding: '5px 15px',
                        backgroundColor : configColor.button_background,
                        borderRadius : 5,
                        margin : '0 auto',
                        color : configColor.button_text_color,
                        fontSize : '16px',
                        textTransform : 'unset',
                        textDecoration: 'none',
                    }}
                >
                    {Identify.__('Back to Home')}
                </Link>
            </div>
        </div>
    )
}

export default Page404