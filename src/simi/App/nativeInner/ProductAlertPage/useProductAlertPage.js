import {gql, useQuery} from "@apollo/client";
import {useEffect} from "react";

// TODO: split this into 2?
const getCustomerSubscriptionQuery = gql`
query{
  customer{
    mp_product_alert{
      out_of_stock(pageSize: 100){
        items{
          product_id
          status
          subscribe_updated_at
          subscriber_id
          website_id
          product_data{
            name
            sku
            product_url
            product_image_url
          }
        }
        pageInfo{
          currentPage
          hasNextPage
          hasPreviousPage
        }
        total_count
      }
      product_price(pageSize: 100){
        items{
          product_id
          status
          subscribe_updated_at
          subscriber_id
          website_id
          product_data{
            name
            sku
            product_url
            product_image_url
          }
        }
        pageInfo{
          currentPage
          hasNextPage
          hasPreviousPage
        }
        total_count
      }
    }
  }
}`

export const useProductAlertPage = (props) => {
    const setLoading = props ? props.setLoading : null

    const {data, refetch: reInitialize, loading} = useQuery(getCustomerSubscriptionQuery, {
        fetchPolicy: "no-cache",
        onCompleted: () => {
            setLoading(false)
        },
        onError: () => setLoading(false)
    })

    useEffect(() => {
        if (loading) {
            setLoading(true)
        }
    }, [loading])

    const shouldShowStockTable = (
        !!data
        && !!data.customer
        && !!data.customer.mp_product_alert
        && !!data.customer.mp_product_alert.out_of_stock
        && data.customer.mp_product_alert.out_of_stock.total_count > 0)

    const shouldShowPriceTable = (
        !!data
        && !!data.customer
        && !!data.customer.mp_product_alert
        && !!data.customer.mp_product_alert.product_price
        && data.customer.mp_product_alert.product_price.total_count > 0)


    return {
        customerData: data,
        loading: !!loading,
        reInitialize: reInitialize,
        shouldShowStockTable: shouldShowStockTable,
        shouldShowPriceTable: shouldShowPriceTable
    }
}