import React from 'react';
import { bool, func, number, oneOfType, shape, string } from 'prop-types';

import { useStyle } from 'src/classify';
import defaultClasses from './tile.module.css';
import { useTile } from '@magento/peregrine/lib/talons/ProductOptions/useTile';

const getClassName = (name, isSelected, hasFocus) =>
    `${name}${isSelected ? '_selected' : ''}${hasFocus ? '_focused' : ''}`;

const Tile = props => {
    const {
        hasFocus,
        isSelected,
        item: { label, value_index, swatch_data },
        onClick
    } = props;
    
    const talonProps = useTile({
        onClick,
        value_index
    });

    const { handleClick } = talonProps;

    const classes = useStyle(defaultClasses, props.classes);
    const className = classes[getClassName('root', isSelected, hasFocus)];

    const isHex =
        swatch_data &&
        swatch_data.value &&
        /^#[0-9A-F]{6}$/i.test(swatch_data.value);

    return (
        <button
            className={className}
            onClick={handleClick}
            title={label}
            type="button"
            style={{
                borderRadius: '1px',
                backgroundColor: isHex ? swatch_data.value : '#f2f2f2'
            }}
        >
            <span>{!isHex && label}</span>
        </button>
    );
};

export default Tile;

Tile.propTypes = {
    hasFocus: bool,
    isSelected: bool,
    item: shape({
        label: string.isRequired,
        value_index: oneOfType([number, string]).isRequired
    }).isRequired,
    onClick: func.isRequired
};

Tile.defaultProps = {
    hasFocus: false,
    isSelected: false
};
