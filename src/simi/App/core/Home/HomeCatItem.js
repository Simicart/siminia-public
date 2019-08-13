import React from 'react'
import ArrowRight from 'src/simi/BaseComponents/Icon/TapitaIcons/ArrowLeft';
import {cateUrlSuffix} from 'src/simi/Helper/Url';

const HomeCatItem = props => {
    const {item, history, classes, isPhone} = props;

    const action = () => {
        if (item.url_path)
            history.push(item.url_path + cateUrlSuffix());
    }

    if(!item.simicategory_filename && !item.simicategory_filename_tablet) {
        return null;
    }

    let img = '';

    if(isPhone) {
        if(item.simicategory_filename_tablet) {
            img = item.simicategory_filename_tablet;
        } else {
            img = item.simicategory_filename;
        }
    } else {
        if(item.simicategory_filename) {
            img = item.simicategory_filename;
        } else {
            img = item.simicategory_filename_tablet;
        }
    }


    return (

        <div role="presentation" className={classes['home-cate-item']} onClick={() => action()}>
            <div className={"cate-img"}>
                <img src={img}
                     alt={item.simicategory_name}/>
            </div>
            <div className={classes["cate-title"]}>
                <div className={"--text"}>{item.simicategory_name}</div>
            </div>
            <div className={classes["cate-arrow"]}>
                <ArrowRight color="#fff" style={{width:60,height:60}}/>
            </div>
        </div>
    )
}

export default HomeCatItem