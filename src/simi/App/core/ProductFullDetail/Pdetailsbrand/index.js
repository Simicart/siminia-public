import React from 'react';
import resourceUrl from '@magento/peregrine/lib/util/makeUrl';
import classes from './pdetailsbrand.module.css';
import { Link } from 'react-router-dom';
import { fullPageLoadingIndicator } from '@magento/venia-ui/lib/components/LoadingIndicator';
import { useBrandInfo } from '../../ShopByBrand/talons/useBrandInfo';

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

    const { mpbrand } = items[0]

    return (
        <section className={classes.pdetailsBrandSection}>
             <Link to={resourceUrl(`/brands/${mpbrand.url_key}.html`)} className={classes.pdetailsBrandInfo}>
                <div style={{
                        backgroundImage: `url("${mpbrand.image}")`,
                        width:  71,
                        height: 30
                    }}
                    className={classes.pdetailsBrandImage}>
                </div>
            </Link>
        </section>
    )
}
export default Pdetailsbrand