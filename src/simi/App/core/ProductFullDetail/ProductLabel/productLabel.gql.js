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
                product_label {
                    name
                    image
                    image_data {
                        left
                        top
                        width
                        height
                        widthOrigin
                        heightOrigin
                        angle
                    }
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
