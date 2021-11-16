import React from 'react';
import defaultClasses from './FashionableDotPagination.css';

const generateClass = (clo, icl, ...cl) => {
    const entries = (cl || []).filter(x => !!x);
    const listCl = Object.entries(clo || {}).filter(([k, v]) => {
        return entries.includes(k);
    });
    return listCl.map(([k, v]) => v).join(' ') + (icl ? ` ${icl}` : '');
};

export const SimpleDot = props => {
    const { className = '', ...rest } = props || {};
    const newClass = generateClass(
        defaultClasses,
        '',
        'simple-grey-dot',
        className
    );

    return (
        <img
            className={newClass}
            src={require('./icon/dot.svg')}
            alt={''}
            {...rest}
        />
    );
};

export const DotWithOrbital = props => {
    const { className = '', ...rest } = props || {};
    const newClass = generateClass(
        defaultClasses,
        '',
        'orbital-dot',
        className
    );

    return (
        <img
            className={newClass}
            src={require('./icon/dot-circle.svg')}
            alt={''}
            {...rest}
        />
    );
};

export const HorizontalBar = props => {
    const { className = '', ...rest } = props || {};
    const newClassName = generateClass(
        defaultClasses,
        '',
        'small-horizontal-bar',
        className
    );

    return <i className={newClassName} {...rest} />;
};

export const FashionableDotPagination = props => {
    const {
        numberOfPages = 0,
        currentIndex = 0,
        onChangeIndex: _onChangeIndex,
        pagingStyle = {}
    } = props || {};

    const content = [...Array(numberOfPages).keys()].map(x => {
        const onChangeIndex = () => _onChangeIndex(x);
        if (currentIndex === x) {
            if (currentIndex === 0) {
                return (
                    <React.Fragment key={x}>
                        <DotWithOrbital />
                        <HorizontalBar />
                    </React.Fragment>
                );
            } else if (currentIndex === numberOfPages - 1) {
                return (
                    <React.Fragment key={x}>
                        <HorizontalBar />
                        <DotWithOrbital />
                    </React.Fragment>
                );
            } else {
                return (
                    <React.Fragment key={x}>
                        <HorizontalBar />
                        <DotWithOrbital />
                        <HorizontalBar />
                    </React.Fragment>
                );
            }
        } else {
            return (
                <SimpleDot
                    key={x}
                    className={x === currentIndex ? 'active' : ''}
                    onClick={onChangeIndex}
                />
            );
        }
    });

    if (numberOfPages === 0) {
        return '';
    }

    const newClass = generateClass(
        defaultClasses,
        '',
        'fashionable-pagination-container'
    );

    return (
        <div className={newClass} style={pagingStyle}>
            {content}
        </div>
    );
};
