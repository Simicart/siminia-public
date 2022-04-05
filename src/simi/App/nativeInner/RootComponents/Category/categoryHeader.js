import React from 'react'

const CategoryHeader = props => {
    const { name, image_url } = props
    return (
        <div style={{width: '100%', overflow: 'hidden', maxWidth:'500px', marginTop:'20px'}}>
            <img
                alt={name}
                src={`${image_url}`}
                style={{width: '100%'}}
            />
        </div>
    )
}

export default CategoryHeader