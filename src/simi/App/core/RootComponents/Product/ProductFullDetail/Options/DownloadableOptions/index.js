import React from 'react';
import OptionBase from '../OptionBase'
import Checkbox from '../OptionType/Checkbox';
import ReactHTMLParse from 'react-html-parser';

require('./downloadableoptions.scss')

class DownloadableOptions extends OptionBase {
    constructor(props){
        super(props);
        this.exclT = 0;
        this.inclT = 0;
    }

    renderOptions =()=>{
    
        const objOptions = [];
        if (this.data.downloadable_product_links) {
            const { downloadable_product_links, links_purchased_separately } = this.data;
            let labelRequired = "";
            for (const i in downloadable_product_links) {
                const attribute = downloadable_product_links[i];
                const link = attribute.sample_url
                const price = attribute.price
    
                let linkId = i
                if(link) {
                    const positionLink = link.indexOf('link_id');
                    linkId = link.substring((positionLink + 8), link.length)
                    linkId = linkId.substring(0, 1)
                }
                if (links_purchased_separately) {
                    labelRequired = this.renderLabelRequired(1);
                    this.required.push(linkId)
                }
                if(parseFloat(price) <= 0) {
                    this.selected[linkId] = [linkId]
                }
                const element = this.renderAttribute(attribute, parseInt(linkId), labelRequired);
                objOptions.push(element);
            }
        }
        return (
            <div>
                <form id="downloadableOption" className="options-container">
                    {objOptions}
                </form>
            </div>
        );
    };

    renderAttribute = (attribute, id, labelRequired)=>{
        return (
            <div key={id} className="option-select">
                {this.data.links_title && <div className="option-title">
                    <span>{this.data.links_title} {labelRequired}</span>
                </div>}
                <div className="option-content">
                    <div className="options-list">
                        {this.renderMultiCheckbox(attribute, id)}
                    </div>
                </div>
            </div>
        )
    };

    renderMultiCheckbox =(ObjOptions, id = '0')=>{
        // const options = ObjOptions.value;
        // const objs = [];
        // let {links_purchased_separately} = ObjOptions
        // links_purchased_separately = parseInt(links_purchased_separately, 10) === 1

        // for (const i in options) {
        //     const item = options[i];
        //     const element = (
        //         <div key={i} className="option-row">
        //             { 
        //                 links_purchased_separately ?
        //                 <Checkbox id={id} title={item.title} value={item.id} parent={this} item={item}/> :
        //                 ReactHTMLParse(item.title)
        //             }
        //         </div>
        //     );

        //     objs.push(element);
        // }
        // return objs;

        const { links_purchased_separately } = this.data;

        return <div className="option-row">
            {links_purchased_separately ? <Checkbox id={id} title={ObjOptions.title} value={Number(id)} parent={this} item={ObjOptions} /> : ReactHTMLParse(ObjOptions.title)}
        </div>;
    };

    updatePrices = (selected = this.selected)=>{
        let exclT = 0;
        let inclT = 0;
        const downloadableOptions = this.data.downloadable_product_links;
       
        for (const d in downloadableOptions) {
            const option = downloadableOptions[d];
            if (Array.isArray(selected)) {
                if (selected.indexOf(d) !== -1) {
                    exclT += parseFloat(option.price);
                    inclT += parseFloat(option.price);
                }
            } else {
                for(const i in selected) {
                    const select = selected[i]
                    if(select && select.length && select.length > 0) {
                        if(select[0] === (Number(d) + 1)) {
                            exclT += parseFloat(option.price);
                            inclT += parseFloat(option.price);
                        }
                    }
                }
            }
            // for (const v in values) {
            //     const value = values[v];
            //     if (Array.isArray(selected)) {
            //         if (selected.indexOf(value.id) !== -1) {
            //             if (value.price_excluding_tax) {
            //                 exclT += parseFloat(value.price_excluding_tax.price);
            //                 inclT += parseFloat(value.price_including_tax.price);
            //             } else {
            //                 //excl and incl is equal when server return only one price
            //                 exclT += parseFloat(value.price);
            //                 inclT += parseFloat(value.price);
            //             }
            //         }
            //     } else {
            //         if (value.id === selected) {
            //             //add price
            //             if (value.price_excluding_tax) {
            //                 exclT += parseFloat(value.price_excluding_tax.price);
            //                 inclT += parseFloat(value.price_including_tax.price);
            //             } else {
            //                 //excl and incl is equal when server return only one price
            //                 exclT += parseFloat(value.price);
            //                 inclT += parseFloat(value.price);
            //             }
            //         }
            //     }
            // }
        }

        this.parentObj.Price.setDownloadableOptionPrice(exclT, inclT);
    }

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
        const newSelected = {}
        for (const i in this.selected) {
            newSelected[i] = i
        }
        this.selected = newSelected
        // this.selected = (this.selected && this.selected[0])?this.selected[0]:{};
        // console.log(this.selected)
        this.setParamOption('links');
        return this.params;
    };


    renderSamples = () => {
        const {data} = this
        if (data.downloadable_product_samples && data.downloadable_product_samples.length) {
            // const downloadSamples = data.download_sample[data.download_sample.length-1]
            const { downloadable_product_samples } = data;
            const returnedSamples = downloadable_product_samples.map((downloadSample, index) => {
                return (
                    <a key={index} href={downloadSample.sample_url} target="_blank" className="download-sample-item">
                        {downloadSample.title}
                    </a>
                )
            })
            return <div className="download-samples">
                <div className="download-sample-title">
                    {/* {downloadSamples.title} */}
                </div>
                {returnedSamples}
            </div>
        }
    }
    render(){
        return (
            <div className="downloadable-option">
                {this.renderOptions()}
                {this.renderSamples()}
            </div>
        )
    }
}
export default DownloadableOptions;