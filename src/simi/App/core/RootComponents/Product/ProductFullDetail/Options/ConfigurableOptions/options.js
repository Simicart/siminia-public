import React, { Component } from 'react';
import { arrayOf, func, shape, string } from 'prop-types';

import Option from './option';

class Options extends Component {
    static propTypes = {
        onSelectionChange: func,
        options: arrayOf(
            shape({
                attribute_id: string.isRequired
            })
        ).isRequired
    };

    handleSelectionChange = (optionId, selection) => {
        const { onSelectionChange } = this.props;

        if (onSelectionChange) {
            onSelectionChange(optionId, selection);
        }
    };

    render() {
        const { handleSelectionChange, props } = this;
        const { options } = props;
        // sort attribute size to first
        if (options.length && options.filter(({ attribute_code }) => attribute_code === "size")
            && options.filter(({ attribute_code }) => attribute_code === "size").length) {
            options.unshift(options.splice(options.findIndex(elt => elt.attribute_code === "size"), 1)[0]);
        }
        return options.map(option => (
            <Option
                {...option}
                key={option.attribute_id}
                onSelectionChange={handleSelectionChange}
            />
        ));
    }
}

export default Options;
