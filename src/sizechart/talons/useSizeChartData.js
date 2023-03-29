import { useQuery, gql } from '@apollo/client';
import { useState } from 'react'

const GET_SIZE_CHART_DATA = gql`
query getSizeChartData($id: Int!) {
    sizeChartData(id: $id) {
      content
      display_popup
      storeConfig {
        isEnabled
        linkPopupText
        linkPopupColor
        icon
        product_tab_text
      }
      title
    }
  }
`

const useSizeChartData = ({id}) => {
    const [sizeChartData, setSizeChartData] = useState({})
    useQuery(GET_SIZE_CHART_DATA, {
      variables: { id },
      onCompleted: (data) => {
        setSizeChartData(data)
      },
      fetchPolicy: 'network-only',
      nextFetchPolicy: 'cache-and-network'
    })
    return sizeChartData
}
  
  export default useSizeChartData