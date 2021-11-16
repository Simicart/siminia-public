import { simiUseQuery as useQuery } from 'src/simi/Network/Query';

export const useHome = props => {
    const {
        queries: { getHomeQuery }
    } = props;
    
    const { data, error, loading } = useQuery(getHomeQuery)
    
    return {
        data,
        error,
        loading
    }
}
