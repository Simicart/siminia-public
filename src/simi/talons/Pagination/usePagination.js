export const usePagination = props => {
    const {
        pageSize,
        currentPage,
        startPage,
        endPage,
        setStartPage,
        setEndPage,
        setPageAndLimit
    } = props;

    // hanle whent click on a special page number (difference current page)
    const changePage = (event, idScrollTo) => {
        setPageAndLimit(Number(event.target.id), pageSize);
        document
            .getElementById(idScrollTo)
            .scrollIntoView({ behavior: 'smooth' });
    };

    // handle when click button previous page or button next page
    const handleChangePage = (next = true, total, idScrollTo = 'root') => {
        const newCurrentPage = next
            ? currentPage === total
                ? currentPage
                : currentPage + 1
            : currentPage > 1
            ? currentPage - 1
            : currentPage;
        if (newCurrentPage > endPage) {
            setStartPage(startPage + 1);
            setEndPage(endPage + 1);
        } else if (newCurrentPage < startPage) {
            setStartPage(startPage - 1);
            setEndPage(endPage - 1);
        }
        setPageAndLimit(newCurrentPage, pageSize);
        document
            .getElementById(idScrollTo)
            .scrollIntoView({ behavior: 'smooth' });
    };

    // handle when click change page size ( number product items on 1 page)
    const changeLimit = event => {
        setStartPage(1);
        setEndPage(5);
        setPageAndLimit(1, Number(event.target.value));
    };

    return {
        changePage,
        handleChangePage,
        changeLimit
    };
};
