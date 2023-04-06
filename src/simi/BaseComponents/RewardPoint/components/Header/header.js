import React from 'react';
import defaultClasses from './headerRP.module.css';
import { FormattedMessage } from 'react-intl';
import { useStyle } from '@magento/venia-ui/lib/classify';
import { useHeader } from '../../talons/useHeader';

const Header = props => {
    const classes = useStyle(defaultClasses, props.classes);
    const talonsProps = useHeader({});

    const { customerPoint, isActive, pointIcon } = talonsProps;

    if (!isActive) {
        return null;
    }

    const icon = pointIcon ? (
        <span>
            <img alt='pointIcon' src={pointIcon} />
        </span>
    ) : null;

    return (
        <div className={classes.root}>
            {icon}
            <span>
                <FormattedMessage
                    id="You Have {point} Point"
                    defaultMessage="You Have {point} Point"
                    values={{
                        point: customerPoint
                    }}
                />
            </span>
        </div>
    );
};

export default Header;
