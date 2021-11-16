import React from 'react';
import Identify from 'src/simi/Helper/Identify';
import Price from 'src/simi/BaseComponents/Price';
import ObjectHelper from 'src/simi/Helper/ObjectHelper';
import PropTypes from 'prop-types';

require('./productprice.scss');

const initState = {
    customOptionPrice: { exclT: 0, inclT: 0 },
    downloadableOptionPrice: { exclT: 0, inclT: 0 },
}

class ProductPrice extends React.Component {

    constructor(props) {
        super(props);
        const { configurableOptionSelection } = props
        this.state = { ...initState, ...{ sltdConfigOption: ObjectHelper.mapToObject(configurableOptionSelection) } };
    }

    setCustomOptionPrice(exclT, inclT) {
        this.setState({
            customOptionPrice: { exclT, inclT }
        })
    }
    setDownloadableOptionPrice(exclT, inclT) {
        this.setState({
            downloadableOptionPrice: { exclT, inclT }
        })
    }

    static getDerivedStateFromProps(nextProps, prevState) {
        const { configurableOptionSelection } = nextProps
        const { sltdConfigOption } = prevState
        const newSltdConfigOption = ObjectHelper.mapToObject(configurableOptionSelection)
        if (!ObjectHelper.shallowEqual(sltdConfigOption, newSltdConfigOption))
            return { ...initState, ...{ sltdConfigOption: newSltdConfigOption } }
        return {}
    }

    calcConfigurablePrice = (price) => {
        const { sltdConfigOption } = this.state
        const { data, configurableOptionSelection } = this.props
        const { /* simiExtraField, */ configurable_options, variants } = data;

        if (configurableOptionSelection && configurable_options && configurable_options.length && variants && variants.length && Object.values(sltdConfigOption).every(k => k !== 'undefined')) {
            const { variants } = data;
            const findVariant = variants.find(({ attributes }) => attributes.find(({ value_index }) => Object.values(sltdConfigOption).includes(String(value_index))));
            if (findVariant){
                price.regularPrice.amount.value = findVariant.product.price.regularPrice.amount.value;
            }
        }
    }

    addOptionPrice(calculatedPrices, optionPrice) {
        calculatedPrices.minimalPrice.excl_tax_amount.value += optionPrice.exclT;
        calculatedPrices.minimalPrice.amount.value += optionPrice.inclT;
        calculatedPrices.regularPrice.excl_tax_amount.value += optionPrice.exclT;
        calculatedPrices.regularPrice.amount.value += optionPrice.inclT;
        calculatedPrices.maximalPrice.excl_tax_amount.value += optionPrice.exclT;
        calculatedPrices.maximalPrice.amount.value += optionPrice.inclT;
    }

    calcPrices(price) {
        const { customOptionPrice, downloadableOptionPrice } = this.state
        const calculatedPrices = JSON.parse(JSON.stringify(price))
        const { data } = this.props
        if (data.type_id === 'configurable')
            this.calcConfigurablePrice(calculatedPrices)

        // custom option
        this.addOptionPrice(calculatedPrices, customOptionPrice)

        // downloadable option
        if (data.type_id === 'downloadable')
            this.addOptionPrice(calculatedPrices, downloadableOptionPrice)

        return calculatedPrices
    }

    render() {
        const { data } = this.props;
        const { stock_status } = data;
        const prices = this.calcPrices(data.price)

        const stockLabel = stock_status === "IN_STOCK" ? Identify.__('In stock') : Identify.__('Out of stock');

        const priceLabel = (
            <div className='prices-layout'>
                {
                    (data.type_id !== "grouped") &&
                    <Price config={1} key={Identify.randomString(5)} prices={prices} type={data.type_id} />
                }
            </div>
        );
        return (
            <div className='prices-container' id={data.type_id}>
                {priceLabel}
                <div className='product-stock-status'>
                    <div className='stock-status'>
                        {stockLabel}
                    </div>
                    {
                        data.sku &&
                        <div className={`product-sku flex`} id="product-sku">
                            <span className='sku-label'>{Identify.__('Sku') + ": "} {data.sku}</span>
                        </div>
                    }
                </div>
            </div>

        );
    }
}

ProductPrice.propTypes = {
    data: PropTypes.object.isRequired,
    configurableOptionSelection: PropTypes.instanceOf(Map)
}
ProductPrice.defaultProps = {
    configurableOptionSelection: new Map(),
}

export default ProductPrice;
