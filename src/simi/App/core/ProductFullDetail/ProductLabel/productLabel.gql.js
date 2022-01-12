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
                
                `
                        : ``
                }
               
              
        
            }}
    }
`;
export default {
    getProductLabel: GET_PRODUCT_LABEL
};
