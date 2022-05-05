import React from 'react'
import BreadCrumb from '../breadcrumb/index';
import classes from '../home/home.module.css';
import BlogListing from '../blogListing/index';
import SearchBlog from '../searchBlog';
import CateTree from '../cateTree';
import TagList from '../tagList';
import TopicList from '../topicList';
import SidebarPosts from '../sidebarPosts';
import SimibarMonthlyListing from '../simibarMonthlyListing';
import { useParams } from "react-router-dom";
import LoadingIndicator from '@magento/venia-ui/lib/components/LoadingIndicator';
import { useQuery } from '@apollo/client';
import { GET_TOPIC_BY_URL_KEY } from '../../talons/Blog/Blog.gql';
import { Title, Meta } from '@magento/venia-ui/lib/components/Head';
import { useIntl } from 'react-intl';

const Topic = props => {
    const { topicUrl = "" } = useParams();
    const { formatMessage } = useIntl();

    const {
        data: resultData,
        loading: resultLoading
    } = useQuery(GET_TOPIC_BY_URL_KEY,
        {
            variables: {
                url_key: topicUrl.replace('.html', '')
            },
            skip: !topicUrl
        }
    )
    if (resultLoading)
        return <LoadingIndicator />
    if (!resultData || !resultData.mpBlogTopics || !resultData.mpBlogTopics.items || !resultData.mpBlogTopics.items[0])
    return formatMessage({
        id: 'notFind',
        defaultMessage: 'Cannot find item'
    });

    const topicData = resultData.mpBlogTopics.items[0];

    return (
        <div className={`${classes.mainCtn} container`}>
            <Title>{topicData.meta_title ? topicData.meta_title : topicData.name}</Title>
            <Meta name="description" content={topicData.meta_description} />
            <Meta name="keywords" content={topicData.meta_keywords} />
            <Meta name="robots" content={topicData.meta_robots} />
            <BreadCrumb items={
                [
                    {
                        label: formatMessage({
                            id: 'blog',
                            defaultMessage: 'Blog'
                        }),
                        path: '/blog.html'
                    },
                    {
                        label: topicData.name,
                    }
                ]
            }
            />
            <h1>{topicData.name}</h1>
            <div className={classes.blogRoot}>
                <div className={classes.blogListing}>
                    <BlogListing classes={classes} filterType="get_post_by_topic" filterValue={topicData.topic_id} />
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
    )
}

export default Topic