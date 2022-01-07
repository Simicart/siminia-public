import { gql } from '@apollo/client';


const GET_PRODUCT_LABEL = gql `
    query getProductLabel ($urlKey: String!) {
        products(filter: { url_key: { eq: $urlKey } }) {
            items {
                mp_label_data {
                    list_position
                    list_position_grid
                    label_image
                    rule_id
                    label_font
                    label_font_size
                    label_color
                    label_template
                    label
                  	list_css
                  	priority
                }
               
              
        
            }}
    }
`
export default {
    getProductLabel: GET_PRODUCT_LABEL
};