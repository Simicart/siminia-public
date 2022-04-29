import React from 'react';
import { Link } from 'react-router-dom';
import BlogPostInfo from '../blogPostInfo'
import RichText from '@magento/venia-ui/lib/components/RichText'
import { useIntl } from 'react-intl';

const BlogListingItem = props => {
    const { classes, item, simiBlogConfiguration } = props;
    const { formatMessage } = useIntl();
    const {
        name,
        url_key,
        short_description,
        image
    } = item;
    let linkColor = '#1ABC9C';
    if (simiBlogConfiguration && simiBlogConfiguration.general && simiBlogConfiguration.general.font_color) {
        linkColor = simiBlogConfiguration.general.font_color;
    }
    let displayStyle = 1;
    if (simiBlogConfiguration && simiBlogConfiguration.general && simiBlogConfiguration.general.display_style) {
        displayStyle = parseInt(simiBlogConfiguration.general.display_style);
    }
    return (
        <div className={`${classes.blogpostItem} ${displayStyle === 1 ? classes.blogpostItemList : classes.blogpostItemGrid}`}>
            {image ? <div className={classes.blogpostItemCol1} >
                <img src={image} alt={name} />
            </div> : ''}
            <div className={classes.blogpostItemCol2} >
                <h2>
                    <Link to={`/blog/post/${url_key}.html`} style={{ color: linkColor }}>
                        {name}
                    </Link>
                </h2>
                <BlogPostInfo item={item} classes={classes} />
                <div className={classes.blogpostDescription}>
                    <RichText classes={{ root: classes.blogpostDescriptionRichtext }} content={short_description} />
                </div>
                <Link to={`/blog/post/${url_key}.html`}>
                    <div className={classes.readMore}>
                        {formatMessage({
                                id: 'readMore',
                                defaultMessage: 'Read More'
                            })}
                    </div>
                </Link>
            </div>
        </div>
    )
}

export default BlogListingItem