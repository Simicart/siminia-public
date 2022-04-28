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
import { Title, Meta } from '@magento/venia-ui/lib/components/Head';
import { useLocation } from "react-router-dom";

const Topic = props => {
    const location = useLocation();
    const authorName = new URLSearchParams(location.search).get("author_name");

    if (authorName) {
        return (
            <div className={`${classes.mainCtn} container`}>
                <Title>{authorName}</Title>
                <BreadCrumb items={
                    [
                        {
                            label: 'Blog',
                            path: '/blog.html'
                        },
                        {
                            label: 'Author',
                        }
                    ]
                }
                />
                <h1>{authorName}</h1>
                <div className={classes.blogRoot}>
                    <div className={classes.blogListing}>
                        <BlogListing classes={classes} filterType="get_post_by_authorName" filterValue={authorName} />
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
    return ''
}

export default Topic