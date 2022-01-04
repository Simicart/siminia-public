import React from 'react';

export const OptionTitle = props => {
    const { title, labelRequired, priceLabel } = props;

    return (
        <div className={'option-title'}>
            <span className={'option-title-label'}>{title}</span>
            {labelRequired}
            {priceLabel}
        </div>
    );
};
