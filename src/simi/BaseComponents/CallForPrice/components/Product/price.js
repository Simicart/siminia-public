import { usePrice } from '../../talons/usePrice'

const Price = (props) => {
    const { showPrice, hidePrice, product } = props

    const talonProps = usePrice({
        product
    })

    const { isHidePrice } = talonProps

    if(isHidePrice) {
        return hidePrice
    }

    return showPrice
}

Price.defaultProps = {
    showPrice: null,
    hidePrice: null,
}

export default Price