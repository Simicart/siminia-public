import { gql } from '@apollo/client';

export const GET_STORE_CONFIG_DATA = gql`
    query GetStoreConfigForCategoryList {
        storeConfig {
            id
            category_url_suffix
        }
    }
`;

export const GET_CATEGORY_LIST = gql`
    query GetCategoryList($id: Int!) {
        category(id: $id) {
            id
            children {
                id
                products{
                  total_count
                  items{
                        name
                        image{
                          url
                          label
                          
                        }
                        special_price
                        url_key
                        url_suffix
                  }}
                name
                url_key
                url_path
                url_suffix
                children_count
                path
                image
                children{
                    name
                    url_suffix
                  	url_key
                  	url_path
                    image
                    products{
                      items{
                        name
                        image{
                          url
                          label
                        }
                        url_key
                        url_suffix
                      }
                    }
                  }
                productImagePreview: products(pageSize: 1) {
                    items {
                      id
                      small_image {
                          url
                      }
                  }
                }
            }
        }
    }
`;

export default {
    getCategoryListQuery: GET_CATEGORY_LIST,
    getStoreConfigQuery: GET_STORE_CONFIG_DATA
};
