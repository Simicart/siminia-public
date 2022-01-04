import React from 'react';
import Shimmer from '@magento/venia-ui/lib/components/Shimmer';
import { useStyle } from 'src/classify';
import defaultClasses from './option.module.css';
import TileListShimmer from './tileList.shimmer';

const OptionShimmer = props => {
    const classes = useStyle(defaultClasses, props.classes);

    return (
        <div className={classes.root}>
            <h3 className={classes.title}>
                <span>
                    <Shimmer width="100%" />
                </span>
            </h3>
            <TileListShimmer />
            <div className={classes.selection}>
                <Shimmer width="100%" />
            </div>
        </div>
    );
};

export default OptionShimmer;
