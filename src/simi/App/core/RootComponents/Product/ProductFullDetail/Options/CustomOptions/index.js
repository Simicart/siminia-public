import React from 'react';
import Identify from 'src/simi/Helper/Identify';
import OptionBase from '../OptionBase'
import Checkbox from '../OptionType/Checkbox';
import Radio from '../OptionType/Radio';
import Select from '../OptionType/Select';
import TextField from '../OptionType/Text';
import FileSelect from '../OptionType/File';
import { LazyComponent } from 'src/simi/BaseComponents/LazyComponent/'
import OptionLabel from '../OptionLabel'

require('./customoptions.scss');

const DatePicker = (props) => {
    return <LazyComponent component={() => import('../OptionType/Date')} {...props} />
}
const TimePicker = (props) => {
    return <LazyComponent component={() => import('../OptionType/Time')} {...props} />
}
class CustomOptions extends OptionBase {
    renderOptions = () => {
        if (this.data instanceof Object && this.data.hasOwnProperty('custom_options')) {
            const options = this.data.custom_options;
            if (!options) return <div></div>;
            const mainClass = this;
            const optionsHtml = options.map(function (item) {
                const labelRequired = mainClass.renderLabelRequired(item.required);
                if (item.required) {
                    mainClass.required.push(item.option_id);
                }

                let priceLabel = "";
                let itemType = '';
                let prLabel = {};
                // if (item.type === 'drop_down' || item.type === 'checkbox'
                //     || item.type === 'multiple' || item.type === 'radio') {
                // } else {
                //     priceLabel = <OptionLabel title={''} item={item.values[0]} />
                // }

                if (item.hasOwnProperty('checkbox_value')) {
                    itemType = 'checkbox';
                } else if (item.hasOwnProperty('dropdown_value')) {
                    itemType = 'drop_down';
                } else if (item.hasOwnProperty('multiple_value')) {
                    itemType = 'multiple';
                } else if (item.hasOwnProperty('radio_value')) {
                    itemType = 'radio';
                } else if (item.hasOwnProperty('date_value')) {
                    itemType = 'date_time';
                    prLabel = item.date_value;
                } else if (item.hasOwnProperty('field_value')) {
                    itemType = 'field';
                    prLabel = item.field_value;
                } else if (item.hasOwnProperty('area_value')) {
                    itemType = 'area';
                    prLabel = item.area_value;
                } else if (item.hasOwnProperty('file_value')) {
                    itemType = 'file';
                    prLabel = item.file_value;
                }

                priceLabel = <OptionLabel title={''} item={prLabel} />

                return (
                    <div className="option-select" key={Identify.randomString(5)}>
                        <div className="option-title">
                            <span>{item.title}</span>
                            {labelRequired}
                            {priceLabel}
                        </div>
                        <div className="option-content">
                            <div className="option-list">
                                {mainClass.renderContentOption(item, itemType)}
                            </div>
                        </div>
                    </div>
                );
            });

            if (!optionsHtml.length) {
                return null;
            }

            return (
                <div className="custom-options">
                    <div id="customOption" style={{ marginTop: '10px' }}>
                        {optionsHtml}
                    </div>
                </div>
            );
        }
    }

    renderContentOption = (ObjOptions, type) => {
        const id = ObjOptions.option_id;

        if (type === 'multiple' || type === 'checkbox') {
            return this.renderMutilCheckbox(ObjOptions, id)
        }
        if (type === 'radio') {
            return <Radio data={ObjOptions} id={id} parent={this} />
        }
        if (type === 'drop_down' || type === 'select') {
            return <div style={{ marginTop: -10 }}>
                <Select data={ObjOptions} id={id} parent={this} />
            </div>
        }
        if (type === 'date') {
            return <div style={{ marginTop: -10 }}>
                <DatePicker id={id} parent={this} />
            </div>
        }
        if (type === 'time') {
            return <div style={{ marginTop: -10 }}>
                <TimePicker id={id} parent={this} />
            </div>
        }
        if (type === 'date_time') {
            return (
                <div style={{ marginTop: -10 }}>
                    <DatePicker datetime={true} id={id} parent={this} />
                    <TimePicker datetime={true} id={id} parent={this} />
                </div>
            )
        }
        if (type === 'field') {
            return <TextField id={id} parent={this} max_characters={ObjOptions.max_characters} />
        }
        if (type === 'area') {
            return <TextField id={id} parent={this} type={type} />
        }

        if (type === 'file') {
            return <FileSelect data={ObjOptions} id={id} parent={this} type={type} />
        }
    };

