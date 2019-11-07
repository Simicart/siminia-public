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

const DatePicker = (props)=>{
    return <LazyComponent component={()=>import('../OptionType/Date')} {...props}/>
}
const TimePicker = (props)=>{
    return <LazyComponent component={()=>import('../OptionType/Time')} {...props}/>
}
class CustomOptions extends OptionBase {
    renderOptions = () => {
        if(this.data instanceof Object && this.data.hasOwnProperty('custom_options')){
            const options = this.data.custom_options;
            if(!options) return <div></div>;
            const mainClass = this;
            const optionsHtml = options.map(function (item) {
                const labelRequired = mainClass.renderLabelRequired(parseInt(item.isRequired,10));
                if(parseInt(item.isRequired,10) === 1){
                    mainClass.required.push(item.id);
                }
                
                let priceLabel = "";
                if (item.type === 'drop_down' || item.type === 'checkbox'
                    || item.type === 'multiple' || item.type === 'radio') {
                } else {
                    priceLabel = <OptionLabel title={''} item={item.values[0]} />
                }

                return (
                    <div className="option-select" key={Identify.randomString(5)}>
                        <div className="option-title">
                            <span>{item.title}</span>
                            {labelRequired}
                            {priceLabel}
                        </div>
                        <div className="option-content">
                            <div className="option-list">
                                {mainClass.renderContentOption(item,item.type)}
                            </div>
                        </div>
                    </div>
                );
            });
            return (
                <div className="custom-options">
                    <div id="customOption" style={{marginTop: '10px'}}>
                        {optionsHtml}
                    </div>
                </div>
            );
        }
    }

    renderContentOption = (ObjOptions, type) => {
        const id = ObjOptions.id;
        
        if(type === 'multiple' || type === 'checkbox'){
            return this.renderMutilCheckbox(ObjOptions, id)
        }
        if(type === 'radio'){
            return <Radio data={ObjOptions} id={id} parent={this}/>
        }
        if(type === 'drop_down' || type === 'select' ){
            return <div style={{marginTop:-10}}>
                        <Select data={ObjOptions} id={id} parent={this}/>
                </div>
        }
        if(type === 'date'){
            return <div style={{marginTop:-10}}>
                        <DatePicker id={id} parent={this}/>
                    </div>
        }
        if(type === 'time'){
            return <div style={{marginTop:-10}}>
                    <TimePicker id={id} parent={this}/>
                </div>
        }
        if(type === 'date_time'){
            return (
                <div style={{marginTop:-10}}>
                    <DatePicker datetime={true} id={id} parent={this}/>
                    <TimePicker datetime={true} id={id} parent={this}/>
                </div>
            )
        }
        if(type === 'field'){
            return <TextField id={id} parent={this} max_characters={ObjOptions.max_characters}/>
        }
        if(type === 'area'){
            return <TextField id={id} parent={this} type={type}/>
        }
        
        if(type === 'file'){
            return <FileSelect data={ObjOptions} id={id} parent={this} type={type}/>
        }
    };

    renderMutilCheckbox =(ObjOptions, id = '0')=>{
        const values = ObjOptions.values;
        const html = values.map(item => {
            return (
                <div key={Identify.randomString(5)} className="option-row">
                    <Checkbox title={item.title} id={id} item={item} value={item.id} parent={this} />
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
        console.log(customSelected)
        for (const c in customOptions) {
            const option = customOptions[c];
            for (const s in customSelected) {
                if (option.id === s) {
                    const selected = customSelected[s];
                    if (!selected) //when value is zero
                        continue
                    const values = option.values;
                    if (option.type === "date" || option.type === "time"
                        || option.type === "date_time" || option.type === "area"
                        || option.type === "field" || option.type === "file") {
                            const value = values[0];
                        if (value.price_excluding_tax) {
                            exclT += parseFloat(value.price_excluding_tax.price);
                            inclT += parseFloat(value.price_including_tax.price);
                        } else {
                            exclT += parseFloat(value.price);
                            inclT += parseFloat(value.price);
                        }
                    } else {
                        for (const v in values) {
                            const value = values[v];
                            if (Array.isArray(selected)) {
                                if (selected.indexOf(value.id) !== -1) {
                                    //add price
                                    if (value.price_excluding_tax) {
                                        exclT += parseFloat(value.price_excluding_tax.price);
                                        inclT += parseFloat(value.price_including_tax.price);
                                    } else {
                                        exclT += parseFloat(value.price);
                                        inclT += parseFloat(value.price);
                                    }
                                }
                            } else {
                                if (value.id === selected) {
                                    //add price
                                    if (value.price_excluding_tax) {
                                        exclT += parseFloat(value.price_excluding_tax.price);
                                        inclT += parseFloat(value.price_including_tax.price);
                                    } else {
                                        exclT += parseFloat(value.price);
                                        inclT += parseFloat(value.price);
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
        this.parentObj.Price.setCustomOptionPrice(exclT, inclT);
    }
    
    getParams = () =>{
        if(!this.checkOptionRequired()){
            return false;
        }
        this.setParamOption('options');
        return this.params;
    }
    render(){
        return (
            <div>
                {this.renderOptions()}
            </div>
        )
    }
}
export default CustomOptions;
