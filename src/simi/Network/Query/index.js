import { useQuery, useMutation } from '@apollo/client';
export { useLazyQuery as simiUseLazyQuery } from '@apollo/client'
export { useQuery as simiUseQuery }
export { useMutation as simiUseMutation }
export {
    useAwaitQuery as simiUseAwaitQuery
} from '@magento/peregrine/lib/hooks/useAwaitQuery';

export const Simiquery = props => {
    const { query } = props
    const modOptions = {}
    const variables = props.variables ? props.variables : {}
    modOptions.variables = variables
    modOptions.fetchPolicy = props.fetchPolicy ? props.fetchPolicy : 'cache-first'
    const { data, loading, error } = useQuery(query, modOptions)
    return props.children({ loading, error, data })
}

export const SimiMutation = props => {
    const { mutation, children } = props
    const [functionToCall, { data, error }] = useMutation(mutation);

    const modedFunctionToCall = options => {
        let modOptions = {}
        const variables = (options && options.variables) ? options.variables : {}
        modOptions.variables = variables
        modOptions = { ...modOptions, ...options }
        functionToCall(modOptions)
    }
    return children(modedFunctionToCall, { data, error })
}