    renderMutilCheckbox = (ObjOptions, id = '0') => {
        let values = [];
        if (ObjOptions.hasOwnProperty('multiple_value')) {
            values = ObjOptions.multiple_value;
        } else if (ObjOptions.hasOwnProperty('checkbox_value')) {
            values = ObjOptions.checkbox_value;
        }
        const html = values.map(item => {
            return (
                <div key={Identify.randomString(5)} className="option-row">
                    <Checkbox title={item.title} id={id} item={item} value={item.option_type_id} parent={this} />
                </div>
            )
        });
        return html;
    };

    updatePrices = (selected = this.selected) => {
        let exclT = 0;
        let inclT = 0;
        const customOptions = this.data.custom_options;
        const customSelected = selected;
        for (const c in customOptions) {
            const option = customOptions[c];
            for (const s in customSelected) {
                if (option.option_id === Number(s)) {
                    const selected = customSelected[s];
                    if (!selected) //when value is zero
                        continue

                    let values = '';
                    if (option.hasOwnProperty('field_value')) {
                        values = option.field_value;
                    } else if (option.hasOwnProperty('area_value')) {
                        values = option.area_value;
                    } else if (option.hasOwnProperty('checkbox_value')) {
                        values = option.checkbox_value;
                    } else if (option.hasOwnProperty('dropdown_value')) {
                        values = option.dropdown_value;
                    } else if (option.hasOwnProperty('multiple_value')) {
                        values = option.multiple_value;
                    } else if (option.hasOwnProperty('radio_value')) {
                        values = option.radio_value;
                    } else if (option.hasOwnProperty('date_value')) {
                        values = option.date_value;
                    } else if (option.hasOwnProperty('file_value')) {
                        values = option.file_value;
                    }

                    if (option.hasOwnProperty('date_value') || option.hasOwnProperty('area_value')
                        || option.hasOwnProperty('field_value') || option.hasOwnProperty('file_value')) {
                        const value = values.price;
                        exclT += value;
                        inclT += value;
                    } else {
                        for (const v in values) {
                            const value = values[v];
                            if (Array.isArray(selected)) {
                                if (selected.indexOf(value.option_type_id) !== -1) {
                                    exclT += value.price;
                                    inclT += value.price;
                                }
                            } else {
                                if (value.option_type_id === Number(selected)) {
                                    exclT += value.price;
                                    inclT += value.price;
                                }
                            }
                        }
                    }

                    // if (option.type === "date" || option.type === "time"
                    //     || option.type === "date_time" || option.type === "area"
                    //     || option.type === "field" || option.type === "file") {
                    //         const value = values[0];
                    //     if (value.price_excluding_tax) {
                    //         exclT += parseFloat(value.price_excluding_tax.price);
                    //         inclT += parseFloat(value.price_including_tax.price);
                    //     } else {
                    //         exclT += parseFloat(value.price);
                    //         inclT += parseFloat(value.price);
                    //     }
                    // } else {
                    //     for (const v in values) {
                    //         const value = values[v];
                    //         if (Array.isArray(selected)) {
                    //             if (selected.indexOf(value.id) !== -1) {
                    //                 //add price
                    //                 if (value.price_excluding_tax) {
                    //                     exclT += parseFloat(value.price_excluding_tax.price);
                    //                     inclT += parseFloat(value.price_including_tax.price);
                    //                 } else {
                    //                     exclT += parseFloat(value.price);
                    //                     inclT += parseFloat(value.price);
                    //                 }
                    //             }
                    //         } else {
                    //             if (value.id === selected) {
                    //                 //add price
                    //                 if (value.price_excluding_tax) {
                    //                     exclT += parseFloat(value.price_excluding_tax.price);
                    //                     inclT += parseFloat(value.price_including_tax.price);
                    //                 } else {
                    //                     exclT += parseFloat(value.price);
                    //                     inclT += parseFloat(value.price);
                    //                 }
                    //             }
                    //         }
                    //     }
                    // }
                }
            }
        }
        this.parentObj.Price.setCustomOptionPrice(exclT, inclT);
    }

    getParams = () => {
        if (!this.checkOptionRequired()) {
            return false;
        }
        this.setParamOption('options');
        return this.params;
    }
    render() {
        return (
            <div>
                {this.renderOptions()}
            </div>
        )
    }
}
export default CustomOptions;
