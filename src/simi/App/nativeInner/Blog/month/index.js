import React, { useEffect } from 'react';
import BreadCrumb from '../breadcrumb/index';
import classes from '../home/home.module.css';
import BlogListing from '../blogListing/index';
import SearchBlog from '../searchBlog';
import CateTree from '../cateTree';
import TagList from '../tagList';
import TopicList from '../topicList';
import SidebarPosts from '../sidebarPosts';
import SimibarMonthlyListing from '../simibarMonthlyListing';
import { useParams } from 'react-router-dom';
import LoadingIndicator from '@magento/venia-ui/lib/components/LoadingIndicator';
import { useQuery } from '@apollo/client';
import {
    GET_BLOG_ARCHIVE
} from '../../talons/Blog/Blog.gql';
import { Title, Meta } from '@magento/venia-ui/lib/components/Head';
import { useIntl } from 'react-intl';

const Category = props => {
    const { monthUrl = '' } = useParams();
    const { formatMessage } = useIntl();

    const dateData = monthUrl
        .replace('.html', '')
        .replace(' ', '')
        .split('-');
    const month = parseInt(dateData[1]);
    const year = parseInt(dateData[0]);

    // const {
    //     data: resultData,
    //     loading: resultLoading
    // } = useQuery(GET_BLOG_ARCHIVE_DETAILS,
    //     {
    //         variables: {
    //             monthly: parseInt(dateData[1]),
    //             year: parseInt(dateData[0])
    //         },
    //         skip: !monthUrl || !dateData || !dateData[0] || !dateData[1],
    //         fetchPolicy:"no-cache"
    //     }
    // )

    const { data: resultData, loading: resultLoading } = useQuery(
        GET_BLOG_ARCHIVE,
        {
            fetchPolicy: 'no-cache'
        }
    );

    if (resultLoading) return <LoadingIndicator />;
    if (
        !resultData ||
        !resultData.mpBlogMonthlyArchive ||
        !resultData.mpBlogMonthlyArchive.items ||
        !resultData.mpBlogMonthlyArchive.items[0]
    )
    return formatMessage({
        id: 'notFind',
        defaultMessage: 'Cannot find item'
    });

    let rsData;
    const handleData = () => {
        return resultData.mpBlogMonthlyArchive.items.forEach(item => {
            const resultMonthYear = item.label
                .replace(' ', '')
                .replace(' ', '')
                .split(',');
            switch (resultMonthYear[0] ? resultMonthYear[0] : '') {
                case 'January':
                    resultMonthYear[0] = '01';
                    break;
                case 'Febuary':
                    resultMonthYear[0] = '02';
                    break;
                case 'March':
                    resultMonthYear[0] = '03';
                    break;
                case 'April':
                    resultMonthYear[0] = '04';
                    break;
                case 'May':
                    resultMonthYear[0] = '05';
                    break;
                case 'June':
                    resultMonthYear[0] = '06';
                    break;
                case 'July':
                    resultMonthYear[0] = '07';
                    break;
                case 'August':
                    resultMonthYear[0] = '08';
                    break;
                case 'September':
                    resultMonthYear[0] = '09';
                    break;
                case 'October':
                    resultMonthYear[0] = '10';
                    break;
                case 'November':
                    resultMonthYear[0] = '11';
                    break;
                case 'December':
                    resultMonthYear[0] = '12';
                    break;
                default:
                    break;
            }
            const resultMonth = parseInt(resultMonthYear[0]);
            const resultYear = parseInt(resultMonthYear[1]);
            if (month === resultMonth && year === resultYear) {
                rsData = Object.assign({}, item);
            }
            return rsData;
        });
    };
    {
        handleData();
    }
    const archiveData = rsData ? rsData : {};

    return (
        <div className={`${classes.mainCtn} container`}>
            <Title>{archiveData ? archiveData.label : ''}</Title>
            <BreadCrumb
                items={[
                    {
                        label: formatMessage({
                            id: 'blog',
                            defaultMessage: 'Blog'
                        }),
                        path: '/blog.html'
                    },
                    {
                        label: archiveData.label
                    }
                ]}
            />
            <h1>{archiveData ? archiveData.label : ''}</h1>
            <div className={classes.blogRoot}>
                <div className={classes.blogListing}>
                    <BlogListing
                        classes={classes}
                        filterType="get_post_by_date_time"
                        filterValue={`${dateData[0]}-${dateData[1]}`}
                    />
                </div>
                <div className={classes.blogSidebar}>
                    <SearchBlog />
                    <SidebarPosts />
                    <CateTree />
                    <SimibarMonthlyListing />
                    <TopicList />
                    <TagList />
                </div>
            </div>
        </div>
    );
};

export default Category;
