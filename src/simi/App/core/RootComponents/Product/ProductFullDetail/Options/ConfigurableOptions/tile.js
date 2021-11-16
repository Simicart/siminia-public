import React, { Component } from 'react';
import { bool, number, shape, string } from 'prop-types';

import classify from 'src/classify';
import defaultClasses from './tile.css';

const getClassName = (name, isSelected, hasFocus) =>
    `${name}${isSelected ? '_selected' : ''}${hasFocus ? '_focused' : ''}`;

class Tile extends Component {
    static propTypes = {
        classes: shape({
            root: string
        }),
        hasFocus: bool,
        isSelected: bool,
        item: shape({
            label: string.isRequired
        }).isRequired,
        itemIndex: number
    };

    static defaultProps = {
        hasFocus: false,
        isSelected: false
    };

    render() {
        const {
            classes,
            hasFocus,
            isSelected,
            item,
            // eslint-disable-next-line
            itemIndex,
            ...restProps
        } = this.props;
        const className = classes[getClassName('root', isSelected, hasFocus)];

        const { label, swatch_data } = item;
        let swatchStyle = {};
        if (swatch_data) {
            if (swatch_data.hasOwnProperty('thumbnail')) {
                swatchStyle = { background: `url(${swatch_data.thumbnail})`, backgroundRepeat: 'no-repeat', backgroundSize: 'cover' };
            } else {
                swatchStyle = { background: swatch_data.value };
            }
        }

        return (
            <button {...restProps} className={`${className} ${isSelected ? 'selected' : ''} tile-option-item`} style={swatchStyle}>
                <span>{label}</span>
            </button>
        );
    }
}

export default classify(defaultClasses)(Tile);
