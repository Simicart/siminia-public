import React from 'react';
import OptionLabel from './components/OptionLabel/OptionLabel';
import {RequiredLabel} from './components/RequiredLabel/RequiredLabel';
import {getOptionType} from './utils/getOptionType';
import {useIdentity} from './utils/useIdentity';
import {OptionTitle} from './components/OptionTitle/OptionTitle';
import {OptionContent} from './components/OptionContent/OptionContent';
import {OptionSummary} from "../SharedOptionComponent/OptionSummary/OptionSummary";
import {CustomSummarySelectedList} from "./components/CustomSummarySelectedList/CustomSummarySelectedList";
import './CustomOption.scss';
import defaultClass from './CustomOption.module.css'

const defaultStyle = {marginTop: '10px'};

export const CustomOption = props => {
    const id = useIdentity();

    const product = props.product;
    const useProductFullDetailProps = props.useProductFullDetailProps;
    const {extraPrice} = useProductFullDetailProps

    const options = product.options;
    const canRender = !!options && options.length > 0;

    if (!canRender) {
        return null;
    }

    const optionsHtml = options.map(function (item, index) {
        const title = item.title;
        const isRequired = item.required;
        const labelRequired = isRequired ? <RequiredLabel/> : null;

        if (isRequired) {
            // replaced with a custom check in useProductDetails hook
            // mainClass.required.push(item.option_id);
        }
        const {itemType, prLabel} = getOptionType(item);
        const priceLabel = <OptionLabel title={''} item={prLabel} classes={defaultClass}/>;

        return (
            <div
                className={'option-select'}
                key={index.toString()}
            >
                <OptionTitle
                    title={title}
                    labelRequired={labelRequired}
                    priceLabel={priceLabel}
                />
                <div className={'custom-content-wrapper'}>
                    <OptionContent
                        item={item}
                        itemType={itemType}
                        useProductFullDetailProps={useProductFullDetailProps}
                    />
                </div>
            </div>
        );
    });

    if (!optionsHtml.length) {
        return null;
    }

    const summary = (
        <OptionSummary
            isVisible={true}
            classes={defaultClass}
            price={extraPrice}
        >
            <CustomSummarySelectedList
                product={product}
                useProductFullDetailProps={useProductFullDetailProps}
                classes={defaultClass}
            />
        </OptionSummary>
    )

    return (
        <div className={`custom-options ${id}`}>
            <div id="customOption" style={defaultStyle}>
                {optionsHtml}
                {summary}
            </div>
        </div>
    );
};
