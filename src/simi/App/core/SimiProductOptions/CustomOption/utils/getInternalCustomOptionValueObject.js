const possibleKeys = [
    'multiple_value',
    'checkbox_value',
    'radio_value',
    'dropdown_value',
    'date_value',
    'field_value',
    'area_value'
]

export const getInternalCustomOptionValueObject = (o) => {
    const key = possibleKeys.find(k => !!o[k])
    return {key:o.uid, value: o[key]}
}
