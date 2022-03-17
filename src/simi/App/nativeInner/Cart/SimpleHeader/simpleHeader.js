import React, { Fragment } from 'react';
import { useStyle } from '@magento/venia-ui/lib/classify';
import { Link } from 'src/drivers';
import { useHistory } from 'react-router-dom';
import { useWindowSize } from '@magento/peregrine';
import defaultClasses from '../../Header/header.module.css';
import IconWithColor from '../IconWithColor/IconWithColor';
import { ArrowLeft } from 'react-feather';
import { logoUrl } from 'src/simi/Helper/Url';

import defaultClasses1 from './simpleHeader.module.css';

const SimpleHeader = props => {
    const { titleText = '', customChild, customTitle } = props || {};

    const history = useHistory();
    const classes = useStyle(defaultClasses, props.classes);
    const windowSize = useWindowSize();
    const isPhone = windowSize.innerWidth <= 1280;
    const canGoBack = history.length > 0;

    const titleObj = customTitle ? (
        customTitle
    ) : (
        <span className={`header-title ${defaultClasses1['title-zone']}`}>
            {titleText}
        </span>
    );

    const leftIcon = canGoBack ? (
        <span
            className={`main-header-icon ${defaultClasses1['back-zone']}`}
            onClick={() => history.goBack()}
        >
            <IconWithColor src={ArrowLeft} size={20} />
        </span>
    ) : (
        <Link to="/">
            <img className="main-header-icon" src={logoUrl()} alt="logo" />
        </Link>
    );

    const baseHeader = (
        <Fragment>
            <div className={classes['header-search-form']}>
                <div className={defaultClasses1.virtualHeader}>
                    <div>
                        {leftIcon}
                        {titleObj}
                    </div>
                </div>
            </div>
        </Fragment>
    );

    if (isPhone) {
        return (
            <React.Fragment>
                {customChild ? customChild : baseHeader}
            </React.Fragment>
        );
    } else {
        return null;
    }
};

export default SimpleHeader;
