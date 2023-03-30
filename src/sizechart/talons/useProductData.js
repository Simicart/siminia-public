import { useQuery, gql } from '@apollo/client';
import { useState } from 'react'

const GET_PRODUCT_DATA = gql`
query getProductData($filter: String) {
    products(filter: {sku: {eq: $filter}}) {
      items {
        id
        review_count
      }
    }
}
`

const useProductData = (filter) => {
  const [id, setId] = useState(0)
  const [reviewCount, setReviewCount] = useState(0)

  useQuery(GET_PRODUCT_DATA, {
    variables: { filter },
    onCompleted: (data) => {
      setId(data.products.items[0].id)
      setReviewCount(data.products.items[0].review_count)
    }
  })
  return {
    id,
    reviewCount
  }
}

export default useProductData