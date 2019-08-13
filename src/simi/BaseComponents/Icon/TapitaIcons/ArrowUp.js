import React from 'react'
import Base from './Abstract'
class ArrowUp extends Base {
    render(){
        return this.renderSvg('0 0 24 24',<path d="M7.41 15.41L12 10.83l4.59 4.58L18 14l-6-6-6 6z"></path>)
    }
}
export default ArrowUp