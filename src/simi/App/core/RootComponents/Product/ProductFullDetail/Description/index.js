import React from 'react'
import Identify from 'src/simi/Helper/Identify';
import RichText from 'src/simi/BaseComponents/RichText';

require('./description.scss')

const Description = props => {
    const {product} = props
    return (
        <React.Fragment>
            <h2 className="description-title">
                <span>{Identify.__('Description')}</span>
            </h2>
            <RichText content={product.description.html} />
        </React.Fragment>
    )
}

export default Description