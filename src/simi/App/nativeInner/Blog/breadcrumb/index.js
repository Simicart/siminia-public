import React from 'react';
import classes from './breadcrumb.module.css';
import { Link } from 'react-router-dom';
import { useIntl } from 'react-intl';

const BreadCrumb = props => {
    const { items } = props;
    const { formatMessage } = useIntl();

    return (
        <div className={classes.breadCrumb}>
            <Link className={classes.breadCrumbLink} to="/">
                {formatMessage({
                    id: 'home',
                    defaultMessage: 'Home'
                })}
            </Link>
            {items.map((item, index) => (
                <React.Fragment key={index}>
                    <span className={classes.breadCrumbSeparator}>{`/`}</span>
                    {item.path ? (
                        <Link className={classes.breadCrumbLink} to={item.path}>
                            {item.label}
                        </Link>
                    ) : (
                        <span className={classes.breadCrumbText}>
                            {item.label}
                        </span>
                    )}
                </React.Fragment>
            ))}
        </div>
    );
};
export default BreadCrumb;
