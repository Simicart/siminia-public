import React from 'react';
import Navigation from '@magento/venia-ui/lib/components/Navigation/navigation';
import { useWindowSize } from '@magento/peregrine';
import { connect } from 'src/drivers';
import defaultClasses from './navigation.module.css';
import { useStyle } from '@magento/venia-ui/lib/classify';
import Identify from 'src/simi/Helper/Identify';
import { useNavigation } from '../../../talons/Navigation/useNavigation';

const HONavigation = props => {
    //use this hook to force-fetch user data on reload logged in
    const { storeConfig } = props;
    const talonProps = useNavigation({ storeConfig });
    const windowSize = useWindowSize();
    const isPhone = windowSize.innerWidth < 1024;
    const classes = useStyle(defaultClasses, props.classes);
    classes.root = Identify.isRtl() ? classes.root_rtl : classes.root;
    classes.root_open = Identify.isRtl()
        ? classes.root_open_rtl
        : classes.root_open;

    return isPhone && storeConfig && storeConfig.storeConfig ? (
        <Navigation {...props} classes={classes} />
    ) : (
        ''
    );
};

const mapStateToProps = ({ simireducers }) => {
    const { storeConfig } = simireducers;
    return {
        storeConfig
    };
};

export default connect(mapStateToProps)(HONavigation);
