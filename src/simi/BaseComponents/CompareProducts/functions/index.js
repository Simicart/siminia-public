const comparisonList = JSON.parse(localStorage.getItem('comparison-list'))

const removeProductFromComparisonList = (index) => {
    const startArr = comparisonList.slice(0, index)
    const endArr = comparisonList.slice(index + 1, comparisonList.length)
    const resultArr = startArr.concat(endArr)
    localStorage.setItem('comparison-list', JSON.stringify(resultArr))
    setTimeout(() => {
        window.location.reload()
    }, 500)
}

const removeAllProductsFromComparisonList = () => {
    localStorage.removeItem('comparison-list')
    setTimeout(() => {
        window.location.reload()
    }, 500)
}

const addProductToComparisonList = (item, setIsOpen) => {
    if (localStorage.getItem("comparison-list")) {
        const comparisonList = JSON.parse(localStorage.getItem("comparison-list"))
        if (!comparisonList.find(ele => ele.sku === item.sku)) {
            comparisonList.push(item)
            localStorage.setItem("comparison-list", JSON.stringify(comparisonList))

            localStorage.setItem("pageReloaded", true);
            window.location.reload()
            
                if (localStorage.getItem("pageReloaded")) {
                    console.log("Page reloaded!");
                    localStorage.removeItem("pageReloaded");
                }
            
        }   
        else {
            localStorage.setItem("comparison-list", JSON.stringify([item]))
            localStorage.setItem("pageReloaded", true);
            window.location.reload()
            
                if (localStorage.getItem("pageReloaded")) {
                    console.log("Page reloaded!");
                    localStorage.removeItem("pageReloaded");
                }
            
        }
    }
}

    export { removeProductFromComparisonList, removeAllProductsFromComparisonList, addProductToComparisonList }