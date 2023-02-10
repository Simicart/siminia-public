
const convertRatings = (valueIndex, priceIndex, ratingIndex) => {
    let valueEncoded = ''
    let priceEncoded = ''
    let ratingEncoded = ''
    switch(valueIndex) {
        case 0:
            valueEncoded = 'Ng=='
            break
        case 1: 
            valueEncoded = 'Nw=='
            break
        case 2:
            valueEncoded = 'OA=='
            break
        case 3:
            valueEncoded = 'OQ=='
            break
        case 4:
            valueEncoded = 'MTA='
            break
        default: 
            break
    }
    switch(priceIndex) {
        case 0:
            priceEncoded = 'MTE='
            break
        case 1: 
            priceEncoded = 'MTI='
            break
        case 2:
            priceEncoded = 'MTM='
            break
        case 3:
            priceEncoded = 'MTQ='
            break
        case 4:
            priceEncoded = 'MTU='
            break
        default: 
            break
    }
    switch(ratingIndex) {
        case 0:
            ratingEncoded = 'MTY='
            break
        case 1: 
            ratingEncoded = 'MTc='
            break
        case 2:
            ratingEncoded = 'MTg='
            break
        case 3:
            ratingEncoded = 'MTk='
            break
        case 4:
            ratingEncoded = 'MjA='
            break
        default: 
            break
    }
    return {
        valueEncoded,
        priceEncoded,
        ratingEncoded
    }
}

export default convertRatings