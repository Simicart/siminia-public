const comparisonList = JSON.parse(localStorage.getItem('comparison-list'))

const removeProductFromComparisonList = (index, setIsOpenMsg, setOpenMsg) => {
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
        setTimeout(() => {
            setOpenMsg(true)
            setIsOpenMsg(true)
        }, 500)
        setTimeout(() => {
            window.location.reload()
        }, 3500)
    }
    else {
        localStorage.setItem('comparison-list', JSON.stringify(resultArr))
        localStorage.setItem("reload", true)
        localStorage.setItem("changeList", JSON.stringify({
            type: "remove",
            value: comparisonList[index].name
        }))
        setTimeout(() => {
            setOpenMsg(true)
            setIsOpenMsg(true)
        }, 500)
        setTimeout(() => {
            window.location.reload()
        }, 3500)
    }
}

const removeAllProductsFromComparisonList = (setIsOpenMsg, setOpenMsg) => {
    localStorage.removeItem('comparison-list')
    localStorage.setItem("reload", true)
    localStorage.setItem("changeList", JSON.stringify({
        type: "removeAll",
        value: ""
    }))
    setTimeout(() => {
        setOpenMsg(true)
        setIsOpenMsg(true)
    }, 500)
    setTimeout(() => {
        window.location.reload()
    }, 3500)
}

const addProductToComparisonList = (item, setIsOpen, setOpenMessagePopUp) => {
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
            setIsOpen(true)
            setOpenMessagePopUp(true)
            setTimeout(() => {
                window.location.reload()
            }, 3000)
        }
        else {
            localStorage.setItem("reload", true)
            localStorage.setItem("changeList", JSON.stringify({
                type: "add",
                value: item.name
            }))
            setIsOpen(true)
            setOpenMessagePopUp(true)
        }
    }
    else {
        localStorage.setItem("comparison-list", JSON.stringify([item]))
        localStorage.setItem("reload", true)
        localStorage.setItem("changeList", JSON.stringify({
            type: "add",
            value: item.name
        }))
        setIsOpen(true)
        setOpenMessagePopUp(true)
        setTimeout(() => {
            window.location.reload()
        }, 3000)
    }
}

export { removeProductFromComparisonList, removeAllProductsFromComparisonList, addProductToComparisonList }