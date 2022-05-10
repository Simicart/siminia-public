//support Km, Miles, m
export const convertToMeter = (value, unit) => {
    const uniformUnit = unit.toLowerCase();

    if (uniformUnit === 'm') {
        return value
    }
    let returnValue = value * 1000
    if (unit !== 'km') {
        return returnValue * 0.621371192
    }
}