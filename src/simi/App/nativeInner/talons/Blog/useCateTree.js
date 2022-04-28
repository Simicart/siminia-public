import { GET_BLOG_CATEGORIES } from './Blog.gql'
import { useQuery } from '@apollo/client';

const unflatten = (arr) => {
    let tree = [];
    let mappedArr = {};
    let arrElem;
    let mappedElem;

    for (var i = 0, len = arr.length; i < len; i++) {
        arrElem = arr[i];
        arrElem.label = arrElem.name;
        mappedArr[arrElem.category_id] = arrElem;
        mappedArr[arrElem.category_id]['children'] = [];
    }

    for (var id in mappedArr) {
        if (mappedArr.hasOwnProperty(id)) {
            mappedElem = mappedArr[id];
            if (mappedElem.parent_id) {
                mappedArr[mappedElem['parent_id']]['children'].push(mappedElem);
            }
            else {
                tree.push(mappedElem);
            }
        }
    }
    return tree;
}

export const useCateTree = props => {
    const {
        data: cateData,
        loading: cateLoading
    } = useQuery(GET_BLOG_CATEGORIES)

    let dataCateTree = [];
    if (cateData && cateData.mpBlogCategories &&
        cateData.mpBlogCategories.items &&
        cateData.mpBlogCategories.items.length) {
        let dataCateFlat = JSON.parse(JSON.stringify(cateData.mpBlogCategories.items));
        dataCateTree = unflatten(dataCateFlat);
        //skip the root
        if (dataCateTree && dataCateTree[0] && dataCateTree[0].children)
            dataCateTree = dataCateTree[0].children
        else
            dataCateTree = []
    }
    return {
        dataCateTree,
        cateLoading,
    }
}