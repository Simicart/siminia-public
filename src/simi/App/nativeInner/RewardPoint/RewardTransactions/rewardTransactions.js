import React, { useEffect, useState } from 'react';
import { useStyle } from '@magento/venia-ui/lib/classify';
import { useGetRewardPointData } from '../../../../talons/RewardPoint/useGetRewardPointData';
import LeftMenu from '../../../core/LeftMenu';
import defaultClasses from './rewardTransaction.module.css';
import { FormattedMessage, useIntl } from 'react-intl';
import LoadingIndicator from '@magento/venia-ui/lib/components/LoadingIndicator';
import moment from 'moment';
import { useWindowSize } from '@magento/peregrine';
import Identify from 'src/simi/Helper/Identify'
import Loader from '../../Loader';

const RewardTransaction = props => {
    const { formatMessage } = useIntl();

    const classes = useStyle(defaultClasses);
    const talonProps = useGetRewardPointData();
    const { customerTransactions, isLoadingWithoutData } = talonProps;
    const [width, setWidth] = useState(window.innerWidth);
    const windowSize = useWindowSize();
    const isMobileSite = windowSize.innerWidth <= 768;
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
        return <Loader />;
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
                      rewardStatus = (
                          <>
                              {formatMessage({
                                  id: 'Pending',
                                  defaultMessage: 'Pending'
                              })}
                          </>
                      );
                  } else if (transaction.status == 2) {
                      rewardStatus = (
                          <>
                              {formatMessage({
                                  id: 'Completed',
                                  defaultMessage: 'Completed'
                              })}
                          </>
                      );
                  } else
                      rewardStatus = (
                          <>
                              {formatMessage({
                                  id: 'Expired',
                                  defaultMessage: 'Expired'
                              })}
                          </>
                      );

                  if (expireDateFormat == 'Invalid date') {
                      expireDateString = 'N/A';
                  } else expireDateString = expireDateFormat;
                  return (
                      <tr>
                          <td className={Identify.isRtl() ? classes.tdRTL : ''}>{transaction_id}</td>
                          <td className={Identify.isRtl() ? classes.tdRTL : ''}>{dateFormat}</td>
                          <td className={Identify.isRtl() ? classes.tdRTL : ''}>{comment}</td>
                          <td className={Identify.isRtl() ? classes.tdRTL : ''}>{point_amount}</td>
                          <td className={Identify.isRtl() ? classes.tdRTL : ''}>{rewardStatus}</td>
                          <td className={Identify.isRtl() ? classes.tdRTL : ''}>{expireDateString}</td>
                      </tr>
                  );
              })
            : null;
    return (
        <div className={`${classes.root} ${!isMobileSite ? 'container' : ''}`}>
            <div className={classes.wrapper}>
                <LeftMenu label="Reward Transactions" />
                <div className={classes.wrapperContainer}>
                    <div className={classes.transactionTitle}>
                        <FormattedMessage
                            id={'Reward Transactions'}
                            defaultMessage={'Reward Transactions'}
                        />
                    </div>
                    {customerTransactions ? (
                        <table>
                            <thead>
                                <tr />
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
