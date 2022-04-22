import React from 'react'
import defaultClasses from './Container.module.css'
import Header from './Header.js'
import RichContent from '@magento/venia-ui/lib/components/RichContent';

const Container = props => {
	const classes = defaultClasses
	const {
		name,
		created_at,
		views,
		positives,
		article_content
	} = props.data
	return (
		<div className={classes.container}>
			<div className={classes.section}>
				<div className={classes.contentContainer}>
					<Header 
						name={name} 
						created_at={created_at}
						views={views}
						positives={positives}
					/>
					{/* <div dangerouslySetInnerHTML={{__html: article_content}} /> */}
					<RichContent html={article_content} />
				</div>
			</div>
		</div>
	)
}

export default Container