import {gql, useQuery} from "@apollo/client";

const locationIdQuery = gql`
query{
  MpStoreLocatorGetLocationId
}
`

export const useStoreLocationId = (props) => {
    const {data, loading, error} = useQuery(locationIdQuery)

    return {
        id: !!data ? data.MpStoreLocatorGetLocationId : null,
        loading: loading,
        error: error
    }
};