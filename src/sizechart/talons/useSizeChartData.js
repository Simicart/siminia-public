import { useQuery, gql } from '@apollo/client';
import { size } from 'lodash';
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
const sizeChartEnabled =
    window.SMCONFIGS &&
    window.SMCONFIGS.plugins &&
    window.SMCONFIGS.plugins.SM_ENABLE_SIZE_CHART &&
    parseInt(window.SMCONFIGS.plugins.SM_ENABLE_SIZE_CHART) === 1;

const useSizeChartData = ({id}) => {
    const [sizeChartData, setSizeChartData] = useState({})
    useQuery(GET_SIZE_CHART_DATA, {
      variables: { id },
      onCompleted: (data) => {
        setSizeChartData(data)
      },
      fetchPolicy: 'network-only',
      nextFetchPolicy: 'cache-and-network',
      skip: sizeChartEnabled === 0
    })
    return sizeChartData
}
  
  export default useSizeChartData