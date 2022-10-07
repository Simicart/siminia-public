import { gql } from '@apollo/client';

// export const RESOLVE_URL = gql`
//     query ResolveURL($url: String!) {
//         route(url: $url) {
//             relative_url
//             redirect_code
//             type
//             ... on CmsPage {
//                 identifier
//             }
//             ... on ProductInterface {
//                 id
//                 sku
//                 __typename
//             }
//             ... on CategoryInterface {
//                 id
//             }
//         }
//     }
// `;

export const RESOLVE_URL = gql`
    query ResolveURL($url: String!) {
        urlResolver(url: $url) {
            entity_uid
            relative_url
            redirectCode
            type
        }
    }
`;

export default {
    resolveUrlQuery: RESOLVE_URL
};
