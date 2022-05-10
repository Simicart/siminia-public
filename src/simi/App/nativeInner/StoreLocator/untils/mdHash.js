const md5 = require('md5')

export const md_hash = (x) => {
    if (!md5) {
        throw 'No md5'
    }

    if (x === null) {
        return 'null'
    } else if (x === undefined) {
        return 'undefined'
    } else if (typeof x == 'object') {
        try {
            return md5(JSON.stringify(x))
        } catch (e) {
            return md5(JSON.stringify(Object.keys(x)))
        }
    } else {
        return md5(x.toString())
    }
}
