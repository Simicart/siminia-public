import {useQuery, gql, useMutation} from "@apollo/client";

const removeSubscriptionMutation = gql`
mutation($id: Int!){
  MpProductAlertSubscriberDelete(input: {id: $id})
}
`

export const useAlertTableEntry = (props) => {
    const id = props ? props.id : null
    const reInitialize = props ? props.reInitialize : null
    const setLoading = props ? props.setLoading : null


    const [removeSubscription, {loading}] = useMutation(removeSubscriptionMutation, {
        variables: {
            id: id
        },
        onCompleted: () => {
            if (reInitialize) {
                reInitialize().then(()=>setLoading(false))
            }
        },
        onError: () => {
            setLoading(false)
        }
    })

    const removeSubscriptionFunction = () => {
        setLoading(true)
        removeSubscription()
    }

    return {
        removeSubscription: removeSubscriptionFunction,
        loading: loading
    }
}