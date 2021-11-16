import React from 'react';
import { mergeClasses } from '@magento/venia-ui/lib/classify';
import defaultClasses from './scroll.css';
import LoadingIndicator from '@magento/venia-ui/lib/components/LoadingIndicator';
import { CarefreeHorizontalScroll } from '../CarefreeHorizontalScroll/CarefreeHorizontalScroll';
import { useQuery } from '@apollo/client';
import { GET_MEGA_MENU } from './megaMenu.gql';
import { recursiveFindCate } from './index';
import { Link } from 'src/drivers';

const imageStyle = {
    display: 'block',
    margin: '10px auto',
    width: '100%'
};

const ROOT_ID = 2;

export const CategoryScroll = props => {
    const { item } = props;

    const { data, loading } = useQuery(GET_MEGA_MENU);

    console.log('kek', data);
    const classes = mergeClasses(defaultClasses, props.classes);
    const { dataParsed } = item;

    if (
        item &&
        item.dataParsed &&
        item.dataParsed.openCategoryProducts &&
        data &&
        data.categoryList &&
        data.categoryList[0] &&
        data.categoryList[0].children &&
        data.categoryList[0].children.length
    ) {
        const parentId =
            parseInt(item.dataParsed.openCategoryProducts) || ROOT_ID;
        const rootCate = data.categoryList[0];
        const classes = mergeClasses(defaultClasses, props.classes);
        const cate =
            parentId === ROOT_ID
                ? rootCate
                : recursiveFindCate(rootCate.children, parentId);
        const cateChildren = cate ? cate.children : [];

        const content = cateChildren.map((x, i) => {
            const imgLink = dataParsed.image || x.image || '';
            if (!imgLink) {
                return '';
            }
            return (
                <Link
                    className={classes.root}
                    to={`${x.url_path || ''}${x.url_suffix || '.html'}`}
                    style={{ width: '100%' }}
                    key={i.toString()}
                >
                    {imgLink ? (
                        <img src={imgLink} alt={x.name} style={imageStyle} />
                    ) : (
                        ''
                    )}
                    <div className={classes.cate_name}>{x.name}</div>
                </Link>
            );
        });

        const numberOfChildren = cateChildren.filter(
            x => !!(dataParsed.image || x.image || '')
        ).length;

        return (
            <CarefreeHorizontalScroll
                item={item}
                pagingStyle={{
                    marginTop: 5
                }}
                _numberOfChildren={numberOfChildren}
            >
                {content}
            </CarefreeHorizontalScroll>
        );
    } else if (loading) {
        return <LoadingIndicator />;
    }
    return '';
};
