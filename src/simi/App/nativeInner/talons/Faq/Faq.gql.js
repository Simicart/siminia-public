import gql from 'graphql-tag';

export const GET_SEARCH_BOX = gql`
	query MpMageplazaFaqsGetConfig {
	  MpMageplazaFaqsGetConfig {
	    general {
	      search_box {
	        description
			enabled
			title
	      }
	    }
	  }
	}
`

export const GET_HOME_PAGE = gql`
	query MpMageplazaFaqsGetConfig {
	  MpMageplazaFaqsGetConfig{
	    faq_home_page {
	      enabled
	      title
	      layout
	      category_column
	      question_style
	      limit_question
	      seo {
	        meta_title
	        meta_description
	        meta_keyword
	        meta_robot
	      }
	    }
	  }
	}
`

export const GET_CATEGORY_LIST = gql`
	query MpMageplazaFaqsCategoryList ($urlKey: String) {
	    MpMageplazaFaqsCategoryList(filter: {url_key: {eq: $urlKey}}){
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
	}
`

export const GET_ARTICLE_BY_URL = gql`
	query ($urlKey: String!) {
	  MpMageplazaFaqsGetArticles(filter: {url_key: {eq: $urlKey}}){
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
	}
`

export const ADD_HELPFUL = gql`
	mutation ($isHelpful: Boolean!, $articleId: Int!) {
		MpMageplazaFaqsAddHelpful(input: {
			articleId: $articleId
			isHelpful: $isHelpful
		})
	}
`