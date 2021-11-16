import React from 'react'
import { configColor } from "src/simi/Config";
import ExpandLess from "src/simi/BaseComponents/Icon/TapitaIcons/ArrowUp";
import ExpandMore from "src/simi/BaseComponents/Icon/TapitaIcons/ArrowDown";
import Identify from 'src/simi/Helper/Identify';
import Loading from 'src/simi/BaseComponents/Loading/ReactLoading'
import { cateUrlSuffix } from 'src/simi/Helper/Url';

class SubCate extends React.Component {
    state = { open: false };

    handleToggleMenu = (id) => {
        const { classes } = this.props
        const cate = $('.cate-' + id);
        $('.sub-cate-' + id).slideToggle('fast');
        cate.find(`.${classes['cate-icon']}`).toggleClass('hidden')
        if (!this.state.open)
            this.setState(state => ({ open: !state.open }));
    };

    shouldComponentUpdate(nextProps, nextState) {
        return nextState.open !== this.state.open
    }

    renderSubMenu = (item) => {
        const { classes, openLocation } = this.props
        let sub_cate = [];
        if (item) {
            if (item.children !== null) {
                const obj = this;
                sub_cate = item.children.map(function (item, key) {
                    const cate_name = <div className={classes["menu-cate-name-item"]} >{Identify.__(item.name)}</div>;
                    const url_path = (item.url_path && item.url_path !== '/') ? "/" + item.url_path + cateUrlSuffix() : "/products.html?cat=" + item.id
                    const hasChild = (item.children && item.children.length > 0)
                    const location = {
                        pathname: url_path,
                        state: {
                            cate_id: item.id,
                            hasChild: hasChild,
                            name: item.name
                        }
                    };
                    return !hasChild ? obj.renderMenuItem(cate_name, location) : <SubCate key={key} item={item} cate_name={cate_name} classes={classes} openLocation={openLocation} />;
                });
            }
        }
        return <div style={{ marginLeft: 15 }}>{sub_cate}</div>
    };

    renderMenuItem = (cate_name, location) => {
        const { classes } = this.props
        return (
            <div
                role="presentation"
                className={`${classes['cate-child-item']}`}
                key={Identify.randomString(5)}
                style={{ color: configColor.menu_text_color }}
                onClick={() => this.props.openLocation(location)}>
                <div style={{ color: configColor.menu_text_color }}>
                    {cate_name}
                </div>
            </div>
        )
    }

    renderCate = () => {
        const { cate_name, item, classes } = this.props
        let sub_cate = null;
        if (item instanceof Object && item.children instanceof Array && item.children.length > 0) {
            sub_cate = (
                <div className={`sub-cate-${item.id}`} component="div" style={{ display: 'none' }}>
                    {!this.state.open ?
                        <Loading divStyle={{ marginTop: 0 }} /> : this.renderSubMenu(this.props.item)
                    }
                </div>
            )
        }
        return (
            <div>
                <div
                    className={`cate-${item.id} ${classes['cate-parent-item']}`}
                    role="presentation"
                    style={{ color: configColor.menu_text_color }}
                    onClick={() => this.handleToggleMenu(item.id)}>
                    <div style={{ color: configColor.menu_text_color }}>
                        {cate_name}
                    </div>
                    <div className={`${classes["cate-icon"]} hidden`}>
                        <ExpandLess className={`${classes["cate-icon"]} hidden`} color={configColor.menu_text_color} />
                    </div>
                    <div className={`${classes["cate-icon"]}`}>
                        <ExpandMore className={classes['cate-icon']} color={configColor.menu_text_color} />
                    </div>
                </div>
                {sub_cate}
            </div>

        )
    }

    render() {
        return this.renderCate()
    }
}
export default SubCate
