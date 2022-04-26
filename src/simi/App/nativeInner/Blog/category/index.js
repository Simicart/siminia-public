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
import { GET_CATE_BY_URL_KEY } from '../../talons/Blog/Blog.gql';
import { Title, Meta } from '@magento/venia-ui/lib/components/Head';

const Category = props => {
    const { categoryUrl = "" } = useParams();

    const {
        data: resultData,
        loading: resultLoading
    } = useQuery(GET_CATE_BY_URL_KEY,
        {
            variables: {
                url_key: categoryUrl.replace('.html', '')
            },
            skip: !categoryUrl,
            fetchPolicy:"no-cache"
        }
    )
    if (resultLoading)
        return <LoadingIndicator />
    if (!resultData || !resultData.mpBlogCategories || !resultData.mpBlogCategories.items || !resultData.mpBlogCategories.items[0])
        return 'Cannot find item';

    const cateData = resultData.mpBlogCategories.items[0];

    return (
        <div className={classes.mainCtn}>
            <Title>{cateData.meta_title ? cateData.meta_title : cateData.name}</Title>
            <Meta name="description" content={cateData.meta_description} />
            <Meta name="keywords" content={cateData.meta_keywords} />
            <Meta name="robots" content={cateData.meta_robots} />
            <BreadCrumb items={
                [
                    {
                        label: 'Blog',
                        path: '/blog.html'
                    },
                    {
                        label: cateData.name,
                    }
                ]
            }
            />
            <h1>{cateData.name}</h1>
            <div className={classes.blogRoot}>
                <div className={classes.blogListing}>
                    <BlogListing classes={classes} filterType="get_post_by_categoryId" filterValue={cateData.category_id} />
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

export default Category