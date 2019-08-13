import React from 'react';
import OptionBase from '../OptionBase'
import defaultClasses from './downloadableoptions.css'
import Checkbox from '../OptionType/Checkbox';

class DownloadableOptions extends OptionBase {
    constructor(props){
        super(props);
        this.classes = defaultClasses
        this.exclT = 0;
        this.inclT = 0;
        console.log(this.data)
    }

    renderOptions =()=>{
        const {classes} = this
        const objOptions = [];
        if (this.data.download_options) {
            const attributes = this.data.download_options;
            let labelRequired = "";
            for (const i in attributes) {
                const attribute = attributes[i];
                if (parseInt(attribute.isRequired, 10) === 1) {
                    labelRequired = this.renderLabelRequired(1);
                    this.required.push(0)
                }
                const element = this.renderAttribute(attribute, i, labelRequired);
                objOptions.push(element);
            }
        }
        return (
            <div>
                <form id="downloadableOption" className={classes["options-container"]}>
                    {objOptions}
                </form>
            </div>
        );
    };

    renderAttribute = (attribute, id, labelRequired)=>{
        const {classes} = this
        return (
            <div key={id} className={classes["option-select"]}>
                <div className={classes["option-title"]}>
                    <span>{attribute.title} {labelRequired}</span>
                </div>
                <div className={classes["option-content"]}>
                    <div className={classes["options-list"]}>
                        {this.renderMultiCheckbox(attribute, id)}
                    </div>
                </div>
            </div>
        )
    };

    renderMultiCheckbox =(ObjOptions, id = '0')=>{
        const {classes} = this
        const options = ObjOptions.value;
        const objs = [];
        let {links_purchased_separately} = ObjOptions
        links_purchased_separately = parseInt(links_purchased_separately, 10) === 1

        for (const i in options) {
            const item = options[i];
            const element = (
                <div key={i} className={classes["option-row"]}>
                    { 
                        links_purchased_separately ?
                        <Checkbox id={id} title={item.title} value={item.id} parent={this} item={item} classes={classes}/> :
                        item.title
                    }
                </div>
            );

            objs.push(element);
        }
        return objs;
    };

    updatePrices = (selected = this.selected)=>{
        let exclT = 0;
        let inclT = 0;
        const downloadableOptions = this.data.download_options;
        selected = selected[0];
        for (const d in downloadableOptions) {
            const option = downloadableOptions[d];
            const values = option.value;
            for (const v in values) {
                const value = values[v];
                if (Array.isArray(selected)) {
                    if (selected.indexOf(value.id) !== -1) {
                        if (value.price_excluding_tax) {
                            exclT += parseFloat(value.price_excluding_tax.price);
                            inclT += parseFloat(value.price_including_tax.price);
                        } else {
                            //excl and incl is equal when server return only one price
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
                            //excl and incl is equal when server return only one price
                            exclT += parseFloat(value.price);
                            inclT += parseFloat(value.price);
                        }
                    }
                }
            }
        }
        this.parentObj.Price.setDownloadableOptionPrice(exclT, inclT);
    }

    getParams = ()=>{
        this.selected = this.selected[0];
        this.setParamOption('links');
        return this.params;
    };


    checkOptionRequired =(selected = this.selected,required=this.required)=>{
        let check = true;
        for (const i in required){
            const requiredOptionId = required[i];
            if(!selected.hasOwnProperty(requiredOptionId) || !selected[requiredOptionId] || selected[requiredOptionId].length === 0){
                check = false;
                break;
            }
        }
        return check;
    }

    getParams = ()=>{
        if(!this.checkOptionRequired()) return false;
            this.selected = this.selected?this.selected[0]:{};
        this.setParamOption('links');
        return this.params;
    };


    renderSamples = () => {
        const {data, classes} = this
        if (data.download_sample && data.download_sample.length) {
            const downloadSamples = data.download_sample[data.download_sample.length-1]
            const returnedSamples = downloadSamples.value.map((downloadSample, index) => {
                return (
                    <a key={index} href={downloadSample.url} target="_blank" className={classes['download-sample-item']}>
                        {downloadSample.title}
                    </a>
                )
            })
            return <div className={classes['download-samples']}>
                <div className={classes['download-sample-title']}>
                    {downloadSamples.title}
                </div>
                {returnedSamples}
            </div>
        }
    }
    render(){
        return (
            <div>
                {this.renderOptions()}
                {this.renderSamples()}
            </div>
        )
    }
}
export default DownloadableOptions;