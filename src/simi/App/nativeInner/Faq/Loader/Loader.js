import React from 'react';
import defaultClasses from './Loader.module.css'

const Loader = props => {
	const display = props.loading ? 'block' : 'none'
	const classes = defaultClasses
	return (
		<div className={classes.overlay} style={{display: display}}>
			<img src='https://mpmed.pwa-commerce.com/static/version1607077015/frontend/Magento/luma/en_US/images/loader-1.gif' />
		</div>
	)
}

export default Loader