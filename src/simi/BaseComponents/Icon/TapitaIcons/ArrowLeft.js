import React from 'react'
import Abstract from './Abstract'
class ArrowLeft extends Abstract {
    render(){
        return this.renderSvg('0 0 24 24',<path d="M8.59 16.34l4.58-4.59-4.58-4.59L10 5.75l6 6-6 6z"></path>)
    }
}
export default ArrowLeft