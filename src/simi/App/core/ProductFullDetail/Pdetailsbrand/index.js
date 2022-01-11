import React from 'react';
import resourceUrl from '@magento/peregrine/lib/util/makeUrl';
import classes from './pdetailsbrand.module.css';
import { Util } from '@magento/peregrine';
import { Link } from 'react-router-dom';
import { fullPageLoadingIndicator } from '@magento/venia-ui/lib/components/LoadingIndicator';
import { useBrandInfo } from '../../ShopByBrand/talons/useBrandInfo';
const { BrowserPersistence } = Util;
const storage = new BrowserPersistence();

const Pdetailsbrand = props => {
    const {url_key} = props.product
    const {
        brandInfo,
        brandInfoLoading,
        derivedErrorMessage
    } = useBrandInfo({ url_key:url_key });
    if(!brandInfo){
        return ''
    }
    const {items} = brandInfo.products
    if (brandInfoLoading)
        return fullPageLoadingIndicator;
    if (derivedErrorMessage)
        return <div className={classes.brandError}>{derivedErrorMessage}</div>;
    
    if (!items || !items[0].mpbrand || !items[0].mpbrand.url_key )
        return ''
    
    const brandConfiguration = storage.getItem('simiBrandConfiguration');
    
    if (!brandConfiguration || !brandConfiguration.show_brand_info)
        return ''
    
    const {
        show_brand_info, logo_width_on_product_page, logo_height_on_product_page
    } = brandConfiguration;
    
    const { mpbrand } = items[0]
    return (
        <section className={classes.pdetailsBrandSection}>
             <Link to={resourceUrl(`/brands/${mpbrand.url_key}.html`)} className={classes.pdetailsBrandInfo}>
                 {(show_brand_info === 'logo') ?
                    <div style={{
                            backgroundImage: `url("${mpbrand.image}")`,
                            width:  50,
                            height: 50
                        }}
                        className={classes.pdetailsBrandImage}>
                    </div> : ''
                }
                {
                    (show_brand_info === 'name') ?
                        <div className={classes.pdetailsBrandLabel}>{mpbrand.value}</div>
                        : ''
                }
            </Link>
        </section>
    )
}
export default Pdetailsbrand