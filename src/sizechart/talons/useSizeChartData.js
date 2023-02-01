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
      }
      title
    }
  }
`

const useSizeChartData = ({id, sizeChartEnabled}) => {
    
  if(sizeChartEnabled) {
    const [sizeChartData, setSizeChartData] = useState({})
    const { data, loading, error }= useQuery(GET_SIZE_CHART_DATA, {
      variables: { id },
      onCompleted: (data) => {
        setSizeChartData(data)
      },
      fetchPolicy: 'network-only',
      nextFetchPolicy: 'cache-and-network'
    })
    return sizeChartData
  }
  else return null
}
  
  export default useSizeChartData