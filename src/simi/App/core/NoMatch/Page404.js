import React from 'react';
import Identify from 'src/simi/Helper/Identify';
import { configColor } from 'src/simi/Config';
import { Link } from 'react-router-dom';
import './Page404.scss';

const Page404 = () => {
    return (
        <div className="page-404 text-center">
            <p className="title-1">{Identify.__('404')}</p>
            <p className="title-2">{Identify.__('Page not found')}</p>
            <p className="title-3">
                {Identify.__(
                    'The resource requested could not be found on this server!'
                )}
            </p>
            <div style={{ marginTop: 25 }}>
                <Link
                    to={'/'}
                    style={{
                        padding: '10px 25px',
                        backgroundColor: configColor.button_background,
                        borderRadius: 0,
                        margin: '0 auto',
                        color: configColor.button_text_color,
                        fontSize: '16px',
                        textTransform: 'unset',
                        textDecoration: 'none'
                    }}
                >
                    {Identify.__('Back to Home')}
                </Link>
            </div>
        </div>
    );
};

export default Page404;
