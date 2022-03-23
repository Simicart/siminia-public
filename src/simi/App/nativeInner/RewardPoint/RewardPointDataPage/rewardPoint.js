import React, { useCallback, useEffect, useState } from 'react';
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
// import Checkbox from '../../../../BaseComponents/Checkbox';
import { useToasts, useWindowSize } from '@magento/peregrine';
import { Form } from 'informed';
import Field from '@magento/venia-ui/lib/components/Field';
import Checkbox from '@magento/venia-ui/lib/components/Checkbox';

const RewardPointDataPage = props => {
    const { formatMessage } = useIntl();
    
    const [, { addToast }] = useToasts();

    const afterSubmit = useCallback(() => {
        addToast({
            type: 'info',
            message: formatMessage({
                id: 'rewardPoint.preferencesText',
                defaultMessage: 'Your preferences have been updated.'
            }),
            timeout: 5000
        });
    }, [addToast, formatMessage]);

    const classes = useStyle(defaultClasses);
    const talonProps = useGetRewardPointData();
    const {
        isLoadingWithoutData,
        customerRewardPoint,
        mpRewardPoints
    } = talonProps;
    let history = useHistory();
    const windowSize = useWindowSize();
    const isMobileSite = windowSize.innerWidth <= 768;
    
    const handleViewAll = () => {
        history.push('/reward-transactions');
    };
    const handleSave = () => {
        mpRewardPoints({
            variables: { isUpdate, isExpire }
        });
        if (afterSubmit) {
            afterSubmit();
        }
    };
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
    let isUpdate = notification_update == 1 ? true : false;
    let isExpire = notification_expire == 1 ? true : false;

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
                      <tr className={classes.title}>
                          <td>{transaction_id}</td>
                          <td>{dateFormat}</td>
                          <td>{comment}</td>
                          <td>{point_amount}</td>
                          <td>{rewardStatus}</td>
                          <td>{expireDateString}</td>
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
                            <tr />
                        </thead>
                        <tbody>{transactionRow}</tbody>
                    </table>
                </div>
            ) : null}
        </div>
    );
    return (
        <div className={`${classes.root} ${!isMobileSite ? 'container' : ''}`}>
            <div className={classes.wrapper}>
                <LeftMenu label="Reward Points" />
                <div className={classes.wrapperContainer}>
                    <div className={classes.rewardPageTitle}>{PAGE_TITLE}</div>
                    {rewardPointDataContent}
                    {rewardTransactionContent}
                    <div className={classes.rewardNotification}>
                        <div className={classes.emailTitle}>
                            {formatMessage({
                                        id :'rewardPoint. emailNotification',
                                        defaultMessage :' Email Notification'
                                    })}
                        </div>
                        <Form className={classes.form} onSubmit={handleSave}>
                            <Checkbox
                                field="update"
                                label={formatMessage({
                                    id: 'rewardPoint.update',
                                    defaultMessage: 'Subcribe to balance update'
                                })}
                                onClick={() => {
                                    isUpdate = !isUpdate;
                                }}
                            />
                            <Checkbox
                                field="experationNotification"
                                label={formatMessage({
                                    id: 'rewardPoint.experationNotification"',
                                    defaultMessage:
                                        'Subcribe to points experation notification'
                                })}
                                onClick={() => {
                                    isExpire = !isExpire;
                                }}
                            />
                            <div className={classes.buttonsContainer}>
                                <Button type="submit" priority="high">
                                    {formatMessage({
                                        id :'rewardPoint.saveButton',
                                        defaultMessage :'Save'
                                    })}
                                </Button>
                            </div>
                        </Form>
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
