import gql from 'graphql-tag';
const blogEnabled =
    window.SMCONFIGS &&
    window.SMCONFIGS.plugins &&
    window.SMCONFIGS.plugins.SM_ENABLE_BETTER_BLOG &&
    parseInt(window.SMCONFIGS.plugins.SM_ENABLE_BETTER_BLOG) === 1;

const BlogConfigsFragment = blogEnabled
    ? gql`
          fragment BlogConfigsFragment on ConfigsOutput {
              general {
                  display_author
                  display_style
                  font_color
                  name
                  toplinks
              }
          }
      `
    : '';
export const GET_BLOG_CONFIG = gql`
    query mpBlogConfigs {
        mpBlogConfigs{
            ...BlogConfigsFragment
        }
    }
    ${BlogConfigsFragment}
`;

const PageInfoFragment = blogEnabled
    ? gql`
          fragment PageInfoFragment on PageInfo {
              pageSize
              currentPage
              hasNextPage
              hasPreviousPage
              startPage
              endPage
          }
      `
    : '';

const CategoryFragment = blogEnabled
    ? gql`
          fragment CategoryFragment on Category {
              category_id
              name
              url_key
              description
              store_ids
              enabled
              meta_title
              meta_keywords
              meta_description
              meta_robots
              parent_id
              path
              position
              level
              children_count
              created_at
              updated_at
              import_source
          }
      `
    : '';

const TagFragment = blogEnabled
    ? gql`
          fragment TagFragment on Tag {
              tag_id
              name
              description
              store_ids
              enabled
              url_key
              meta_title
              meta_keywords
              meta_description
              meta_robots
              created_at
              updated_at
              import_source
          }
      `
    : '';

const TopicFragment = blogEnabled
    ? gql`
          fragment TopicFragment on Topic {
              topic_id
              name
              description
              store_ids
              enabled
              url_key
              meta_title
              meta_keywords
              meta_description
              meta_robots
              created_at
              updated_at
              import_source
          }
      `
    : '';

const ProductFragment = blogEnabled
    ? gql`
          fragment ProductFragment on Post {
              products {
                  items {
                      attribute_set_id
                      created_at
                      entity_id
                      has_options
                      required_options
                      sku
                      type_id
                      updated_at
                  }
                  total_count
              }
          }
      `
    : '';

const PostFragment = blogEnabled
    ? gql`
          fragment PostFragment on Post {
              post_id
              name
              short_description
              image
              enabled
              url_key
              in_rss
              allow_comment
              meta_title
              meta_keywords
              meta_description
              meta_robots
              created_at
              updated_at
              author_id
              author_url
              author_url_key
              author_name
              publish_date
              import_source
              layout
              view_traffic
          }
      `
    : '';

export const GET_BLOG_POSTS = gql`
    query mpBlogPosts(
        $action: String!
        $filter: PostsFilterInput
        $authorName: String
        $tagName: String
        $topicId: Int
        $categoryId: Int
        $categoryKey: String
        $postId: Int
        $pageSize: Int
        $currentPage: Int
    ) {
        mpBlogPosts(
            action: $action
            filter: $filter
            authorName: $authorName
            tagName: $tagName
            topicId: $topicId
            categoryId: $categoryId
            categoryKey: $categoryKey
            postId: $postId
            pageSize: $pageSize
            currentPage: $currentPage
        ) {
            items {
                ...PostFragment
                categories {
                    total_count
                    items {
                        ...CategoryFragment
                    }
                }
            }
            total_count
            pageInfo {
                ...PageInfoFragment
            }
        }
    }
    ${PostFragment}
    ${PageInfoFragment}
    ${CategoryFragment}
`;

export const GET_SEARCH_BLOG_POST = gql`
    query mpBlogPosts($query: String!) {
        mpBlogPosts(
            action: "get_post_list"
            filter: { name: { like: $query } }
        ) {
            items {
                post_id
                name
                short_description
                image
                enabled
                url_key
                publish_date
            }
        }
    }
`;

export const GET_BLOG_CATEGORIES = gql`
    query mpBlogCategories {
        mpBlogCategories(action: "get_category_list", pageSize: 299) {
            items {
                ...CategoryFragment
            }
        }
    }
    ${CategoryFragment}
`;

export const GET_BLOG_TAGS = gql`
    query mpBlogTags {
        mpBlogTags {
            items {
                ...TagFragment
                posts {
                    items {
                        post_id
                    }
                }
            }
        }
    }
    ${TagFragment}
`;

export const GET_BLOG_TOPICS = gql`
    query mpBlogTopics {
        mpBlogTopics {
            items {
                ...TopicFragment
            }
        }
    }
    ${TopicFragment}
`;

export const GET_SIDEBAR_BLOG_POSTS = gql`
    query mpBlogPosts($sortBy: String, $pageSize: Int) {
        mpBlogPosts(
            action: "get_post_list"
            sortBy: $sortBy
            pageSize: $pageSize
        ) {
            items {
                post_id
                name
                short_description
                image
                enabled
                url_key
                publish_date
            }
        }
    }
`;

export const GET_CATE_BY_URL_KEY = gql`
    query mpBlogCategories($url_key: String!) {
        mpBlogCategories(
            action: "get_category_list"
            filter: { url_key: { eq: $url_key } }
        ) {
            items {
                ...CategoryFragment
            }
        }
    }
    ${CategoryFragment}
`;

export const GET_TOPIC_BY_URL_KEY = gql`
    query mpBlogTopics($url_key: String!) {
        mpBlogTopics(filter: { url_key: { eq: $url_key } }) {
            items {
                ...TopicFragment
            }
        }
    }
    ${TopicFragment}
`;

export const GET_TAG_BY_URL_KEY = gql`
    query mpBlogTags($url_key: String!) {
        mpBlogTags(filter: { url_key: { eq: $url_key } }) {
            items {
                ...TagFragment
            }
        }
    }
    ${TagFragment}
`;

export const GET_BLOG_POST_BY_URL_KEY = gql`
    query mpBlogPosts($url_key: String!) {
        mpBlogPosts(
            action: "get_post_list"
            filter: { url_key: { eq: $url_key } }
        ) {
            items {
                ...PostFragment
                post_content
                categories {
                    total_count
                    items {
                        ...CategoryFragment
                    }
                }
                tags {
                    total_count
                    items {
                        ...TagFragment
                    }
                }
                topics {
                    total_count
                    items {
                        ...TopicFragment
                    }
                }
                ...ProductFragment
                posts {
                    total_count
                    items {
                        ...PostFragment
                        categories {
                            total_count
                            items {
                                ...CategoryFragment
                            }
                        }
                    }
                }
            }
        }
    }
    ${PostFragment}
    ${CategoryFragment}
    ${TagFragment}
    ${TopicFragment}
    ${ProductFragment}
`;

export const GET_BLOG_ARCHIVE = gql`
    query mpBlogMonthlyArchive {
        mpBlogMonthlyArchive {
            items {
                label
                quantity
                items{
                    ...PostFragment
                }
            }
            total_count
        }
    }
    ${PostFragment}
`;

export const GET_PRODUCTS_BY_SKUS = gql`
    query getProductsBySku($skus: [String], $pageSize: Int!) {
        products(filter: { sku: { in: $skus } }, pageSize: $pageSize) {
            items {
                id
                name
                sku
                small_image {
                    url
                }
                url_key
                url_suffix
                price {
                    regularPrice {
                        amount {
                            value
                            currency
                        }
                    }
                }
            }
            total_count
        }
    }
`;
