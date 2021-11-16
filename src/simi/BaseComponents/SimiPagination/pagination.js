import React from 'react';
import { usePagination } from 'src/simi/talons/Pagination/usePagination';
import Identify from 'src/simi/Helper/Identify';
import BackIcon from 'src/simi/BaseComponents/Icon/TapitaIcons/Back';
import NextIcon from 'src/simi/BaseComponents/Icon/TapitaIcons/Next';

const SimiPagination = props => {
    const {
        data,
        itemCount,
        pageSize,
        pageControl,
        showPageNumber,
        showInfoItem,
        itemsPerPageOptions
    } = props;
    const {
        startPage,
        endPage,
        setStartPage,
        setEndPage,
        currentPage,
        setPageAndLimit,
        totalPages
    } = pageControl;

    const talonProps = usePagination({
        pageSize: pageSize,
        currentPage: currentPage,
        startPage: startPage,
        endPage: endPage,
        setStartPage: setStartPage,
        setEndPage: setEndPage,
        setPageAndLimit: setPageAndLimit
    });

    const { changePage, handleChangePage, changeLimit } = talonProps;

    const renderPageNumber = total => {
        // total: is sum of all products return by api
        const isRtl = Identify.isRtl();
        // Logic for displaying page numbers
        if (!showPageNumber) return null;
        const pageNumbers = [];
        const totalItem = total;
        total = Math.ceil(total / pageSize);
        // total : is number pages available
        const endpage = endPage > total ? total : endPage;
        for (let i = startPage; i <= endpage; i++) {
            pageNumbers.push(i);
        }
        const renderPageNumbers = pageNumbers.map(number => {
            let active =
                number === currentPage
                    ? {
                        borderRadius: '15px',
                        background: '#eaeaea',
                        fontWeight: 600
                    }
                    : {};
            active = {
                ...active,
                ...{
                    fontWeight: 500,
                    display: 'inline-block',
                    width: '30px',
                    height: '30px',
                    textAlign: 'center',
                    paddingTop: 5,
                    cursor: 'pointer'
                }
            };
            return (
                <li
                    role="presentation"
                    key={number}
                    id={number}
                    onClick={e => changePage(e, 'root-product-list')}
                    style={active}
                    className={`pagination-page-number-item ${(number === currentPage) ? 'active' : ''}`}
                >
                    {number}
                </li>
            );
        });
        const option_limit = [];
        if (itemsPerPageOptions) {
            itemsPerPageOptions.map(item => {
                option_limit.push(
                    <option key={Identify.randomString(5)} value={item}>
                        {item}
                    </option>
                );
                return null;
            });
        }
        let nextPageIcon = null;
        let prevPageIcon = null;
        if (currentPage < total) {
            nextPageIcon = isRtl ? (
                <BackIcon style={{ width: 6 }} />
            ) : (
                    <NextIcon style={{ width: 6 }} />
                );
        }
        if (currentPage > 1) {
            prevPageIcon = isRtl ? (
                <NextIcon style={{ width: 6 }} />
            ) : (
                    <BackIcon style={{ width: 6 }} />
                );
        }
        const pagesSelection =
            total > 1 ? (
                <ul
                    id="page-numbers"
                    className="page-numbers"
                    style={{
                        border: 'none',
                        padding: 0,
                        display: 'flex',
                        alignItems: 'center',
                        fontSize: 14
                    }}
                >
                    <li
                        role="presentation"
                        className="icon-page-number"
                        style={{
                            padding: '6px 6px 0 6px',
                            cursor: 'pointer',
                            paddingTop: '2px'
                        }}
                        onClick={() =>
                            currentPage === 1
                                ? {}
                                : handleChangePage(false, total)
                        }
                    >
                        {prevPageIcon}
                    </li>
                    {renderPageNumbers}
                    <li
                        role="presentation"
                        className="icon-page-number"
                        style={{
                            padding: '6px 6px 0 6px',
                            cursor: 'pointer',
                            paddingTop: '2px'
                        }}
                        onClick={() =>
                            currentPage === total
                                ? {}
                                : handleChangePage(true, total)
                        }
                    >
                        {nextPageIcon}
                    </li>
                </ul>
            ) : (
                    ''
                );

        let lastItem = currentPage * pageSize;
        const firstItem = lastItem - pageSize + 1;
        lastItem = lastItem > totalItem ? totalItem : lastItem;
        const itemsPerPage = (
            <div
                className="items-per-page"
                style={isRtl ? { marginRight: 'auto' } : { marginLeft: 'auto' }}
            >
                {showInfoItem && (
                    <span className="item-from-to" style={{ marginRight: 10, fontSize: 16 }}>
                        {Identify.__('Items %a - %b of %c')
                            .replace('%a', firstItem)
                            .replace('%b', lastItem)
                            .replace('%c', totalItem)}
                    </span>
                )}
                {(option_limit.length) ? (
                    <React.Fragment>
                        <span style={{ fontWeight: 600, fontSize: 16 }}>
                            {Identify.__('Show')}
                        </span>
                        <span
                            className="items-per-page-select"
                            style={{
                                margin: '0 5px',
                                background: 'none'
                            }}
                        >
                            <select
                                value={pageSize}
                                id="limit"
                                onBlur={() => { }}
                                onChange={e => changeLimit(e)}
                                style={{
                                    border: 'none',
                                    borderRadius: '0',
                                    borderBottom: 'solid #2d2d2d 1px',
                                    fontSize: 14
                                }}
                            >
                                {option_limit}
                            </select>
                        </span>
                        <span style={{ fontWeight: 400, fontSize: 16 }}>
                            {Identify.__('per page')}
                        </span>
                    </React.Fragment>) :
                ''}
            </div>
        );

        return (
            <div
                className="config-page"
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                }}
            >
                {pagesSelection}
                {itemsPerPage}
            </div>
        );
    };

    const renderPagination = () => {
        if (itemCount > 0) {
            return (
                <div className="list-items">{renderPageNumber(itemCount)}</div>
            );
        }
        return <div />;
    };

    return renderPagination();
};

export default SimiPagination;
