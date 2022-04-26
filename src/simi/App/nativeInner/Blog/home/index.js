import React from 'react'
import BreadCrumb from '../breadcrumb/index';
import classes from './home.module.css';
import BlogListing from '../blogListing/index';
import SearchBlog from '../searchBlog';
import CateTree from '../cateTree';
import TagList from '../tagList';
import TopicList from '../topicList';
import SidebarPosts from '../sidebarPosts';
import SimibarMonthlyListing from '../simibarMonthlyListing';
import { Title, Meta } from '@magento/venia-ui/lib/components/Head';
import { Util } from '@magento/peregrine';
const { BrowserPersistence } = Util;
const storage = new BrowserPersistence();

const Home = props => {
    const simiBlogConfiguration = storage.getItem('simiBlogConfiguration');
    let title = 'Blog'
    let description = ''
    let titleName = 'Blog'
    if (simiBlogConfiguration && simiBlogConfiguration.seo && simiBlogConfiguration.general) {
        if (simiBlogConfiguration.seo.meta_title)
            title = simiBlogConfiguration.seo.meta_title
        if (simiBlogConfiguration.seo.meta_description)
            description = simiBlogConfiguration.seo.meta_description
        if (simiBlogConfiguration.general.name)
            titleName = simiBlogConfiguration.general.name
    }
    return (
        <div className={`${classes.mainCtn} container`}>
            <Title>{title}</Title>
            <Meta name="description" content={description} />
            <BreadCrumb items={
                [
                    {
                        label: 'Blog'
                    }
                ]
            }
            />
            <h1>{titleName}</h1>
            <div className={classes.blogRoot}>
                <div className={classes.blogListing}>
                    <BlogListing classes={classes} />
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

export default Home