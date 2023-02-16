import React from 'react';
import { useRewardPoint } from '../../talons/useRewardPoint';
import { useStyle } from '@magento/venia-ui/lib/classify';
import { FormattedMessage } from 'react-intl';
import { Price } from '@magento/peregrine';
import { Link, Redirect } from 'react-router-dom';
import Page404 from 'src/simi/App/nativeInner/NoMatch/Page404';
import defaultClasses from './rewardPoints.module.css';
import LeftMenu from 'src/simi/App/core/LeftMenu/leftMenu';
import Notification from './notification';
import Transaction from './transaction';
import LoadingIndicator from '@magento/venia-ui/lib/components/LoadingIndicator';

const RewardPoint = props => {
    const talonProps = useRewardPoint();

    const classes = useStyle(defaultClasses, props.classes);

    const {
        isActive,
        isSignedIn,
        loading,
        point,
        pointUsed,
        pointEarned,
        rate,
        baseCurrencyCode
    } = talonProps;

    if (!isActive) return <Page404 />;

    if (!isSignedIn) return <Redirect to="/sign-in" />;

    if(loading) {
        return <LoadingIndicator />
    }

    return (
        <div className={classes.root}>
            <div className="container">
                <div className={classes.wrapper}>
                    <LeftMenu label="Reward Points" />
                    <div className={classes.leftContent}>
                        <div className={classes.title}>
                            <FormattedMessage
                                id={'My Points and Reward'}
                                defaultMessage={'My Points and Reward'}
                            />
                        </div>
                        <div className={classes.block}>
                            <div className={classes.blockTitle}>
                                <FormattedMessage
                                    id={'Balance infomation'}
                                    defaultMessage={'Balance infomation'}
                                />
                            </div>
                            <div className={classes.blockContent}>
                                <p className={classes.rwPoint}>
                                    <span>
                                        <FormattedMessage
                                            id={'Points balance'}
                                        />
                                        :
                                    </span>
                                    <span className={classes.panelPoint}>
                                        {point}
                                    </span>
                                </p>
                                <p className={classes.rwPoint}>
                                    <span>
                                        <FormattedMessage id={'Total earned'} />
                                        :
                                    </span>
                                    <span className={classes.panelPoint}>
                                        {pointEarned}
                                    </span>
                                </p>
                                <p className={classes.rwPoint}>
                                    <span>
                                        <FormattedMessage id={'Total spent'} />:
                                    </span>
                                    <span className={classes.panelPoint}>
                                        {pointUsed}
                                    </span>
                                </p>
                            </div>
                        </div>
                        <div className={classes.block}>
                            <div className={classes.blockTitle}>
                                <FormattedMessage
                                    id={'Exchange Rate'}
                                    defaultMessage={'Exchange Rate'}
                                />
                            </div>
                            <div className={classes.blockContent}>
                                <p className={classes.rwPoint}>
                                    <span>
                                        <FormattedMessage
                                            id={
                                                '{rate} point(s) can be redeemed for'
                                            }
                                            defaultMessage={
                                                '{rate} point(s) can be redeemed for'
                                            }
                                            values={{ rate }}
                                        />
                                    </span>
                                    <span className={classes.panelPoint}>
                                        <Price
                                            value={1}
                                            currencyCode={baseCurrencyCode}
                                        />
                                    </span>
                                </p>
                            </div>
                        </div>
                        <div className={classes.block}>
                            <div className={classes.blockTitleTransactions}>
                                <span>
                                    <FormattedMessage
                                        id={'Transactions'}
                                        defaultMessage={'Transactions'}
                                    />
                                </span>
                                <Link to="/reward-transactions">
                                    <FormattedMessage
                                        id={'View All'}
                                        defaultMessage={'View All'}
                                    />  
                                </Link>
                            </div>
                            <div className={classes.blockContent}>
                                <Transaction noTitle={true} />
                            </div>
                        </div>
                        <div className={classes.block}>
                            <div className={classes.blockTitle}>
                                <FormattedMessage
                                    id={'Notification'}
                                    defaultMessage={'Notification'}
                                />
                            </div>
                            <div className={classes.blockContent}>
                                <Notification />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RewardPoint;
