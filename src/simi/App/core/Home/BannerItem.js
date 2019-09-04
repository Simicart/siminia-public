import React from 'react'
import {Colorbtn} from 'src/simi/BaseComponents/Button'
import {productUrlSuffix, cateUrlSuffix} from 'src/simi/Helper/Url';

const BannerItem = props => {
    const { history, item, isPhone } = props;

    const renderBannerTitle = item => {
        let action = () => {}
        if (parseInt(item.type, 10) === 1) {
            //product detail
            if (item.url_key) {
                action = () => history.push(item.url_key + productUrlSuffix());
            }
        } else if(parseInt(item.type, 10) === 2){
            //category
            if (item.url_path) {
                action = () => history.push(item.url_path + cateUrlSuffix());
            }
        } else {
            action = (e) => {
                e.preventDefault();
                window.open(item.banner_url);
            }
        }

        return(
            <div role="presentation" className="banner-title" onClick={action}>
                <div className="bannner-content">
                    <div className="title">{item.banner_title}</div>
                </div>
                <Colorbtn 
                    text={"Show"}
                    className="banner-action"/>
            </div>
        )
    }
    
    const w = '100%';
    const h = '100%';
    let img = '';
    if(isPhone) {
        if(item.banner_name_tablet) {
            img = item.banner_name_tablet;
        } else if(item.banner_name) {
            img = item.banner_name
        }
    } else {
        if(item.banner_name) {
            img = item.banner_name;
        } else if(item.banner_name_tablet) {
            img = item.banner_name_tablet
        }
    }
    if(!img) return null

    return (
        <div 
            style={{position: 'relative', maxWidth: w, minHeight: h}} 
            className="banner-item"
        >
            {renderBannerTitle(item)}
            <img className="img-responsive" width={w} height={h} src={img} alt={item.banner_title}/>
        </div>
    )
}

export default BannerItem;