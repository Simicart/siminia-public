import { useQuery, gql } from '@apollo/client';

const GET_LIST_TIMEZONE = gql`
    query getListTimezone {
        bssGetListTimezone {
            value
            label
        }
    }
`

const useTimezoneData = (filter) => {
    const timezoneDetails = useQuery(GET_LIST_TIMEZONE, {
       fetchPolicy: 'network-only',
       nextFetchPolicy: 'cache-and-network',
    })
    return timezoneDetails
}
  
export default useTimezoneData