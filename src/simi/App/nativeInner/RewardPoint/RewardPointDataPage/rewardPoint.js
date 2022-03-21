import React, { useEffect, useState } from 'react';
import { mergeClasses, useStyle } from '@magento/venia-ui/lib/classify';
import { shape, string } from 'prop-types';
import defaultClasses from './rewardPoint.module.css';
import { FormattedMessage, useIntl } from 'react-intl';
import LinkButton from '@magento/venia-ui/lib/components/LinkButton';
import Button from '@magento/venia-ui/lib/components/Button';
import moment from 'moment';
import { useHistory } from 'react-router-dom';
import { useGetRewardPointData } from '../../../../talons/RewardPoint/useGetRewardPointData';
import LeftMenu from '../../../core/LeftMenu';
import LoadingIndicator from '@magento/venia-ui/lib/components/LoadingIndicator';
import Checkbox from '../../../../BaseComponents/Checkbox';

const RewardPointDataPage = props => {
    const classes = useStyle(defaultClasses);
    const talonProps = useGetRewardPointData();
    const {
        isLoadingWithoutData,
        customerRewardPoint,
        mpRewardPoints
    } = talonProps;
    let history = useHistory();
    const handleViewAll = () => {
        history.push('/reward-transactions');
    };
    const handleSave = () => {
        mpRewardPoints({
            variables: { isUpdate, isExpire }
        });
    };
    const [width, setWidth] = useState(window.innerWidth);
    const isMobileSite = window.innerWidth <= 768;

    useEffect(() => {
        const handleSize = () => {
            setWidth(window.innerWidth);
        };
        window.addEventListener('resize', handleSize);
        //clean
        return () => {
            window.removeEventListener('resize', handleSize);
        };
    }, []);
    if (!customerRewardPoint) return '';
    const {
        point_balance,
        point_earned,
        point_spent,
        notification_update,
        notification_expire,
        transactions
    } = customerRewardPoint;
    const PAGE_TITLE = (
        <FormattedMessage
            id={'rewardPoint.myPointReward'}
            defaultMessage={'My Points and Reward'}
        />
    );
    if (isLoadingWithoutData) {
        return <LoadingIndicator />;
    }
    const isUpdate = notification_update == 1 ? true : false;
    const isExpire = notification_expire == 1 ? true : false;

    const transactionRow =
        transactions && transactions.items
            ? transactions.items.map(transaction => {
                  const {
                      created_at,
                      expiration_date,
                      status,
                      transaction_id,
                      comment,
                      point_amount
                  } = transaction;
                  const dateFormat = moment(created_at).format('YYYY/MM/DD');

                  const expireDateFormat = moment(expiration_date).format(
                      'YYYY/MM/DD'
                  );

                  let rewardStatus, expireDateString;
                  if (status == 1) {
                      rewardStatus = 'Pending';
                  } else if (transaction.status == 2) {
                      rewardStatus = 'Completed';
                  } else rewardStatus = 'Expired';

                  if (expireDateFormat == 'Invalid date') {
                      expireDateString = 'N/A';
                  } else expireDateString = expireDateFormat;
                  return (
                      <tr>
                          <th>{transaction_id}</th>
                          <th>{dateFormat}</th>
                          <th>{comment}</th>
                          <th>{point_amount}</th>
                          <th>{rewardStatus}</th>
                          <th>{expireDateString}</th>
                      </tr>
                  );
              })
            : null;
    const rewardPointDataContent = (
        <div className={classes.rewardPointData}>
            <div className={classes.block1}>
                <div className={classes.point1}>{point_balance} points</div>
                <span>Available Balance</span>
            </div>
            <div className={classes.block2}>
                <div className={classes.point2}>{point_earned} points</div>
                <span>Total Earned Points</span>
            </div>
            <div className={classes.block3}>
                <div className={classes.point3}>{point_spent} points</div>
                <span>Total Spent Points</span>
            </div>
        </div>
    );
    const rewardTransactionContent = (
        <div className={classes.rewardPointTransaction}>
            <div className={classes.rewardTitle}>
                <FormattedMessage
                    id={'rewardPoint.recentTransaction'}
                    defaultMessage={'Recent Transaction'}
                />{' '}
                <LinkButton
                    onClick={handleViewAll}
                    className={classes.linkButton}
                >
                    View All
                </LinkButton>
            </div>
            {transactions ? (
                <div>
                    <table>
                        <thead>
                            <tr>
                                <th>Transaction</th>
                                <th>Date</th>
                                <th>Comment</th>
                                <th>Amount</th>
                                <th>Status</th>
                                <th>Expire Date</th>
                            </tr>
                        </thead>
                        <tbody>{transactionRow}</tbody>
                    </table>
                </div>
            ) : null}
        </div>
    );
    return (
        <div className={`${classes.root} ${!isMobileSite ? 'container' : ''} `}>
            <div className={classes.wrapper}>
                <LeftMenu label="Reward Points" />
                <div className={classes.wrapperContainer}>
                    <div className={classes.rewardPageTitle}>{PAGE_TITLE}</div>
                    {rewardPointDataContent}
                    {rewardTransactionContent}
                    <div className={classes.rewardNotification}>
                        <div className={classes.rewardTitle}>
                            Email Notification
                        </div>
                        <Checkbox
                            label="Subcribe to balance update"
                            onClick={() => {
                                isUpdate = !isUpdate;
                            }}
                        />
                        <Checkbox
                            label="Subcribe to points experation notification"
                            onClick={() => {
                                isExpire = !isExpire;
                            }}
                        />
                        <Button priority="high" onClick={handleSave}>
                            <FormattedMessage
                                id={'rewardPoint.saveButton'}
                                defaultMessage={'Save'}
                            />
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
};
RewardPointDataPage.propTypes = {
    classes: shape({ root: string })
};

RewardPointDataPage.defaultProps = {};

export default RewardPointDataPage;