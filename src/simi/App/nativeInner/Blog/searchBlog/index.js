import React from 'react';
import { useSearchBox } from '../../talons/Blog/useSearchBox';
import { Form } from 'informed';
import classes from './search.module.css';
import LoadingIndicator from '@magento/venia-ui/lib/components/LoadingIndicator';
import { Link } from 'react-router-dom';
import Icon from '@magento/venia-ui/lib/components/Icon';
import { Search as SearchIc } from 'react-feather';
import { useIntl } from 'react-intl';

const searchIcon = <Icon src={SearchIc} attrs={{ width: 16 }} />;

const SearchBlog = props => {
    const { blogData, blogLoading, query, setQuery } = useSearchBox();
    const { formatMessage } = useIntl();

    let searchResult = [];
    if (blogData && blogData.mpBlogPosts && blogData.mpBlogPosts.items) {
        blogData.mpBlogPosts.items.map(item => {
            const { name, url_key, publish_date, image } = item;
            searchResult.push(
                <Link
                    className={classes.searchItem}
                    to={`/blog/post/${url_key}.html`}
                >
                    {image ? (
                        <div className={classes.searchItemImage}>
                            <img src={image} alt={name} />
                        </div>
                    ) : (
                        ''
                    )}
                    <div className={classes.searchItemInfo}>
                        <div className={classes.searchItemName}>{name}</div>
                        <div className={classes.searchItemDate}>
                            {publish_date}
                        </div>
                    </div>
                </Link>
            );
        });
    }

    return (
        <div className="mpblog-search">
            <Form autoComplete="off" className={classes.searchForm}>
                <div className={classes.searchFieldCtn}>
                    <div className={classes.searchField}>
                        {searchIcon}
                        <input
                            id="blog-search-input-field"
                            type="text"
                            onChange={e => {
                                setTimeout(() => {
                                    if (!blogLoading)
                                        setQuery(
                                            document.getElementById(
                                                'blog-search-input-field'
                                            ).value
                                        );
                                }, 2000);
                            }}
                            placeholder={formatMessage({
                                id: 'search',
                                defaultMessage: 'Search blogs here...'
                            })}
                        />
                    </div>
                </div>
                {blogLoading || searchResult ? (
                    <div className={classes.autocomplete}>
                        {blogLoading ? <LoadingIndicator /> : searchResult}
                    </div>
                ) : (
                    ''
                )}
            </Form>
        </div>
    );
};

export default SearchBlog;
