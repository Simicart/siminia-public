import React, { useMemo } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import {
    arrayOf,
    func,
    number,
    object,
    oneOfType,
    shape,
    string
} from 'prop-types';

import { useStyle } from 'src/classify';
import getOptionType from './getOptionType';
import SwatchList from './swatchList';
import TileList from './tileList';
import defaultClasses from './option.module.css';
import { useOption } from '@magento/peregrine/lib/talons/ProductOptions/useOption';

const getItemKey = ({ value_index }) => value_index;

// TODO: get an explicit field from the API
// that identifies an attribute as a swatch
const getListComponent = (attribute_code, values) => {
    const optionType = getOptionType({ attribute_code, values });

    return optionType === 'swatch' ? SwatchList : TileList;
};

const Option = props => {
    const {
        attribute_code,
        attribute_id,
        label,
        onSelectionChange,
        selectedValue,
        values
    } = props;
    const { formatMessage } = useIntl();

    const talonProps = useOption({
        attribute_id,
        label,
        onSelectionChange,
        selectedValue,
        values
    });

    const {
        handleSelectionChange,
        initialSelection,
        selectedValueDescription
    } = talonProps;

    const ValueList = useMemo(() => getListComponent(attribute_code, values), [
        attribute_code,
        values
    ]);

    const classes = useStyle(defaultClasses, props.classes);

    return (
        <div className={classes.root}>
            <span className={classes.title}>
                {formatMessage({
                    id: `${label}:`,
                    defaultMessage: `${label}:`
                })}
            </span>
            <ValueList
                label={label}
                getItemKey={getItemKey}
                selectedValue={initialSelection}
                items={values}
                onSelectionChange={handleSelectionChange}
            />
            {/* <dl className={classes.selection}>
                <dt className={classes.selectionLabel}>
                    <FormattedMessage
                        id="productOptions.selectedLabel"
                        defaultMessage={`Selected ${label}:`}
                        values={{ label }}
                    />
                </dt>
                <dd>{selectedValueDescription}</dd>
            </dl> */}
        </div>
    );
};

Option.propTypes = {
    attribute_code: string.isRequired,
    attribute_id: string,
    classes: shape({
        root: string,
        title: string
    }),
    label: string.isRequired,
    onSelectionChange: func,
    selectedValue: oneOfType([number, string]),
    values: arrayOf(object).isRequired
};

export default Option;
