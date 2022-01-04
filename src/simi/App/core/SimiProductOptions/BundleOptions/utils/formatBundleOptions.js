export const formatBundleOptions = (options) => {
    return Object.entries(options).map(([key, value]) => {
        const valStr = value ? (value.length === 1 ? value[0].toString() : value.join(',')) : '1';
        return {uid: key, value: valStr}
    }).filter(x => !!x)
}
