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
import { GET_TAG_BY_URL_KEY } from '../../talons/Blog/Blog.gql';
import { Title, Meta } from '@magento/venia-ui/lib/components/Head';

const Tag = props => {
    const { tagUrl = "" } = useParams();

    const {
        data: resultData,
        loading: resultLoading
    } = useQuery(GET_TAG_BY_URL_KEY,
        {
            variables: {
                url_key: tagUrl.replace('.html', '')
            },
            skip: !tagUrl
        }
    )
    if (resultLoading)
        return <LoadingIndicator />
    if (!resultData || !resultData.mpBlogTags || !resultData.mpBlogTags.items || !resultData.mpBlogTags.items[0])
        return 'Cannot find item';

    const tagData = resultData.mpBlogTags.items[0];

    return (
        <div className={`${classes.mainCtn} container`}>
            <Title>{tagData.meta_title ? tagData.meta_title : tagData.name}</Title>
            <Meta name="description" content={tagData.meta_description} />
            <Meta name="keywords" content={tagData.meta_keywords} />
            <Meta name="robots" content={tagData.meta_robots} />
            <BreadCrumb items={
                [
                    {
                        label: 'Blog',
                        path: '/blog.html'
                    },
                    {
                        label: tagData.name,
                    }
                ]
            }
            />
            <h1>{tagData.name}</h1>
            <div className={classes.blogRoot}>
                <div className={classes.blogListing}>
                    <BlogListing classes={classes} filterType="get_post_by_tagName" filterValue={tagData.name} />
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

export default Tag