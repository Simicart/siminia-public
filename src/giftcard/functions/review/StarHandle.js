
 const changeValueStar = (index, setValue, setValueIndex) => {
    const tmp = []
    for(let i=0; i<5; i++) {
        if(i<=index) {
            tmp[i]='checked'
        }
        else {
            tmp[i]='uncheck'
        }
    }
    setValueIndex(index)
    setValue(tmp)
}

const changePriceStar = (index, setPrice, setPriceIndex) => {
    const tmp = []
    for(let i=0; i<5; i++) {
        if(i<=index) {
            tmp[i]='checked'
        }
        else {
            tmp[i]='uncheck'
        }
    }
    setPriceIndex(index)
    setPrice(tmp)
}

const changeRatingStar = (index, setRating, setRatingIndex) => {
    const tmp = []
    for(let i=0; i<5; i++) {
        if(i<=index) {
            tmp[i]='checked'
        }
        else {
            tmp[i]='uncheck'
        }
    }
    setRatingIndex(index)
    setRating(tmp)
}

export { changeValueStar, changePriceStar, changeRatingStar }