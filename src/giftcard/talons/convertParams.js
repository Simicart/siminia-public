
const convertParams = (params) => {
    for (let i=0;i<params.length;i++) {
        if(params[i] !== 's') {
            params[i] = params[i].charAt(0).toUpperCase() + params[i].slice(1)
        }
    }
    for(let i=0;i<params.length-1;i++) {
        if(params[i+1] !== 's') {
            params[i] += ' '
        }
        else {
            params[i] += `'`
        }
    }
    return params.join('')
}

export default convertParams