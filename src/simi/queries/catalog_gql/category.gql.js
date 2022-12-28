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
              mp_callforprice_rule {
                  rule_id
                  name
                  rule_content
                  store_ids
                  customer_group_ids
                  action
                  url_redirect
                  quote_heading
                  quote_description
                  status
                  show_fields
                  required_fields
                  conditions_serialized
                  attribute_code
                  button_label
                  priority
                  to_date
                  created_at
                  rule_description
                  enable_terms
                  url_terms
                  from_date
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
              mp_label_data {
                  rule_id
                  priority
                  label_template
                  label_image
                  label
                  label_font
                  label_font_size
                  label_color
                  label_css
                  label_position
                  label_position_grid
                  same
                  list_template
                  list_image
                  list_label
                  list_font
                  list_font_size
                  list_css
                  list_position
                  list_position_grid
                  name
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
