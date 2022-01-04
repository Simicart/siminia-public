export const formatCustomOptions = (options) => {
    return Object.entries(options).map(([key, value]) => {
        if (value === null) {
            return null
        }
        const valStr = value ? (value.length === 1 ? value[0].toString() : value.join(',')) : ''
        return {uid: key, value: valStr}
    }).filter(x => !!x)
}
