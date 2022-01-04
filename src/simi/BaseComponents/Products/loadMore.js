import React from 'react';
import PropTypes from 'prop-types';
import Loading from 'src/simi/BaseComponents/Loading/ReactLoading';
import { useIntl } from 'react-intl';

const LoadMore = props => {
    const { items, itemCount, currentPage, updateSetPage, loading } = props;
    const { formatMessage } = useIntl();
    if (itemCount < 1 || items.length >= itemCount) return null;

    const handleSetPage = num => {
        if (updateSetPage) {
            updateSetPage(num);
        }
    };

    return (
        <div
            className="load-more"
            role="presentation"
            onClick={() => handleSetPage(currentPage + 1)}
        >
            <div className="btn-load-more">
                {loading ? (
                    <Loading
                        divStyle={{ marginTop: '-25px' }}
                        loadingStyle={{ fill: 'white' }}
                    />
                ) : (
                    formatMessage({ id: 'Load More' })
                )}
            </div>
        </div>
    );
};

LoadMore.propTypes = {
    currentPage: PropTypes.number,
    limit: PropTypes.number,
    updateSetPage: PropTypes.func,
    itemCount: PropTypes.number,
    items: PropTypes.array
};
export default LoadMore;
