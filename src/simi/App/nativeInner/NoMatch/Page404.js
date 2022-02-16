import React from 'react';
import { configColor } from 'src/simi/Config';
import { Link } from 'react-router-dom';
import { useIntl } from 'react-intl';
import './Page404.scss';

const Page404 = () => {
    const { formatMessage } = useIntl();
    return (
        <div className="page-404 text-center">
            <p className="title-1">{formatMessage({ id: '404' })}</p>
            <p className="title-2">{formatMessage({ id: 'Page not found' })}</p>
            <p className="title-3">
                {formatMessage({
                    id:
                        'The resource requested could not be found on this server!'
                })}
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
                    {formatMessage({ id: 'Back to Home' })}
                </Link>
            </div>
        </div>
    );
};

export default Page404;
