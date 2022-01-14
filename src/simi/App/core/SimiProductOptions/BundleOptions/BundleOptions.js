import React, {useEffect, useState} from 'react';
import { gql, useQuery } from '@apollo/client';
import {FormattedMessage, useIntl} from 'react-intl';
import {Qty} from 'src/simi/BaseComponents/Input';
import {BundleContent} from './components/BundleContent/BundleContent';
import defaultClasses from './bundleOption.module.css';
import {useStyle} from 'src/classify';
import Optionlabel from '../CustomOption/components/OptionLabel/OptionLabel';
import {OptionSummary} from "../SharedOptionComponent/OptionSummary/OptionSummary";

const PRODUCT_BUNDLE_OPTION_QUERY = gql`
    query getBundleOptionForProductDetails($sku: String!) {
        products(filter: { sku: { eq: $sku } }) {
            items {
                id
                sku
                ... on BundleProduct {
                    items {
                        option_id
                        title
                        required
                        type
                        position
                        sku
                        options {
                            id
                            quantity
                            position
                            is_default
                            price
                            price_type
                            can_change_quantity
                            label
                            product {
                                id
                                name
                                sku
                                tier_price
                                price_range {
                                    maximum_price {
                                        final_price {
                                            value
                                            currency
                                        }
                                    }
                                    minimum_price {
                                        final_price {
                                            value
                                            currency
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    }
`;

export const BundleOptions = props => {
    const product = props.product;
    const useProductFullDetailProps = props.useProductFullDetailProps;
    const {handleBundleChangeQty, extraPrice, resetBundleOption} = useProductFullDetailProps;
    const {bundleOptions} = useProductFullDetailProps;
    const classes = useStyle(defaultClasses, props.classes);

    const { data: optionData } = useQuery(PRODUCT_BUNDLE_OPTION_QUERY, {
        variables: {
            sku: product.sku
        },
        skip: !product || !product.sku
    });
    

    const items =
        optionData &&
        optionData.products &&
        optionData.products.items &&
        optionData.products.items[0] &&
        optionData.products.items[0].items
            ? optionData.products.items[0].items
            : false;

    useEffect(() => {
        return () => {
            resetBundleOption()
        }
    }, [])

    if (!(!!items && items.length > 0)) {
        return null;
    }
    const {quantity, option_value} = bundleOptions;
    let htmlSummary = null;
    let optionList = [];
    optionList = Object.entries(option_value).map(option => {
        const dataFound = items.find(
            ({option_id}) => Number(option_id) === Number(option[0])
        );
        let dataQuantity;
        for (const property in quantity) {
            if (property == dataFound.option_id) {
                dataQuantity = quantity[property];
            }
        }

        if (dataFound) {
            const {options} = dataFound;
            const optFound = options.find(({id}) => id === Number(option[1]));
            if (!optFound) return null;
            return (
                <div key={optFound.id} className={classes.summaryItem}>
                    <div
                        style={{fontWeight: '700'}}
                        className={classes.summaryItemTitle}
                    >
                        {dataFound.title}
                    </div>
                    <span>
                        {dataQuantity ? (
                            <span>
                                {dataQuantity} x {optFound.label}
                            </span>
                        ) : (
                            <span>
                                {optFound.quantity} x {optFound.label}
                            </span>
                        )}
                        <Optionlabel
                            title={''}
                            type_id={'bundle'}
                            item={optFound}
                            classes={defaultClasses}
                        />
                    </span>
                </div>
            );
        }
    });

    if (optionList.length) {
        htmlSummary = <React.Fragment>{optionList}</React.Fragment>;
    }
    const bundleList = (
        <div className={classes.summaryWrapper}>
            <ul className="summary-content">{htmlSummary}</ul>
        </div>
    );

    const bundleSummary = (
        <OptionSummary
            isVisible={Object.getOwnPropertyNames(bundleOptions.option_value).length > 0}
            classes={classes}
            price={extraPrice}
        >
            {bundleList}
        </OptionSummary>
    )

    const bundleOption = items.map(function (item, index) {
        let labelReq = '';
        if (item.required) {
            labelReq = '*';
        }
        const defaultQty = 1;
        const id = item.option_id;
        const handleChange = qty => {
            handleBundleChangeQty(id, qty);
        };
        const hidden =
            item.type === 'checkbox' || item.type === 'multi' ? 'hidden' : '';
        return (
            <div className={classes.optionRoot} key={index}>
                <div
                    key={item.option_id}
                    className={classes.optionItem}
                    style={{margin: '1rem 1.5rem'}}
                >
                    <div
                        className={classes.optionTitle}
                        style={{fontSize: '18px', height: 30}}
                    >
                        <span className={classes.optionTitleSpan}>
                            {item.title}{' '}
                            <span style={{marginLeft: '5px', color: 'red'}}>
                                {labelReq}
                            </span>
                        </span>
                    </div>
                    <div className={classes.optionContent} id="bundle-options">
                        <BundleContent
                            item={item}
                            itemType={item.type}
                            useProductFullDetailProps={
                                useProductFullDetailProps
                            }
                            classes={classes}
                        />{' '}
                        {!hidden && (
                            <div
                                className={`bundle-option-qty ${item.type}`}
                                data-name={item.option_id}
                                style={{
                                    marginLeft: '25px',
                                    fontWeight: 600
                                }}
                            >
                                <span>
                                    <FormattedMessage
                                        id="bundleOptions.quantity"
                                        defaultMessage="Quantity"
                                    />
                                </span>
                                <Qty
                                    dataId={item.option_id}
                                    key={item.option_id}
                                    className={`option-qty option-qty option-qty-${
                                        item.option_id
                                    }`}
                                    value={defaultQty}
                                    inputStyle={{
                                        margin: '0 15px',
                                        borderRadius: 0,
                                        border: 'solid #eaeaea 1px',
                                        maxWidth: 50,
                                        color: 'black',
                                        textAlign: 'center'
                                    }}
                                    onChange={qty => handleChange(qty) || null}
                                />
                            </div>
                        )}
                    </div>
                </div>
            </div>
        );
    });
    return (
        <div>
            {bundleOption}
            {bundleSummary}
        </div>
    );
};
