import { useState } from 'react';
import { useQuery } from '@apollo/client';
import { GET_SIDEBAR_BLOG_POSTS } from './Blog.gql';
import { Util } from '@magento/peregrine';
const { BrowserPersistence } = Util;
const storage = new BrowserPersistence();

export const useSidebarPosts = props => {
    const [tab, setTab] = useState('pop');
    let number_mostview_posts = 6;
    let number_recent_posts = 6;
    const simiBlogConfiguration = storage.getItem('simiBlogConfiguration');
    if (simiBlogConfiguration && simiBlogConfiguration.sidebar) {
        if (simiBlogConfiguration.sidebar.number_mostview_posts)
            number_mostview_posts = parseInt(simiBlogConfiguration.sidebar.number_mostview_posts);
        if (simiBlogConfiguration.sidebar.number_recent_posts)
            number_recent_posts = parseInt(simiBlogConfiguration.sidebar.number_recent_posts);
    }
    const {
        data: popData,
        loading: popLoading
    } = useQuery(GET_SIDEBAR_BLOG_POSTS, {
        variables: {
            sortBy: 'Popular',
            pageSize: number_mostview_posts
        },
    });

    const {
        data: latestData,
        loading: latestLoading
    } = useQuery(GET_SIDEBAR_BLOG_POSTS, {
        variables: {
            sortBy: 'Latest',
            pageSize: number_recent_posts
        },
    })

    return {
        tab,
        setTab,
        popData,
        popLoading,
        latestData,
        latestLoading
    }
}