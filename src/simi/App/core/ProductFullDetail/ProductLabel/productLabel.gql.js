import { gql } from '@apollo/client';
const productLabelEnabled =
    window.SMCONFIGS &&
    window.SMCONFIGS.plugins &&
    window.SMCONFIGS.plugins.SM_ENABLE_PRODUCT_LABEL &&
    parseInt(window.SMCONFIGS.plugins.SM_ENABLE_PRODUCT_LABEL) === 1;

const GET_PRODUCT_LABEL = gql`
    query getProductLabel ($urlKey: String!) {
        products(filter: { url_key: { eq: $urlKey } }) {
            items {
                ${
                    productLabelEnabled
                        ? `
                mp_label_data {
                    rule_id
                    priority
                    label_template
                    label_image
                    label
                    label_font
                    label_font_size
                    label_color
                    label_css
                    label_position
                    label_position_grid
                    same
                    list_template
                    list_image
                    list_label
                    list_font
                    list_font_size
                    list_css
                    list_position
                    list_position_grid
                    name
                }
                
                `
                        : `sku`
                }
               
              
        
            }}
    }
`;
export default {
    getProductLabel: GET_PRODUCT_LABEL
};
