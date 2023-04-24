import React from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { Link } from 'react-router-dom';
import {
    useTransaction,
    useTransactionPagination
} from '../../talons/useTransaction';
import { formatDate } from '../../utils';
import { useStyle } from '@magento/venia-ui/lib/classify';
import { useParams, Redirect } from 'react-router-dom';
import defaultClasses from './transaction.module.css';
import LeftMenu from 'src/simi/App/core/LeftMenu/leftMenu';
import Pagination from '@magento/venia-ui/lib/components/Pagination';
import LoadingIndicator from '@magento/venia-ui/lib/components/LoadingIndicator';
import Page404 from 'src/simi/App/nativeInner/NoMatch/Page404';

const Transaction = props => {
    const { isTransactionsPage } = props;

    const params = useParams();
    const { formatMessage } = useIntl();
    const classes = useStyle(defaultClasses, props.classes);

    const isDetail = !!params?.transactionId || false;

    const talonProps =
        !isTransactionsPage || isDetail
            ? useTransaction({ isDetail })
            : useTransactionPagination({ isDetail });

    const {
        items,
        detailData,
        pageControl,
        setPageSize,
        pageSize,
        handleSetPageSize,
        isActive,
        isSignedIn,
        loading
    } = talonProps;

    if ((isTransactionsPage || isDetail) && !isActive) return <Page404 />;

    if ((isTransactionsPage || isDetail) && !isSignedIn) return <Redirect to="/sign-in" />;

    if (loading) return <LoadingIndicator />;

    const thead = (
        <thead>
            <tr>
                <th>
                    <FormattedMessage id="Point" defaultMessage="Point" />
                </th>
                {!isTransactionsPage && (
                    <th>
                        <FormattedMessage
                            id="Balance"
                            defaultMessage="Balance"
                        />
                    </th>
                )}
                <th>
                    <FormattedMessage id="Note" defaultMessage="Note" />
                </th>
                <th>
                    <FormattedMessage
                        id="Created by"
                        defaultMessage="Created by"
                    />
                </th>
                <th>
                    <FormattedMessage
                        id="Transaction type"
                        defaultMessage="Transaction type"
                    />
                </th>
                <th>
                    <FormattedMessage
                        id="Transaction date"
                        defaultMessage="Transaction date"
                    />
                </th>
                {!isTransactionsPage && (
                    <th>
                        <FormattedMessage
                            id="Expiry date"
                            defaultMessage="Expiry date"
                        />
                    </th>
                )}
                <th>
                    <FormattedMessage id="Action" defaultMessage="Action" />
                </th>
            </tr>
        </thead>
    );

    const tbody = items.map((item, index) => {
        const location = {
            pathname: `/reward-transactions/${item.transaction_id}`,
            state: {
                detail: item
            }
        };
        return (
            <tr key={index}>
                <td
                    data-th={formatMessage({
                        id: 'Point',
                        description: 'Point'
                    })}
                >
                    {item.point}
                </td>
                {!isTransactionsPage && (
                    <td
                        data-th={formatMessage({
                            id: 'Balance',
                            description: 'Balance'
                        })}
                    >
                        {item.balance}
                    </td>
                )}
                <td
                    data-th={formatMessage({ id: 'Note', description: 'Note' })}
                >
                    {item.note}
                </td>
                <td
                    data-th={formatMessage({
                        id: 'Created by',
                        description: 'Created by'
                    })}
                >
                    {item.created_by}
                </td>
                <td
                    data-th={formatMessage({
                        id: 'Transaction type',
                        description: 'Transaction type'
                    })}
                >
                    {item.action}
                </td>
                <td
                    data-th={formatMessage({
                        id: 'Transaction date',
                        description: 'Transaction date'
                    })}
                >
                    {formatDate(item.created_at)}
                </td>
                {!isTransactionsPage && (
                    <td
                        data-th={formatMessage({
                            id: 'Expiry date',
                            description: 'Expiry date'
                        })}
                    >
                        {formatDate(item.expires_at)}
                    </td>
                )}
                <td
                    data-th={formatMessage({
                        id: 'Actions',
                        description: 'Actions'
                    })}
                >
                    <Link to={location} className={classes.view}>
                        <FormattedMessage id="View" defaultMessage="View" />
                    </Link>
                </td>
            </tr>
        );
    });

    const table = (
        <table className={classes.table}>
            {thead}
            <tbody>{tbody}</tbody>
        </table>
    );

    if (!isTransactionsPage) {
        return table;
    }

    let content = table;
    let pagination = null;
    if (isDetail) {
        content = (
            <div className={classes.detail}>
                <p className={classes.rwPoint}>
                    <span>
                        <FormattedMessage
                            id={'Point:'}
                            defaultMessage={'Point:'}
                        />
                    </span>
                    <span className={classes.panelPoint}>
                        {detailData.point}
                    </span>
                </p>
                <p className={classes.rwPoint}>
                    <span>
                        <FormattedMessage
                            id={'Note:'}
                            defaultMessage={'Note:'}
                        />
                    </span>
                    <span className={classes.panelPoint}>
                        {detailData.note}
                    </span>
                </p>
                <p className={classes.rwPoint}>
                    <span>
                        <FormattedMessage
                            id={'Created by:'}
                            defaultMessage={'Created by:'}
                        />
                    </span>
                    <span className={classes.panelPoint}>
                        {detailData.created_by}
                    </span>
                </p>
                <p className={classes.rwPoint}>
                    <span>
                        <FormattedMessage
                            id={'Transaction type:'}
                            defaultMessage={'Transaction type:'}
                        />
                    </span>
                    <span className={classes.panelPoint}>
                        {detailData.action}
                    </span>
                </p>
                <p className={classes.rwPoint}>
                    <span>
                        <FormattedMessage
                            id={'Transaction date:'}
                            defaultMessage={'Transaction date:'}
                        />
                    </span>
                    <span className={classes.panelPoint}>
                        {detailData.created_at}
                    </span>
                </p>
            </div>
        );
    } else {
        pagination = (
            <React.Fragment>
                <div className={classes.pagination}>
                    <Pagination pageControl={pageControl} />
                </div>
                <div className={classes.pageSize}>
                    {`Show `}
                    <span className={classes.pageSizeInput}>
                        <select onChange={handleSetPageSize} value={pageSize}>
                            <option value="5">5</option>
                            <option value="10">10</option>
                            <option value="20">20</option>
                        </select>
                    </span>
                    {formatMessage({
                        id: 'perPage',
                        defaultMessage: ' per page'
                    })}
                </div>
            </React.Fragment>
        );
    }

    return (
        <div className={classes.root}>
            <div className="container">
                <div className={classes.wrapper}>
                    <LeftMenu label="Reward Points" />
                    <div className={classes.leftContent}>
                        <div className={classes.title}>
                            <FormattedMessage
                                id={'Transactions'}
                                defaultMessage={'Transactions'}
                            />
                        </div>
                        {content}
                        {pagination}
                    </div>
                </div>
            </div>
        </div>
    );
};

Transaction.defaultProps = {
    isTransactionsPage: true
};

export default Transaction;
