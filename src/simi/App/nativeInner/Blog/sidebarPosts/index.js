import React, { useMemo } from 'react'
import classes from './sidebarPosts.module.css'
import { useSidebarPosts } from '../../talons/Blog/useSidebarPosts'
import LoadingIndicator from '@magento/venia-ui/lib/components/LoadingIndicator';
import { Link } from 'react-router-dom';
import { Util } from '@magento/peregrine';
const { BrowserPersistence } = Util;
const storage = new BrowserPersistence();

const PostItem = props => {
    const {
        name,
        image,
        publish_date,
        url_key
    } = props.item;
    return (
        <div className={classes.sidebarPostItem}>
            {
                image ? <div className={classes.sidebarPostItemImage} >
                    <img src={image} alt={name} />
                </div> : ''
            }
            <div className={classes.sidebarPostItemInfo}>
                <Link className={classes.sidebarPostItemName} to={`/blog/post/${url_key}.html`}>
                    {name}
                </Link>
                <div className={classes.sidebarPostItemDate}>{publish_date}</div>
            </div>
        </div>
    )
}

const SidebarPosts = props => {
    const {
        tab,
        setTab,
        popData,
        popLoading,
        latestData,
        latestLoading
    } = useSidebarPosts();

    const simiBlogConfiguration = storage.getItem('simiBlogConfiguration');
    let linkColor = '#1ABC9C';
    if (simiBlogConfiguration && simiBlogConfiguration.general && simiBlogConfiguration.general.font_color) {
        linkColor = simiBlogConfiguration.general.font_color;
    }

    const popPosts = useMemo(() => {
        if (popData && popData.mpBlogPosts && popData.mpBlogPosts.items) {
            return popData.mpBlogPosts.items.map(item => <PostItem item={item} key={item.url_key} />)
        }
        return []
    }, [latestData])

    const latestPosts = useMemo(() => {
        if (latestData && latestData.mpBlogPosts && latestData.mpBlogPosts.items) {
            return latestData.mpBlogPosts.items.map(item => <PostItem item={item} key={item.url_key} />)
        }
        return []
    }, [latestData])


    return (
        <div className={classes.root}>
            <style dangerouslySetInnerHTML={{
                __html: `
                .${classes.sidebarPostItemName} { color: ${linkColor} }
            `}} />
            <div className={classes.tabsHeaders}>
                <div className={`${classes.tabsHeader} ${tab === 'pop' ? classes.active : classes.inactive}`}
                    onClick={() => setTab('pop')}
                >
                    {`Popular`}
                </div>
                <div className={`${classes.tabsHeader} ${tab === 'latest' ? classes.active : classes.inactive}`}
                    onClick={() => setTab('latest')}
                >
                    {`Latest`}
                </div>
            </div>
            <div className={classes.tabContents}>
                <div className={`${classes.tabContent} ${tab === 'pop' ? classes.active : classes.inactive}`} >
                    {popLoading ? <LoadingIndicator /> : ''}
                    {popPosts}
                </div>
                <div className={`${classes.tabContent} ${tab === 'latest' ? classes.active : classes.inactive}`} >
                    {latestLoading ? <LoadingIndicator /> : ''}
                    {latestPosts}
                </div>
            </div>
        </div>
    )
}

export default SidebarPosts