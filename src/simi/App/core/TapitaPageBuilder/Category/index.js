import React from 'react';
import { mergeClasses } from '@magento/venia-ui/lib/classify';
import { useQuery } from '@apollo/client';
import { GET_MEGA_MENU } from './megaMenu.gql';
import defaultClasses from './index.css';
import { Link } from 'src/drivers';

export const recursiveFindCate = (cateArr, idToFind) => {
    let foundCate;
    cateArr.every(cateArrItm => {
        if (cateArrItm.id === idToFind) foundCate = cateArrItm;
        else if (cateArrItm.children && cateArrItm.children.length) {
            foundCate = recursiveFindCate(cateArrItm.children, idToFind);
        }
        if (foundCate) return false;
        else return true;
    });
    return foundCate;
};

const Category = props => {
    const { item } = props;
    const { data } = useQuery(GET_MEGA_MENU);
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
        const rootCate = data.categoryList[0];
        const classes = mergeClasses(defaultClasses, props.classes);
        const idToFind = parseInt(item.dataParsed.openCategoryProducts);
        const foundCate = recursiveFindCate(rootCate.children, idToFind);
        if (foundCate) {
            const { dataParsed } = item;
            const imageStyle = {
                display: 'block',
                margin: '10px auto',
                width: '100%'
            };
            return (
                <Link
                    className={classes.root}
                    to={foundCate.url_path + foundCate.url_suffix}
                    style={{ width: '100%' }}
                >
                    {dataParsed.image ? (
                        <img
                            src={dataParsed.image}
                            alt={foundCate.name}
                            style={imageStyle}
                        />
                    ) : (
                        ''
                    )}
                    <div className={classes.cate_name}>{foundCate.name}</div>
                </Link>
            );
        }
    }
    return '';
};

export default Category;
