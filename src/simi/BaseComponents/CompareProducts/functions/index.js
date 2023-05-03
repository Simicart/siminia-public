const comparisonList = JSON.parse(localStorage.getItem('comparison-list'))

const removeProductFromComparisonList = (index) => {
    const startArr = comparisonList.slice(0, index)
    const endArr = comparisonList.slice(index + 1, comparisonList.length)
    const resultArr = startArr.concat(endArr)
    if (resultArr.length === 0) {
        localStorage.removeItem('comparison-list')
        localStorage.setItem("reload", true)
        localStorage.setItem("changeList", JSON.stringify({
            type: "remove",
            value: comparisonList[index].name
        }))
    }
    else {
        localStorage.setItem('comparison-list', JSON.stringify(resultArr))
        localStorage.setItem("reload", true)
        localStorage.setItem("changeList", JSON.stringify({
            type: "remove",
            value: comparisonList[index].name
        }))
    }
    setTimeout(() => {
        window.location.reload()
    }, 500)
}

const removeAllProductsFromComparisonList = () => {
    localStorage.removeItem('comparison-list')
    localStorage.setItem("reload", true)
    localStorage.setItem("changeList", JSON.stringify({
        type: "removeAll",
        value: ""
    }))
    setTimeout(() => {
        window.location.reload()
    }, 500)
}

const addProductToComparisonList = (item) => {
    if (localStorage.getItem("comparison-list")) {
        const comparisonList = JSON.parse(localStorage.getItem("comparison-list"))
        if (!comparisonList.find(ele => ele.sku === item.sku)) {
            comparisonList.push(item)
            localStorage.setItem("comparison-list", JSON.stringify(comparisonList))
            localStorage.setItem("reload", true)
            localStorage.setItem("changeList", JSON.stringify({
                type: "add",
                value: item.name
            }))
            window.location.reload()
        }
        else {
            localStorage.setItem("reload", true)
            localStorage.setItem("changeList", JSON.stringify({
                type: "add",
                value: item.name
            }))
            window.location.reload()
        }
    }
    else {
        localStorage.setItem("comparison-list", JSON.stringify([item]))
        localStorage.setItem("reload", true)
        localStorage.setItem("changeList", JSON.stringify({
            type: "add",
            value: item.name
        }))
        window.location.reload()
    }
}

export { removeProductFromComparisonList, removeAllProductsFromComparisonList, addProductToComparisonList }