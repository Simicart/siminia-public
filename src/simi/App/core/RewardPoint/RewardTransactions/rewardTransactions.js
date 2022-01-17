import React, { useEffect, useState } from 'react';
import { useStyle } from '@magento/venia-ui/lib/classify';
import { useGetRewardPointData } from '../../../../talons/RewardPoint/useGetRewardPointData';
import LeftMenu from '../../LeftMenu';
import defaultClasses from './rewardTransaction.module.css';
import { FormattedMessage } from 'react-intl';
import LoadingIndicator from '@magento/venia-ui/lib/components/LoadingIndicator';
import moment from 'moment';

const RewardTransaction = props => {
    const classes = useStyle(defaultClasses);
    const talonProps = useGetRewardPointData();
    const { customerTransactions, isLoadingWithoutData } = talonProps;
    const [width, setWidth] = useState(window.innerWidth);

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

    if (isLoadingWithoutData) {
        return <LoadingIndicator />;
    }
    const transactionRow =
        customerTransactions && customerTransactions.items
            ? customerTransactions.items.map(transaction => {
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
    return (
        <div className={`${classes.root} container`}>
            <div className={classes.wrapper}>
                <LeftMenu label="Reward Transactions" />
                <div className={classes.wrapperContainer}>
                    <div className={classes.transactionTitle}>
                        <FormattedMessage
                            id={'rewardPoint.transactionTitle'}
                            defaultMessage={'Reward Transactions'}
                        />
                    </div>
                    {customerTransactions ? (
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
                    ) : null}
                </div>
            </div>
        </div>
    );
};

export default RewardTransaction;