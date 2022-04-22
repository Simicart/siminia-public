import React from 'react';
import defaultClasses from './AdditionalInfo.module.css'
import Social from './Social';
import Rating from './Rating';

const AdditionalInfo = props => {
	const classes = defaultClasses
	const {
		positives,
		negatives,
		article_id
	} = props.data
	return (
		<div className={classes.container_additionalinfo}>
			<Social articleUrl={props.articleUrl}/>
			<hr/>
			<Rating positives={positives} negatives={negatives} id={article_id}/>
		</div>
	)
}

export default AdditionalInfo 