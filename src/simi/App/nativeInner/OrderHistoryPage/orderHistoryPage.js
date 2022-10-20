import React, { useMemo, useEffect, useState } from 'react';
import { useIntl, FormattedMessage } from 'react-intl';
import {
    Search as SearchIcon,
    AlertCircle as AlertCircleIcon,
    ArrowRight as SubmitIcon
} from 'react-feather';
import { shape, string } from 'prop-types';
import { useToasts } from '@magento/peregrine/lib/Toasts';
import OrderHistoryContextProvider from '@magento/peregrine/lib/talons/OrderHistoryPage/orderHistoryContext';
import { useOrderHistoryPage } from '../../../talons/OrderHistory/useOrderHistoryPage';
import LeftMenu from '../../core/LeftMenu';
import { useStyle } from '@magento/venia-ui/lib/classify';
import Icon from '@magento/venia-ui/lib/components/Icon';
import LoadingIndicator from '@magento/venia-ui/lib/components/LoadingIndicator';
import { StoreTitle } from '@magento/venia-ui/lib/components/Head';
import defaultClasses from './orderHistoryPage.module.css';
import OrderRow from './orderRow';
import OrderHistoryPageMb from './orderHistoryPageMb';
import { Redirect } from 'react-router-dom';
import { useUserContext } from '@magento/peregrine/lib/context/user';

const PAGE_SIZE = 10;
const errorIcon = (
    <Icon
        src={AlertCircleIcon}
        attrs={{
            width: 18
        }}
    />
);

const OrderHistoryPage = props => {
    const [currentPage, setCurrentPage] = useState(1);
    const talonProps = useOrderHistoryPage(currentPage);
    const {
        errorMessage,
        isBackgroundLoading,
        isLoadingWithoutData,
        orders,
        pageInfo,
        searchText
    } = talonProps;

    const [width, setWidth] = useState(window.innerWidth);
    const [{ isSignedIn }] = useUserContext();
    if(!isSignedIn){
       return <Redirect to={'/sign-in'} />
    }
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

    const [, { addToast }] = useToasts();
    const { formatMessage } = useIntl();
    const PAGE_TITLE = formatMessage({
        id: 'orderHistoryPage.pageTitleText',
        defaultMessage: 'Order History'
    });

    const classes = useStyle(defaultClasses, props.classes);

    const total = pageInfo && pageInfo.total ? pageInfo.total : 'hieu';
    const numberOfPages =
        total % PAGE_SIZE === 0
            ? total / PAGE_SIZE
            : parseInt(total / PAGE_SIZE) + 1;
            
    const listNumberOfPages = Array.from(
        { length: numberOfPages },
        (_, i) => i + 1
    );

    const Pagination = listNumberOfPages.map((item, index) => {
        return (
            <button
                key={index}
                onClick={() => setCurrentPage(item)}
                className={
                    index == currentPage - 1
                        ? classes.pageNumberBtnActive
                        : classes.pageNumberBtn
                }
            >
                {item}
            </button>
        );
    });

    const orderRows = useMemo(() => {
        return orders.map(order => {
            return <OrderRow key={order.id} order={order} />;
            // return <OrderRowCustom key ={order.id} order={order}/>
        });
    }, [orders]);

    const pageContents = useMemo(() => {
        if (isLoadingWithoutData) {
            return <LoadingIndicator />;
        } else if (!isBackgroundLoading && searchText && !orders.length) {
            return (
                <h3 className={classes.emptyHistoryMessage}>
                    <FormattedMessage
                        id={'orderHistoryPage.invalidOrderNumber'}
                        defaultMessage={`Order "${searchText}" was not found.`}
                        values={{
                            number: searchText
                        }}
                    />
                </h3>
            );
        } else if (!isBackgroundLoading && !orders.length) {
            return (
                <h3 className={classes.emptyHistoryMessage}>
                    <FormattedMessage
                        id={'orderHistoryPage.emptyDataMessage'}
                        defaultMessage={"You don't have any orders yet."}
                    />
                </h3>
            );
        } else {
            return (
                <ul className={classes.orderHistoryTable}>
                    <div className={classes.heading}>{PAGE_TITLE}</div>

                    {orderRows}
                </ul>
            );
        }
    }, [
        classes.emptyHistoryMessage,
        classes.orderHistoryTable,
        isBackgroundLoading,
        isLoadingWithoutData,
        orderRows,
        orders.length,
        searchText,
        PAGE_TITLE,
        classes.heading
    ]);

    useEffect(() => {
        if (errorMessage) {
            addToast({
                type: 'error',
                icon: errorIcon,
                message: errorMessage,
                dismissable: true,
                timeout: 10000
            });
        }
    }, [addToast, errorMessage]);

    if (width < 767) {
        return <OrderHistoryPageMb statusId={props.location && props.location.state ? props.location.state.id : null}  />;
    }
    return (
        <OrderHistoryContextProvider>
            <div className={`${classes.root} container`}>
                <StoreTitle>{PAGE_TITLE}</StoreTitle>
                {/* <h1 className={classes.heading}>{PAGE_TITLE}</h1> */}
                <div className={classes.filterRow} />
                {/* {pageContents} */}
                <div className={classes.wrapper}>
                    <LeftMenu label="Order History" />
                    <div className={classes.container}>{pageContents}</div>
                </div>
                {/* {loadMoreButton} */}
                <div className={classes.pagination}>{Pagination}</div>
            </div>
        </OrderHistoryContextProvider>
    );
};

export default OrderHistoryPage;

OrderHistoryPage.propTypes = {
    classes: shape({
        root: string,
        heading: string,
        emptyHistoryMessage: string,
        orderHistoryTable: string,
        search: string,
        searchButton: string,
        submitIcon: string,
        loadMoreButton: string
    })
};
