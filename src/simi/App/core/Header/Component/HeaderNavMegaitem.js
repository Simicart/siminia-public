import React from 'react'
import { Link } from 'src/drivers';
import {cateUrlSuffix} from 'src/simi/Helper/Url'

const NavMegaitem = props => {
    if (props.itemAndChild) {
        const { classes } = props
        const rootItem = props.itemAndChild
        if (rootItem.children) {
            rootItem.children.sort((a, b)=> a.position - b.position)
            const childCats = rootItem.children.map((item, index) => {
                if (!item.name || !item.include_in_menu)
                    return ''
                let subChildLevel2 = []
                if (item.children) {
                    subChildLevel2 = item.children.map((itemlv2, indexlv2)=> {
                        if (!itemlv2.name)
                            return ''
                        const path = itemlv2.url_path?('/' + itemlv2.url_path + cateUrlSuffix()):itemlv2.link
                        const location = {
                            pathname: path,
                            state: {}
                        }
                        if (itemlv2.children)
                            location.state.category_page_id = itemlv2.entity_id

                        return (
                            <Link 
                                className={`${classes["mega-lv2-name"]} mega-lv2-name`}
                                key={indexlv2} 
                                to={location}>
                                {itemlv2.name}
                            </Link>
                        )
                    })
                }
                const location = {
                    pathname: item.url_path?('/' + item.url_path + cateUrlSuffix()):item.link,
                    state: {}
                }
                return (
                    <div key={index}>
                        <Link
                            className={`${classes["mega-lv1-name"]} mega-lv2-name`}
                            to={location}>
                            {item.name}
                        </Link>
                        <div className={`${classes["mega-lv1-sub-cats"]}  mega-lv1-sub-cats`}>
                            {subChildLevel2}
                        </div>
                    </div>
                )
            })
            const childCatGroups = []
            const chunkSize = Math.ceil(childCats.length/3)
            for (var i = 0; i < childCats.length; i+= chunkSize){
                childCatGroups.push(
                    <div key={i} style={{width: 173, marginRight: 82}}>
                        {childCats.slice(i,i+chunkSize)}
                    </div>
                );
            }

            return (
                <div className={`${classes["nav-mega-item"]} nav-mega-item`} id={props.id}>
                    <div 
                    role="presentation"
                    className={`${classes["mega-content"]} mega-content`}
                    onClick={() => {
                        if (props.toggleMegaItemContainer)
                            props.toggleMegaItemContainer()}
                        }>
                        {childCatGroups}
                    </div>
                    {
                        rootItem.image_url && (
                            <div className={`${classes["mega-image"]} mega-image hidden-xs`}>
                                <img src={rootItem.image_url} alt={rootItem.image_url}/>
                            </div>
                        )
                    }
                </div>
            )
        }
    }
    return ''
}
export default NavMegaitem