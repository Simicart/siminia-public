import React, { useEffect } from 'react';
import { mergeClasses } from '@magento/venia-ui/lib/classify';
import defaultClasses from './blogListing.module.css';
import { useBlogListing } from '../../talons/Blog/useBlogListing';
import LoadingIndicator from '@magento/venia-ui/lib/components/LoadingIndicator';
import BlogListingItem from '../blogListingItem';
import Pagination from '@magento/venia-ui/lib/components/Pagination';
import { Util } from '@magento/peregrine';
import { useIntl } from 'react-intl';
const { BrowserPersistence } = Util;
const storage = new BrowserPersistence();

const BlogListing = props => {
    const { filterType, filterValue } = props;
    const classes = mergeClasses(defaultClasses, props.classes);
    const talonProps = useBlogListing({ filterType, filterValue });
    const {
        blogData,
        blogLoading,
        blogError,
        pageControl,
        pageSize,
        setPageSize
    } = talonProps;
    const { formatMessage } = useIntl();

    const simiBlogConfiguration = storage.getItem('simiBlogConfiguration');

    let linkColor = '#1ABC9C';
    if (
        simiBlogConfiguration &&
        simiBlogConfiguration.general &&
        simiBlogConfiguration.general.font_color
    ) {
        linkColor = simiBlogConfiguration.general.font_color;
    }

    useEffect(() => {
        if (blogLoading) {
            document.body.scrollTop = 0;
            document.documentElement.scrollTop = 0;
        }
    }, [blogLoading]);

    if (blogLoading) return <LoadingIndicator />;
    if (blogError || !blogData || !blogData.mpBlogPosts) return '';
    const { mpBlogPosts } = blogData;
    if (!mpBlogPosts.items || !mpBlogPosts.total_count)
        return (
            <div className={classes.blogEmpty}>
                {formatMessage({
                    id: 'blogEmpty',
                    defaultMessage: 'There are no posts at this moment'
                })}
            </div>
        );

    return (
        <div className={classes.blogListingCtn}>
            {mpBlogPosts.items.map(item => (
                <BlogListingItem
                    classes={classes}
                    item={item}
                    key={item.post_id}
                    simiBlogConfiguration={simiBlogConfiguration}
                />
            ))}
            <style
                dangerouslySetInnerHTML={{
                    __html: `
                .${classes.blogpostItem} h2 { color: ${linkColor} }
                .${classes.readMore} { color: ${linkColor} }
            `
                }}
            />
            <div className={classes.pagination}>
                <Pagination pageControl={pageControl} />
            </div>
            <div className={classes.pageSize}>
                {`Show `}
                <span className={classes.pageSizeInput}>
                    <select
                        onChange={e => {
                            setPageSize(e.target.value);
                            pageControl.setPage(1);
                        }}
                        value={pageSize}
                    >
                        <option value="5">5</option>
                        <option value="10">10</option>
                        <option value="20">20</option>
                    </select>
                </span>
                {formatMessage({
                    id: 'perPage',
                    defaultMessage: ' per page'
                })}
            </div>
        </div>
    );
};
export default BlogListing;
