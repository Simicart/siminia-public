import React, { Fragment, Suspense, useEffect, useState } from 'react';
import { XSquare, X } from 'react-feather';
import { useIntl } from 'react-intl';
import { Helmet } from 'react-helmet';

require('./style.scss');

const SizeChart = props => {
    const [open, setOpen] = useState(false);
    const item = props.sizeChart;
    const { formatMessage } = useIntl();

    if (!item) {
        return null;
    }
    const styles = item.template_styles;

    const renderSizeChart = type => {
        let html = null;
        if (type === 'popup') {
            html = (
                <div className="main-sizechart">
                    {open ? (
                        <div className="product-sizechart">
                            <div
                                className="close-icon"
                                onClick={() => setOpen(false)}
                            >
                                <X />
                            </div>
                            <div
                                className="product-sizechart-table"
                                dangerouslySetInnerHTML={{
                                    __html: item.rule_content
                                }}
                            />
                        </div>
                    ) : null}
                    {open ? (
                        <div className="overlay-active" />
                    ) : (
                        <div className="overlay" />
                    )}
                    <button className='btnSizeChart' onClick={() => setOpen(true)}>
                        {formatMessage({
                            id: 'Size Chart',
                            defaultMessage: 'Size Chart'
                        })}
                    </button>
                </div>
            );
            return html;
        }
        if (type === 'inline') {
            html = (
                <div className="inline-sizechart">
                    <div className="product-sizechart">
                        <div
                            className="product-sizechart-table"
                            dangerouslySetInnerHTML={{
                                __html: item.rule_content
                            }}
                        />
                    </div>
                </div>
            );
            return html;
        }
        if (type === 'tab') {
            html = (
                <div className="tab-sizechart">
                    <div className="product-sizechart">
                        <div
                            className="product-sizechart-table"
                            dangerouslySetInnerHTML={{
                                __html: item.rule_content
                            }}
                        />
                    </div>
                </div>
            );
            return html;
        }
    };

    return (
        <React.Fragment>
            <Helmet>
                <style type="text/css">{styles}</style>
            </Helmet>
            {/* <div className="main-sizechart">
                {open ? (
                    <div className="product-sizechart">
                        <div
                            className="close-icon"
                            onClick={() => setOpen(false)}
                        >
                            <X />
                        </div>
                        <div
                            className="product-sizechart-table"
                            dangerouslySetInnerHTML={{
                                __html: item.rule_content
                            }}
                        />
                    </div>
                ) : null}
                {open ? (
                    <div className="overlay-active" />
                ) : (
                    <div className="overlay" />
                )}
                <button onClick={() => setOpen(true)}>
                    {formatMessage({
                        id: 'Size Chart',
                        defaultMessage: 'Size Chart'
                    })}
                </button>
            </div> */}
            {renderSizeChart(item.display_type)}
        </React.Fragment>
    );
};

export default SizeChart;
