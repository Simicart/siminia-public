import gql from 'graphql-tag';
const faqsEnabled =
    window.SMCONFIGS &&
    window.SMCONFIGS.plugins &&
    window.SMCONFIGS.plugins.SM_ENABLE_FAQS &&
    parseInt(window.SMCONFIGS.plugins.SM_ENABLE_FAQS) === 1;

export const FaqHomePage = faqsEnabled
    ? gql`
          fragment FaqHomePage on MpMageplazaFaqsConfigOutput {
              faq_home_page {
                  category_column
                  design_style
                  enabled
                  layout
                  limit_question
                  link
                  question_style
                  route
                  seo {
                      meta_description
                      meta_keyword
                      meta_robot
                      meta_title
                  }
                  title
              }
          }
      `
    : '';

export const GET_HOME_PAGE = gql`
    query MpMageplazaFaqsGetConfig {
        MpMageplazaFaqsGetConfig {
            ...FaqHomePage
        }
    }
    ${FaqHomePage}
`;

export const SearchBox = faqsEnabled
    ? gql`
          fragment SearchBox on MpMageplazaFaqsGeneralConfigOutput {
              search_box {
                  description
                  enabled
                  title
              }
          }
      `
    : '';

export const GET_SEARCH_BOX = gql`
    query MpMageplazaFaqsGetConfig {
        MpMageplazaFaqsGetConfig {
            general {
                ...SearchBox
            }
        }
    }
    ${SearchBox}
`;

export const FaqsCategoryList = faqsEnabled
    ? gql`
          fragment FaqsCategoryList on MpMageplazaFaqsCategoryListOutput {
              total_count
              items {
                  category_id
                  name
                  description
                  store_ids
                  icon
                  url_key
                  articles {
                      total_count
                      items {
                          article_id
                          name
                          author_name
                          url_key
                      }
                      pageInfo {
                          pageSize
                      }
                  }
              }
              pageInfo {
                  pageSize
              }
          }
      `
    : '';

export const GET_CATEGORY_LIST = gql`
    query MpMageplazaFaqsCategoryList($urlKey: String) {
        MpMageplazaFaqsCategoryList(filter: { url_key: { eq: $urlKey } }) {
            ...FaqsCategoryList
        }
    }
    ${FaqsCategoryList}
`;

export const FaqsGetArticles = gql`
    fragment FaqsGetArticles on MpMageplazaFaqsArticlesOutput {
        items {
            __typename
            article_id
            name
            article_content
            created_at
            views
            positives
            negatives
        }
    }
`;
export const GET_ARTICLE_BY_URL = gql`
    query($urlKey: String!) {
        MpMageplazaFaqsGetArticles(filter: { url_key: { eq: $urlKey } }) {
			...FaqsGetArticles
        }
    }
	${FaqsGetArticles}
`;

export const ADD_HELPFUL = gql`
    mutation($isHelpful: Boolean!, $articleId: Int!) {
        MpMageplazaFaqsAddHelpful(
            input: { articleId: $articleId, isHelpful: $isHelpful }
        )
    }
`;
