import React, { useState } from 'react'
import { logoUrl } from 'src/simi/Helper/Url'

const Image = props => {
    const { src, alt } = props;
    const [imageUrl, setImageUrl] = useState(src);
    const fallBackUrl = props.fallBackUrl ? props.fallBackUrl : logoUrl();
    const childProps = JSON.parse(JSON.stringify(props));
    if (childProps.fallBackUrl)
        delete childProps.fallBackUrl;
    return (
        <img
            {...childProps}
            src={imageUrl}
            onError={() => { if (imageUrl !== fallBackUrl) { setImageUrl(fallBackUrl) } }}
            alt={alt ? alt : 'FallbackImg'}
        />
    );
}
export default Image;