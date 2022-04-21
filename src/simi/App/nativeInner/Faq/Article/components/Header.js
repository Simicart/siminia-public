import React from 'react'
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
// import { faFileAlt, faEye, faThumbsUp, faCalendarAlt } from '@fortawesome/free-regular-svg-icons'
import defaultClasses from './Header.module.css'
import {FaFileAlt,FaEye,FaThumbsUp,FaCalendarAlt} from 'react-icons/fa'

const Header = props => {
	const classes = defaultClasses
	const created_date = props.created_at ? props.created_at.split(' ')[0].split('-') : [];
	const year = created_date[0];
	let month = created_date[1];
	const day = created_date[2];

	switch (month) {
	  	case '01':
	    	month = "January";
	    	break;
	  	case '02':
	     	month = "Febuary";
	    	break;
	  	case '03':
		    month = "March";
		    break;
	 	case '04':
		    month = "April";
		    break;
	  	case '05':
		    month = "May";
		    break;
	  	case '06':
		    month = "June";
			break;
		case '07':
		    month = "July";
			break;
		case '08':
		    month = "August";
			break;
		case '09':
		    month = "September";
			break;
		case '10':
		    month = "October";
			break;
		case '11':
		    month = "November";
			break;
		case '12':
		    month = "December";
			break;
	}

	return (
		<div className={classes.container}>
			<div className={classes.iconContainer} >
				{/* <FontAwesomeIcon className={classes.headerIcon} icon={faFileAlt}/> */}
				<FaFileAlt/>
			</div>
			<div className={classes.headerContent}>
				<h3>{props.name}</h3>
				<div className={classes.description}>
					<span>
						{/* <FontAwesomeIcon className={classes.icon} icon={faEye} /> */}
						<FaEye/>
						&thinsp;{props.views} {props.views > 1 ? 'views' : 'view'}
					</span>
					<span>
						{/* <FontAwesomeIcon className={classes.icon} icon={faCalendarAlt} /> */}
						<FaCalendarAlt/>
						&thinsp;{`${month} ${day}, ${year}`}
					</span>
					<span>
						{/* <FontAwesomeIcon className={classes.icon} icon={faThumbsUp} /> */}
						<FaThumbsUp/>
						&thinsp;{props.positives}
					</span>
				</div>
			</div>
		</div>
	)
}

export default Header