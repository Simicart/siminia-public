import React from 'react';
import resourceUrl from '@magento/peregrine/lib/util/makeUrl';
import classes from './pdetailsbrand.module.css';
import { Util } from '@magento/peregrine';
import { Link } from 'react-router-dom';
const { BrowserPersistence } = Util;
const storage = new BrowserPersistence();

const Pdetailsbrand = props => {
    if (!props.product || !props.product.mpbrand )
        return ''
    const brandConfiguration = storage.getItem('simiBrandConfiguration');
    if (!brandConfiguration || !brandConfiguration.show_brand_info)
        return ''
    const {
        show_brand_info, logo_width_on_product_page, logo_height_on_product_page
    } = brandConfiguration;
    const { mpbrand } = props.product
    return (
        <section className={classes.pdetailsBrandSection}>
             <Link to={resourceUrl(`/`)} className={classes.pdetailsBrandInfo}>
                 {(show_brand_info === 'logo') ?
                    <div style={{
                            backgroundImage: `url("${mpbrand.image}")`,
                            width:  50,
                            height: 50
                        }}
                        className={classes.pdetailsBrandImage}>
                    </div> : ''
                }
            </Link>
        </section>
    )
}
export default Pdetailsbrand