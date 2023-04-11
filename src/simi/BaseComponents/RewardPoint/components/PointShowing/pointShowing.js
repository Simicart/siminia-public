import React from 'react';
import { FormattedMessage } from 'react-intl';
import { usePointShowing } from '../../talons/usePointShowing';
import { useStyle } from '@magento/venia-ui/lib/classify';
import defaultClasses from './pointShowing.module.css';

const PointShowing = props => {
    const { type } = props;

    const classes = useStyle(defaultClasses, props.classes);

    const talonProps = usePointShowing({
        type
    });

    const { isShow, point, icon, isSignedIn } = talonProps;

    if (!isShow) return null;

    const rewardIcon = icon ? (
        <span className={classes.image}>
            <img alt='rewardIcon' src={icon} />
        </span>
    ) : null;

    if (type === 'registration') {
        return (
            <div className={classes.root}>
                {rewardIcon}
                <span className={classes.message}>
                    <FormattedMessage
                        id={'Sign up now to earn {point} points'}
                        defaultMessage={'Sign up now to earn {point} points'}
                        values={{ point }}
                    />
                </span>
            </div>
        );
    }

    if (type === 'newsletter') {
        return (
            <div className={classes.root}>
                {rewardIcon}
                <span className={classes.message}>
                    <FormattedMessage
                        id={
                            'You can earn {point} points by subcribe newsletter'
                        }
                        defaultMessage={
                            'You can earn {point} points by subcribe newsletter'
                        }
                        values={{ point }}
                    />
                </span>
            </div>
        );
    }

    if (type === 'review') {
        let message = (
            <FormattedMessage
                id={'Login and earn {point} points for each review'}
                defaultMessage={'Login and earn {point} points for each review'}
                values={{ point }}
            />
        );
        if (isSignedIn) {
            message = (
                <FormattedMessage
                    id={'Earn {point} points for each review'}
                    defaultMessage={'Earn {point} points for each review'}
                    values={{ point }}
                />
            );
        }
        return (
            <div className={classes.root}>
                {rewardIcon}
                <span className={classes.message}>{message}</span>
            </div>
        );
    }

    return null;
};

export default PointShowing;
