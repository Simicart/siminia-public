import React from 'react'
import classes from './style.module.css'
import { GET_BLOG_ARCHIVE } from '../../talons/Blog/Blog.gql'
import { useQuery } from '@apollo/client';
import { Link } from 'react-router-dom';
import Icon from '@magento/venia-ui/lib/components/Icon';
import { Calendar as CalendarIc } from 'react-feather';

const calendarIcon = <Icon src={CalendarIc} attrs={{ width: 13 }} />;

const SimibarMonthlyListing = props => {
    const {
        data: archiveListData
    } = useQuery(GET_BLOG_ARCHIVE)

    if (archiveListData && archiveListData.mpBlogMonthlyArchive && archiveListData.mpBlogMonthlyArchive.items) {
        const archiveItems = archiveListData.mpBlogMonthlyArchive.items;
        return (
            <div className={classes.listRoot}>
                <div className={classes.listHeader}>{`Monthly Archive`}</div>
                <div className={classes.listItems}>
                    {archiveItems.map((archiveItem, index) => {
                        try {
                            let archiveData = new Date(archiveItem.label);
                            if (archiveData && archiveData.getFullYear() && archiveData.getMonth()) {
                                return (
                                    <Link className={classes.listItem} to={`/blog/month/${(archiveData.getFullYear())}-${(archiveData.getMonth() + 1)}.html`} key={archiveItem.label}>
                                        {calendarIcon} {archiveItem.label} ({archiveItem.quantity})
                                    </Link>
                                )
                            }
                        } catch (err) {

                        }
                    })}
                </div>
            </div>
        )
    }
    return ''
}

export default SimibarMonthlyListing