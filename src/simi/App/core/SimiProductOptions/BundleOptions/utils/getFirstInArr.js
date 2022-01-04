export const getFirstInArr = (arr, defaultVal = undefined) => {
    const f = arr.find(x => true)
    return f !== undefined ? f : defaultVal
}
