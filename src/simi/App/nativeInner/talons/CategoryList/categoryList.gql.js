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
                name
                url_key
                url_path
                children_count
                path
                image
                children{
                    name
                    products{
                      items{
                        name
                        image{
                          url
                          label
                          
                        }
                        url_key
                        price_range{
                          maximum_price{
                            discount{
                              amount_off
                              percent_off
                            }
                            final_price{
                              currency
                              value
                            }
                            regular_price{
                              currency
                              value
                            }
                          }
                          minimum_price{
                            discount{
                                amount_off
                                percent_off
                              }
                              final_price{
                                currency
                                value
                              }
                              regular_price{
                                currency
                                value
                              }
                          }
                        }
                      }
                    }
                  }
                productImagePreview: products(pageSize: 1) {
                    items {
                        price_range{
                        minimum_price{
                          final_price{
                            value
                            currency
                          }
                          discount{
                            percent_off
                            amount_off
                          }
                        }
                        maximum_price{
                          final_price{
                            currency
                            value
                          }
                        }
                      }
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
