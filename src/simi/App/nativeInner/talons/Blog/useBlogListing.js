import React, { useEffect, useState } from 'react';
import { GET_BLOG_POSTS } from './Blog.gql';
import { useQuery } from '@apollo/client';
import { useToasts } from '@magento/peregrine';
import Icon from '@magento/venia-ui/lib/components/Icon';
import { AlertCircle as AlertCircleIcon } from 'react-feather';
import { usePagination } from '@magento/peregrine';

const errorIcon = <Icon src={AlertCircleIcon} attrs={{ width: 18 }} />;

export const useBlogListing = props => {
    const { filterType, filterValue } = props;
    const [pageSize, setPageSize] = useState(10);
    const [paginationValues, paginationApi] = usePagination();
    const { currentPage, totalPages } = paginationValues;
    const { setCurrentPage, setTotalPages } = paginationApi;

    const pageControl = {
        currentPage,
        setPage: setCurrentPage,
        totalPages
    };

    const variables = {
        action: filterType ? filterType : 'get_post_list',
        currentPage: parseInt(currentPage),
        pageSize: parseInt(pageSize)
    };
    switch (filterType) {
        case 'get_post_by_categoryId':
            variables.categoryId = parseInt(filterValue);
            break;
        case 'get_post_by_topic':
            variables.topicId = parseInt(filterValue);
            break;
        case 'get_post_by_authorName':
            variables.authorName = filterValue;
            break;
        case 'get_post_by_tagName':
            variables.tagName = filterValue;
            break;
        case 'get_post_by_date_time':
            variables.filter = {
                publish_date: {
                    like: `%${filterValue}%`
                }
            };
            variables.action = 'get_post_list';
            break;
        default:
            break;
    }
    const { data: blogData, loading: blogLoading, error: blogError } = useQuery(
        GET_BLOG_POSTS,
        {
            variables,
            fetchPolicy: 'no-cache'
        }
    );

    const [, { addToast }] = useToasts();

    // Set the total number of pages whenever the data changes.
    useEffect(() => {
        const totalPagesFromData =
            blogData && blogData.mpBlogPosts && blogData.mpBlogPosts.pageInfo
                ? blogData.mpBlogPosts.pageInfo.endPage
                : null;
        setTotalPages(totalPagesFromData);
        return () => {
            setTotalPages(null);
        };
    }, [blogData, setTotalPages]);

    if (blogError) {
        let derivedErrorMessage;
        const errorTarget = blogError;
        if (errorTarget.graphQLErrors) {
            derivedErrorMessage = errorTarget.graphQLErrors
                .map(({ message }) => message)
                .join(', ');
        } else {
            derivedErrorMessage = errorTarget.message;
        }
        if (derivedErrorMessage) {
            if (currentPage && currentPage > 1) {
                window.location.href = '/blog.html';
            } else {
                addToast({
                    type: 'error',
                    icon: errorIcon,
                    message: derivedErrorMessage,
                    dismissable: true,
                    timeout: 7000
                });
            }
        }
    }

    return {
        blogData,
        blogLoading,
        blogError,
        pageControl,
        pageSize,
        setPageSize
    };
};
