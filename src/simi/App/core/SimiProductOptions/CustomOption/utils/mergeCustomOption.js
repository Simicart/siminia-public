export const mergeCustomOption = (payload, options) => {
    return {
        ...payload,
        product: {
            ...payload.product,
            entered_options: (payload.product.entered_options || []).concat(options)
        }
    }
}
