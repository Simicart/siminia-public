import gql from 'graphql-tag';
const faqsEnabled =
    window.SMCONFIGS &&
    window.SMCONFIGS.plugins &&
    window.SMCONFIGS.plugins.SM_ENABLE_FAQS &&
    parseInt(window.SMCONFIGS.plugins.SM_ENABLE_FAQS) === 1;

export const GET_FAQ_CONFIG = gql`
    query GetFaqConfig {
        bssFaqsConfig {
            add_awesome
            add_roboto
            background_color
            enable
            faq_sort_by
            full_question_product_page
            helpful
            most_faq_number
            most_faq_show
            question_display
            question_per_category
            related_faq_show
            require_login_vote
            search
            social_button
            tag
            unhelpful
        }
    }
`;
export const GET_CALCULATOR_VOTE_API = gql`
    query getCalculatorVoteApi($faq_id: Int) {
        calculatorVoteApi(faq_id: $faq_id) {
            faq_id
            faq_title
            help_full
            un_help_full
        }
    }
`;
export const FaqFragment = faqsEnabled
    ? gql`
          fragment FaqFragment on getMainContent {
              faq {
                  answer
                  category_id
                  customer
                  faq_id
                  frontend_label
                  helpful_vote
                  is_check_all_product
                  is_most_frequently
                  is_show_full_answer
                  limit_link
                  product_id
                  related_faq_id
                  short_answer
                  store_id
                  tag
                  time
                  title
                  unhelpful_vote
                  url_key
                  use_real_vote_data
              }
          }
      `
    : '';

export const CategoryFragment = faqsEnabled
    ? gql`
          fragment CategoryFragment on sidebarOutPut {
              category {
                  color
                  faq_category_id
                  faq_id
                  faq_id_to_show
                  faq_sort
                  frontend_label
                  image
                  limit_link
                  show_in_mainpage
                  title
                  title_color
                  url_key
              }
          }
      `
    : '';

export const MostFaqFragment = faqsEnabled
    ? gql`
          fragment MostFaqFragment on sidebarOutPut {
              most_faq {
                  answer
                  category_id
                  customer
                  faq_id
                  frontend_label
                  helpful_vote
                  is_check_all_product
                  is_most_frequently
                  is_show_full_answer
                  limit_link
                  product_id
                  related_faq_id
                  short_answer
                  store_id
                  tag
                  time
                  title
                  unhelpful_vote
                  url_key
                  use_real_vote_data
              }
          }
      `
    : '';
export const GET_QUESTION_BY_URL = gql`
    query GetQuestionByUrl($url: String) {
        questionUrl(url: $url) {
            answer
            category_id
            customer
            faq_id
            frontend_label
            helpful_vote
            is_check_all_product
            is_most_frequently
            is_show_full_answer
            limit_link
            product_id
            related_faq_id
            short_answer
            store_id
            tag
            time
            title
            unhelpful_vote
            url_key
            use_real_vote_data
        }
    }
`;
export const GET_SEARCH_FAQS = gql`
    query GetSearchFaqs(
        $key_word: String
        $category_id: Int
        $sort_by: String
    ) {
        searchFaqs(
            key_word: $key_word
            category_id: $category_id
            sort_by: $sort_by
        ) {
            answer
            category_id
            customer
            faq_id
            frontend_label
            helpful_vote
            is_check_all_product
            is_most_frequently
            is_show_full_answer
            limit_link
            product_id
            related_faq_id
            short_answer
            store_id
            tag
            time
            title
            unhelpful_vote
            url_key
            use_real_vote_data
        }
    }
`;

export const GET_TAG_FAQS = gql`
    query GetTagFaqs($tag_list: String, $sort_by: String) {
        tagFaqs(tag_list: $tag_list, sort_by: $sort_by) {
            result {
                answer
                category_id
                customer
                faq_id
                frontend_label
                helpful_vote
                is_check_all_product
                is_most_frequently
                is_show_full_answer
                limit_link
                product_id
                related_faq_id
                short_answer
                store_id
                tag
                time
                title
                unhelpful_vote
                url_key
                use_real_vote_data
            }
            sidebar {
                ...CategoryFragment
                ...MostFaqFragment
                tag
            }
        }
    }
    ${CategoryFragment}
    ${MostFaqFragment}
`;

export const GET_MAIN_PAGE_FAQS = gql`
    query GetMainPageFaqs {
        mainPageFaqs {
            main_content {
                color
                ...FaqFragment
                faq_category_id
                faq_id
                faq_id_to_show
                faq_sort
                frontend_label
                image
                limit_link
                show_in_mainpage
                title
                title_color
                url_key
            }
            sidebar {
                ...CategoryFragment
                ...MostFaqFragment
                tag
            }
        }
    }
    ${FaqFragment}
    ${CategoryFragment}
    ${MostFaqFragment}
`;

export const GET_CATEGORY_BY_URL = gql`
    query GetCategoryByUrl($url: String) {
        categoryUrl(url: $url) {
            main_content {
                color
                ...FaqFragment
                faq_category_id
                faq_id
                faq_id_to_show
                faq_sort
                frontend_label
                image
                limit_link
                show_in_mainpage
                title
                title_color
                url_key
            }
            sidebar {
                ...CategoryFragment
                ...MostFaqFragment
                tag
            }
        }
    }
    ${FaqFragment}
    ${CategoryFragment}
    ${MostFaqFragment}
`;

export const ADD_VOTE_FAQ = gql`
    mutation addVoteFaq($type: String, $faqId: Int!) {
        voteFaqs(type: $type, faq_id: $faqId) {
            help_full
            message
            un_help_full
        }
    }
`;
export const ASK_A_QUESTION = gql`
    mutation askAQuestion(
        $question: String
        $customer: String
        $productId: Int
    ) {
        submitFaqs(
            question: $question
            product_id: $productId
            customer: $customer
        ) {
            help_full
            message
            un_help_full
        }
    }
`;

export const FaqDetailFragment = faqsEnabled
    ? gql`
          fragment FaqDetailFragment on ProductInterface {
              faqs {
                  answer
                  category_id
                  customer
                  faq_id
                  frontend_label
                  helpful_vote
                  is_check_all_product
                  is_most_frequently
                  is_show_full_answer
                  limit_link
                  product_id
                  related_faq_id
                  short_answer
                  store_id
                  tag
                  time
                  title
                  unhelpful_vote
                  url_key
                  use_real_vote_data
              }
          }
      `
    : '';

export const GET_FAQ_INFO_PRODUCT_DETAIL = gql`
    query getProductDetailForProductPage($urlKey: String!) {
        products(filter: { url_key: { eq: $urlKey } }) {
            items {
                name
                ...FaqDetailFragment
            }
        }
    }
    ${FaqDetailFragment}
`;
