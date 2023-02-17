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

const giftCardEnabled =
    window.SMCONFIGS &&
    window.SMCONFIGS.plugins &&
    window.SMCONFIGS.plugins.SM_ENABLE_GIFT_CARD &&
    parseInt(window.SMCONFIGS.plugins.SM_ENABLE_GIFT_CARD) === 1;

const rewardPointEnabled =
    window.SMCONFIGS &&
    window.SMCONFIGS.plugins &&
    window.SMCONFIGS.plugins.SM_ENABLE_REWARD_POINTS &&
    parseInt(window.SMCONFIGS.plugins.SM_ENABLE_REWARD_POINTS) === 1;

export const CallForPriceFragment = callForPriceEnabled
    ? gql`
          fragment CallForPriceFragment on ProductInterface {
                advancedhideprice {
                    advancedhideprice_text
                    advancedhideprice_type
                }
          }
      `
    : gql`
          fragment CallForPriceFragment on ProductInterface {
              sku
          }
      `;

export const ProductLabelFragment = productLabelEnabled
    ? gql`
          fragment ProductLabelFragment on ProductInterface {
              product_label {
                  active
                  apply_outofstock_product
                  conditions_serialized {
                      aggregator
                      attribute
                      conditions
                      is_value_processed
                      operator
                      type
                      value
                  }
                  created_at
                  customer_groups
                  id
                  image
                  image_data {
                      angle
                      height
                      heightOrigin
                      left
                      top
                      width
                      widthOrigin
                  }
                  name
                  priority
                  store_views
                  updated_at
                  valid_end_date
                  valid_start_date
              }
          }
      `
    : gql`
          fragment ProductLabelFragment on ProductInterface {
              sku
          }
      `;

export const GiftCardFragment = giftCardEnabled
    ? gql`
          fragment GiftCardFragment on MpGiftCardProduct {
              allow_amount_range
              gift_card_amounts
              max_amount
              min_amount
              price_rate
          }
      `
    : gql`
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
        $id: Int
        $pageSize: Int
        $currentPage: Int
        $filters: ProductAttributeFilterInput
        $sort: ProductAttributeSortInput
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
        products(
            pageSize: $pageSize
            currentPage: $currentPage
            filter: $filters
            sort: $sort
        ) {
            items {
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
    query getFilterFromCate($stringId: String) {
        products(filter: { category_id: { eq: $stringId } }) {
            aggregations {
                label
                count
                attribute_code
                options {
                    label
                    value
                }
            }
        }
        __type(name: "ProductAttributeFilterInput") {
            inputFields {
                name
                type {
                    name
                }
            }
        }
    }
`;
