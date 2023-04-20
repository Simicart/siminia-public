import gql from 'graphql-tag';
import { CategoryFragment, ProductOfListFragment } from './catalogFragment.gql';
const productLabelEnabled =
    window.SMCONFIGS &&
    window.SMCONFIGS.plugins &&
    window.SMCONFIGS.plugins.SM_ENABLE_PRODUCT_LABEL &&
    parseInt(window.SMCONFIGS.plugins.SM_ENABLE_PRODUCT_LABEL) === 1;

const callForPriceEnabled =
    window.SMCONFIGS &&
    window.SMCONFIGS.plugins &&
    window.SMCONFIGS.plugins.SM_ENABLE_CALL_FOR_PRICE &&
    parseInt(window.SMCONFIGS.plugins.SM_ENABLE_CALL_FOR_PRICE) === 1;

const rewardPointEnabled =
    window.SMCONFIGS &&
    window.SMCONFIGS.plugins &&
    window.SMCONFIGS.plugins.SM_ENABLE_REWARD_POINTS &&
    parseInt(window.SMCONFIGS.plugins.SM_ENABLE_REWARD_POINTS) === 1;
    
export const ProductLabelFragment = productLabelEnabled
    ? gql`
          fragment ProductLabelFragment on ProductInterface {
            product_label {
                name
                image
                image_data {
                    left
                    top
                    width
                    height
                    widthOrigin
                    heightOrigin
                    angle
                }
            }
          }
      `
    : gql`
          fragment ProductLabelFragment on ProductInterface {
              sku
          }
      `;

export const CallForPriceFragment = callForPriceEnabled
    ? gql`
          fragment CallForPriceFragment on ProductInterface {
                callforprice_text 
          }
      `
    : gql`
          fragment CallForPriceFragment on ProductInterface {
              sku
          }
      `;
export const GiftCardFragment = gql`
          fragment GiftCardFragment on ProductInterface {
              sku
          }
      `;

export const RewardPointFragment = rewardPointEnabled
    ? gql`
          fragment RewardPointFragment on ProductInterface {
                reward_point {
                    product_point {
                        assign_by
                        receive_point
                        dependent_qty
                        point
                        message
                    }
                    customer_point {
                        review_point
                        message
                    }
                }
          }
      `
    : gql`
          fragment RewardPointFragment on ProductInterface {
              sku
          }
      `;

export const getCateNoFilter = gql`
    query getCateNoFilter(
        $id: Int!
        $currentPage: Int
        $pageSize: Int
        $stringId: String
        $sort: ProductAttributeSortInput
        $simiFilter: String
        $simiProductSort: SimiProductSort
    ) {
        category(id: $id) {
            ...CategoryFragment
            children {
                id
                name
                url_path
                description
                cms_block {
                    identifier
                    title
                    content
                }
                display_mode
            }
        }
        simiproducts(
            pageSize: $pageSize
            currentPage: $currentPage
            filter: { category_id: { eq: $stringId } }
            sort: $sort
            simiFilter: $simiFilter
            simiProductSort: $simiProductSort
            simiNoFilter: true
        ) {
            items {
                activity
                description {
                    html
                }
                ...CallForPriceFragment
                ...ProductOfListFragment
                ...ProductLabelFragment
                ...GiftCardFragment
                ...RewardPointFragment
            }
            page_info {
                total_pages
            }
            total_count
            minPrice
            maxPrice
        }
    }
    ${ProductLabelFragment}
    ${CategoryFragment}
    ${CallForPriceFragment}
    ${GiftCardFragment}
    ${ProductOfListFragment}
    ${RewardPointFragment}
`;

export const getFilterFromCate = gql`
    query getFilterFromCate(
        $currentPage: Int
        $pageSize: Int
        $stringId: String
        $sort: ProductAttributeSortInput
        $simiFilter: String
    ) {
        simiproducts(
            pageSize: $pageSize
            currentPage: $currentPage
            filter: { category_id: { eq: $stringId } }
            sort: $sort
            simiFilter: $simiFilter
        ) {
            simi_filters {
                name
                filter_items_count
                request_var
                filter_items {
                    label
                    value_string
                    items_count
                }
            }
            sort_fields {
                default
                options {
                    value
                    label
                }
            }
        }
    }
`;
