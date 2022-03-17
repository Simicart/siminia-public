import React from 'react'
require('./styles.scss')

const ImageLoading = props => {

    return <div class="main-item">
    <div style={{height: props.height, width: props.width ? props.width : 'auto'}} class="animated-background">
      <div class="background-masker"></div>
    </div>
    
  </div>
}

export default ImageLoading