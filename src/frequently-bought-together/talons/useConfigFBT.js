import { useQuery, gql } from '@apollo/client'

const GET_CONFIG_FBT = gql`
query getConfigFBT {
    GetConfigFBT {
      active
      active_countdown
      btn_cart
      btn_cart_bg
      btn_cart_cl
      btn_continue_bg
      btn_continue_cl
      btn_text_cart
      btn_text_continue
      btn_text_viewcart
      btn_text_wishlist
      btn_viewcart_bg
      btn_viewcart_cl
      btn_wishlist
      btn_wishlist_bg
      btn_wishlist_cl
      continue_button
      countdown_time
      display_list
      item_on_slide
      item_popup_slide
      limit_products
      mini_cart
      mini_checkout
      popup_btn_cart_bg
      popup_btn_cart_cl
      popup_btn_text_cart
      preview
      product_price
      show_curent_product
      show_price
      show_review
      slide_auto
      slide_popup_auto
      slide_popup_speed
      slide_speed
      sng_cart
      sort_item_type
      start_date
      title_of_list
    }
  }  
`

const fbtEnabled =
    window.SMCONFIGS &&
    window.SMCONFIGS.plugins &&
    window.SMCONFIGS.plugins.SM_ENABLE_FREQUENTLY_BOUGHT_TOGETHER &&
    parseInt(window.SMCONFIGS.plugins.SM_ENABLE_FREQUENTLY_BOUGHT_TOGETHER) === 1

const useConfigFBT = () => {
    const configFBT = useQuery(GET_CONFIG_FBT, {
        fetchPolicy: 'network-only',
        nextFetchPolicy: 'cache-and-network',
        skip: fbtEnabled === 0
    })

    return configFBT
}

export default useConfigFBT