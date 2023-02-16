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
export const GiftCardFragment = gql`
          fragment GiftCardFragment on ProductInterface {
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
                ...CallForPriceFragment
                ...ProductOfListFragment
                ...ProductLabelFragment
                ...GiftCardFragment
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
