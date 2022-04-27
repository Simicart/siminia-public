import React, { useRef, useEffect } from 'react'
import { usePost } from '../../talons/Blog/usePost'
import { useParams } from "react-router-dom";
import LoadingIndicator from '@magento/venia-ui/lib/components/LoadingIndicator';
import classes from './postDetails.module.css';
import { Title, Meta } from '@magento/venia-ui/lib/components/Head';
import BreadCrumb from '../breadcrumb/index';
import SearchBlog from '../searchBlog';
import CateTree from '../cateTree';
import TagList from '../tagList';
import TopicList from '../topicList';
import SidebarPosts from '../sidebarPosts';
import SimibarMonthlyListing from '../simibarMonthlyListing';
import RichContent from '@magento/venia-ui/lib/components/RichContent';
import BlogPostInfo from '../blogPostInfo';
import RelatedPosts from './relatedPosts';
import SharingBlock from '../sharingBlock';
import RelatedProducts from './relatedProducts'
import { has } from "lodash/object";

import { Util } from '@magento/peregrine';
const { BrowserPersistence } = Util;
const storage = new BrowserPersistence();

const Post = props => {
    const { postUrl = "" } = useParams();
    const talonProps = usePost({ postUrl });
    const {
        resultData,
        resultLoading
    } = talonProps
    const fbRef = useRef(null);
    useEffect(() => {
        try {
            window.fbAsyncInit = function () {
                FB.init({
                    appId: '1431353733653196',
                    autoLogAppEvents: true,
                    xfbml: true,
                    version: 'v8.0'
                });
            };
        } catch (err) {

        }

        try {
            (function (d, s, id) {
                if (!window.simiImportedFB) {
                    var js, fjs = d.getElementsByTagName(s)[0];
                    if (d.getElementById(id)) { return; }
                    js = d.createElement(s); js.id = id;
                    js.src = "//connect.facebook.net/en_US/sdk.js";
                    fjs.parentNode.insertBefore(js, fjs);
                }
            }(document, 'script', 'facebook-jssdk'));
        } catch (err) {

        }
    }, [postUrl]);

    useEffect(() => {
        try {
            if (resultData && global.document && has(global.window, "FB")) {
                global.FB.XFBML.parse(fbRef.current);
            }
        } catch (err) {

        }
    }, [postUrl, resultData]);

    if (!postUrl)
        return '';
    if (resultLoading)
        return <LoadingIndicator />

    if (!resultData || !resultData.mpBlogPosts || !resultData.mpBlogPosts.items || !resultData.mpBlogPosts.items[0])
        return 'Cannot find item';

    const simiBlogConfiguration = storage.getItem('simiBlogConfiguration');
    let linkColor = '#1ABC9C';
    if (simiBlogConfiguration && simiBlogConfiguration.general && simiBlogConfiguration.general.font_color) {
        linkColor = simiBlogConfiguration.general.font_color;
    }

    const postData = resultData.mpBlogPosts.items[0];
    const urlToComment = window.location.href;

    return (
        <div className={`${classes.root} container`}>
            <Title>{postData.meta_title ? postData.meta_title : postData.name}</Title>
            <Meta name="description" content={postData.meta_description} />
            <Meta name="keywords" content={postData.meta_keywords} />
            <Meta name="robots" content={postData.meta_robots} />
            <BreadCrumb items={
                [
                    {
                        label: 'Blog',
                        path: '/blog.html'
                    },
                    {
                        label: postData.name,
                    }
                ]
            }
            />
            <h1>{postData.name}</h1>
            <style dangerouslySetInnerHTML={{
                __html: `
                    .${classes.blogPostRichContent} a { color: ${linkColor} }
                    .${classes.relatedPostName} { color: ${linkColor} }
            `}} />
            <div className={classes.blogDetailsRoot}>
                <div className={classes.blogDetailsContent}>
                    {!!postData.image &&
                        <img src={postData.image} alt="post image" className={classes.blogpostImage} />
                    }
                    <RichContent classes={{ root: classes.blogPostRichContent }} html={postData.post_content} />
                    <div className={classes.blogDetailsPostInfo}>
                        <BlogPostInfo item={postData} classes={classes} />
                    </div>
                    <SharingBlock classes={classes} />
                    {!!(postData && postData.posts && postData.posts.items && postData.posts.items.length) &&
                        <div className={`${classes.relatedPosts} ${classes.detailsSection}`}>
                            <div className={classes.sectionHeader}>
                                {`Related Posts`}
                            </div>
                            <div className={classes.sectionContent}>
                                <RelatedPosts classes={classes} items={postData.posts.items} />
                            </div>
                        </div>
                    }
                    {!!(postData && postData.products && postData.products.items && postData.products.items.length) &&
                        <RelatedProducts items={postData.products.items} classes={classes} />
                    }
                    <div ref={fbRef}>
                        <div
                            className="fb-comments"
                            data-href={`${urlToComment}`}
                            data-width="100%"
                            data-numposts="5"
                            style={{ width: "100%" }}
                        />
                    </div>
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
        </div >
    )
}

export default Post