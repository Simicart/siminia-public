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
import AlertMessages from '../../ProductFullDetail/AlertMessages';
import Loader from '../../Loader';

const RewardPointDataPage = props => {
    const { formatMessage } = useIntl();
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
    const [, { addToast }] = useToasts();

    const [alertMsg, setAlertMsg] = useState(-1);

    const handleViewAll = () => {
        history.push('/reward-transactions');
    };
    const handleSave = () => {
        mpRewardPoints({
            variables: { isUpdate, isExpire }
        });
        {
            isMobileSite
                ? setAlertMsg(true)
                : addToast({
                      type: 'info',
                      message: formatMessage({
                          id: 'Thanks For Your Subscribe'
                      }),
                      timeout: 3000
                  });
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
            id={'My Points and Reward'}
            defaultMessage={'My Points and Reward'}
        />
    );
    if (isLoadingWithoutData) {
        return <Loader />;
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
                      rewardStatus =
                      <>
                      {formatMessage({
                          id: 'Pending',
                          defaultMessage: 'Pending'
                      })}
                  </>
                  } else if (transaction.status == 2) {
                      rewardStatus = (
                          <>
                              {formatMessage({
                                  id: 'Completed',
                                  defaultMessage: 'Completed'
                              })}
                          </>
                      );
                  } else rewardStatus = <>
                  {formatMessage({
                      id: 'Expired',
                      defaultMessage: 'Expired'
                  })}
              </>;

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
                <div className={classes.point1}>
                    {point_balance}
                    {formatMessage({
                        id: 'points',
                        defaultMessage: 'points'
                    })}
                </div>
                <span>
                    {formatMessage({
                        id: 'Available Balance',
                        defaultMessage: 'Available Balance'
                    })}
                </span>
            </div>
            <div className={classes.block2}>
                <div className={classes.point2}>
                    {point_earned}{' '}
                    {formatMessage({
                        id: 'points',
                        defaultMessage: 'points'
                    })}
                </div>
                <span>
                    {formatMessage({
                        id: 'Total Earned Points',
                        defaultMessage: 'Total Earned Points'
                    })}
                </span>
            </div>
            <div className={classes.block3}>
                <div className={classes.point3}>
                    {point_spent}{' '}
                    {formatMessage({
                        id: 'points',
                        defaultMessage: 'points'
                    })}
                </div>
                <span>
                    {formatMessage({
                        id: 'Total Spent Points',
                        defaultMessage: 'Total Spent Points'
                    })}
                </span>
            </div>
        </div>
    );
    const rewardTransactionContent = (
        <div className={classes.rewardPointTransaction}>
            <div className={classes.rewardTitle}>
                <FormattedMessage
                    id={'Recent Transaction'}
                    defaultMessage={'Recent Transaction'}
                />{' '}
                <LinkButton
                    onClick={handleViewAll}
                    className={classes.linkButton}
                >
                    {formatMessage({
                        id: 'View all',
                        defaultMessage: 'View All'
                    })}
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
            <AlertMessages
                message={formatMessage({
                    id: 'Your preferences have been updated.',
                    defaultMessage: 'Your preferences have been updated.'
                })}
                setAlertMsg={setAlertMsg}
                alertMsg={alertMsg}
                status="success"
            />
            <div className={classes.wrapper}>
                <LeftMenu label="Reward Points" />
                <div className={classes.wrapperContainer}>
                    <div className={classes.rewardPageTitle}>{PAGE_TITLE}</div>
                    {rewardPointDataContent}
                    {rewardTransactionContent}
                    <div className={classes.rewardNotification}>
                        <div className={classes.emailTitle}>
                            {formatMessage({
                                id: 'Email Notification',
                                defaultMessage: ' Email Notification'
                            })}
                        </div>
                        <Form className={classes.form} onSubmit={handleSave}>
                            <Checkbox
                                field="update"
                                label={formatMessage({
                                    id: 'Subcribe to balance update',
                                    defaultMessage: 'Subcribe to balance update'
                                })}
                                onClick={() => {
                                    isUpdate = !isUpdate;
                                }}
                            />
                            <Checkbox
                                field="experationNotification"
                                label={formatMessage({
                                    id:
                                        'Subcribe to points experation notification',
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
                                        id: 'Save',
                                        defaultMessage: 'Save'
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
