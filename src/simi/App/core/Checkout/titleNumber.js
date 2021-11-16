import React from 'react';
import { mergeClasses } from '@magento/venia-ui/lib/classify';
import defaultClasses from './titleNumber.css';

const TitleNumber = props => {
    const { number } = props;
    const classes = mergeClasses(defaultClasses, props.classes);
    return (<div className={classes.titleNumberRoot}>{number}</div>);
}

export default TitleNumber;