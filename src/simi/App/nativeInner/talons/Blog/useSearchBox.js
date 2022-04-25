import { useState } from 'react';
import { GET_SEARCH_BLOG_POST } from './Blog.gql'
import { useQuery } from '@apollo/client';

export const useSearchBox = props => {
    const [query, setQuery] = useState('')
    const {
        data: blogData,
        loading: blogLoading
    } = useQuery(GET_SEARCH_BLOG_POST,
        {
            variables: {
                query: `%${query}%`
            },
            skip: !query
        }
    )

    return {
        blogData,
        blogLoading,
        query,
        setQuery
    }
}