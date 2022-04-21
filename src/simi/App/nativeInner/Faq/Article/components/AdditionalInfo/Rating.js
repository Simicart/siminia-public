import React, { useState } from 'react';
import { useMutation } from '@apollo/client';
import { ADD_HELPFUL } from '../../../../talons/Faq/Faq.gql'
import * as Icon from 'react-feather'
import defaultClasses from './Rating.module.css'

const Rating = props => {
	const { id, positives, negatives } = props
	const ratingData = JSON.parse(localStorage.getItem(`article${id}`))
	let hasRatingData = ratingData ? true : false
	const classes = defaultClasses
	const [positive, setPositive] = useState(
		!hasRatingData ? positives : (positives < ratingData.positive) ? ratingData.positive : positives
	);
	const [negative, setNegative] = useState(
		!hasRatingData ? negatives : (negatives < ratingData.negative) ? ratingData.negative : negatives
	);
	const [positiveRated, setPositiveRated] = useState(
		!hasRatingData ? false : (false || ratingData.positiveRated)
	);
	const [negativeRated, setNegativeRated] = useState(
		!hasRatingData ? false : (false ||  ratingData.negativeRated)
	);
	const [disable, setDisable] = useState(
		!hasRatingData ? false : (false || ratingData.disable)
	)
	const [display, setDisplay] = useState(
		!hasRatingData ? false : (false || ratingData.display)
	)
	const [isRated, {data}] = useMutation(ADD_HELPFUL);

	const messageStyle = {
		background: !disable ? '#e5efe5' : '#fae5e5',
		color: !disable ? '#006400' : '#e02b27',
	}
	return (
		<div className={classes.container_rating}>
			<div className={classes.rating_label}>
				<span>Did you find it helpful? </span>
				<div className={classes.rating_action}>
					<div className={classes.positive} >
						<button 
							className={classes.btn}
							style={{
								'backgroundColor': positiveRated ? '#1abc9c' : '',
								'color': positiveRated ? '#fff' : '#000'
							}}
							onClick={() => {
								if(!positiveRated && !negativeRated) {
									isRated({variables: {isHelpful: true, articleId: id}})
										.then(res => localStorage.setItem(
														`article${props.id}`, 
														JSON.stringify({
															id,
															positive: positive+1,
															negative,
															positiveRated: true,
															negativeRated,
															disable,
															display
														})
										)
									)
									setPositive(positive+1);
									setPositiveRated(true)
									setDisplay(true);
									localStorage.setItem(
										`article${props.id}`, 
										JSON.stringify({
											id,
											positive: positive+1,
											negative,
											positiveRated: true,
											negativeRated,
											disable,
											display
										})
									)
								} else {
									setDisplay(true)
									setDisable(true)
								}
							}}
						>
							Yes&thinsp;
							(<span>{positive}</span>)
						</button>
					</div>
					<div className={classes.negative}>
						<button 
							className={classes.btn}
							style={{
								'backgroundColor': negativeRated ? '#1abc9c' : '',
								'color': negativeRated ? '#fff' : '#000'
							}}
							onClick={() => {
								if(!negativeRated && !positiveRated) {
									isRated({variables: {isHelpful: false, articleId: id}})
										.then(res => localStorage.setItem(
														`article${props.id}`, 
														JSON.stringify({
															id,
															positive,
															negative: negative+1,
															positiveRated,
															negativeRated: true,
															disable,
															display
														})
										)
									)
									setNegative(negative+1);
									setNegativeRated(true)
									setDisplay(true)
								} else {
									setDisplay(true)
									setDisable(true)

								}
							}}
						>
							No&thinsp;
							(<span>{negative}</span>)
						</button>
					</div>
				</div>
				&thinsp;
			</div>
			<div 
				className={classes.message} 
				style = {{
					display: display ? 'block' : 'none',
					...messageStyle
				}}
			>
				{!disable ? <Icon.Check className={classes['message-icon']}/> : <Icon.X className={classes['message-icon']} />} 
				<div>
					{!disable ? 'Thank for your vote!' : 'You have voted already!'}
				</div>
			</div>
		</div>
	)
}

export default Rating