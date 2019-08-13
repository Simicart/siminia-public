import React, {useState} from 'react'
import { logoUrl } from 'src/simi/Helper/Url'

const Image = props => {
    const { src, alt } = props
    const [imageUrl, setImageUrl] = useState(src)
    const logo_url = logoUrl()
    return (
        <img 
            {...props} 
            src={imageUrl} 
            onError={() => {if(imageUrl !== logo_url) {setImageUrl(logo_url)}}}
            alt={alt?alt:'FallbackImg'}
        />
    );
}
export default Image;