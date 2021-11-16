import React from 'react';
import Identify from 'src/simi/Helper/Identify';
import { cateUrlSuffix } from 'src/simi/Helper/Url';
import { configColor } from 'src/simi/Config';
import SubCate from "./Subcate";
import ExpandLess from "src/simi/BaseComponents/Icon/TapitaIcons/ArrowUp";
import ExpandMore from "src/simi/BaseComponents/Icon/TapitaIcons/ArrowDown";
import { bool, func, object } from 'prop-types';

class CateTree extends React.Component {
    static propTypes = {
        classes: object,
        hideHeader: bool,
        defaultExpandedRoot: bool,
        handleMenuItem: func.isRequired,
    };

    shouldComponentUpdate() {
        return !this.renderedOnce
    }

    openLocation = (location) => {
        this.props.handleMenuItem(location);
    }

    renderTitleMenu = (title) => {
        const classes = this.props
        return (
            <div className={classes["menu-cate-name-item"]}
                style={{ color: configColor.menu_text_color }}>{Identify.__(title)}</div>
        )
    }

    renderTreeMenu = (data) => {
        const { classes } = this.props
        if (data) {
            const obj = this;
            data.children.sort((a, b) => a.position - b.position)
            const categories = data.children.map(function (item, key) {
                if (!item.name || !item.include_in_menu)
                    return ''
                const cate_name = <div className={classes["root-menu"]} >{obj.renderTitleMenu(item.name)}</div>;
                const hasChild = (item.children && item.children.length > 0)
                const location = {
                    pathname: item.url_path !== undefined ? "/" + item.url_path + cateUrlSuffix() : "/products.html?cat=" + item.id,
                    state: {
                        cate_id: item.id,
                        hasChild: hasChild,
                        name: item.name
                    }
                };
                return !hasChild ?
                    obj.renderMenuItem(cate_name, location) : <SubCate
                        key={key}
                        classes={classes}
                        cate_name={cate_name}
                        item={item} parent={this}
                        openLocation={this.openLocation.bind(this)}
                    />;
            }, this);
            return (
                <div style={{
                    padding: 0,
                    direction: Identify.isRtl() ? 'rtl' : 'ltr',
                }}>
                    <div>
                        {categories}
                    </div>
                    {this.renderJs()}
                </div>
            )
        }
        return '';
    };

    renderMenuItem = (cate_name, location) => {
        const { classes } = this.props
        return (
            <div
                role="presentation"
                key={Identify.randomString(10)}
                style={{ color: configColor.menu_text_color }}
                onClick={() => this.openLocation(location)}
                className={`${classes['cate-child-item']}`}>
                <div style={{ color: configColor.menu_text_color }} >{cate_name}</div>
            </div>
        )
    }

    handleToggleMenu = (id) => {
        const { classes } = this.props
        const cate = $('.cate-' + id);
        $('.sub-cate-' + id).slideToggle('fast');
        cate.find(`.${classes['cate-icon']}`).toggleClass('hidden')
    };

    renderJs = () => {
        $(function () {
            if (Identify.isRtl()) {
                $('div.menu-cate-name-item').each(function () {
                    const parent = $(this).parent();
                    const margin = parent.css('margin-left');
                    parent.css({
                        'margin-left': 0,
                        'margin-right': margin
                    })
                });
            }
        })
    }

    render() {
        const { props } = this
        const { classes, hideHeader, defaultExpandedRoot } = props

        const storeConfig = Identify.getStoreConfig();
        if (!storeConfig || !storeConfig.categories || !storeConfig.categories.items || !storeConfig.categories.items.length)
            return <div></div>
        this.renderedOnce = true
        const primarytext = hideHeader ? '' : (
            <div className={classes["menu-content"]} id="cate-tree">
                <div className={classes["menu-title"]}
                    style={{ color: configColor.menu_text_color }}>
                    {Identify.__('Categories')}</div>
                <div className={`${classes["cate-icon"]} ${defaultExpandedRoot ? '' : 'hidden'}`}>
                    <ExpandLess className={`${classes["cate-icon"]} ${defaultExpandedRoot ? '' : 'hidden'}`} color={configColor.menu_text_color} />
                </div>
                <div className={`${classes["cate-icon"]} ${defaultExpandedRoot ? 'hidden' : ''}`}>
                    <ExpandMore className={`${classes['cate-icon']} ${defaultExpandedRoot ? 'hidden' : ''}`} color={configColor.menu_text_color} />
                </div>
            </div>
        )
        return (
            <div >
                <div
                    role="presentation"
                    className={`${classes["cate-root"]} ${classes["cate-parent-item"]}`}
                    onClick={() => this.handleToggleMenu('root')}
                    style={{ color: configColor.menu_text_color }}>
                    <div style={{ color: configColor.menu_text_color }}>
                        {primarytext}
                    </div>
                </div>
                <div className="sub-cate-root" style={{ display: defaultExpandedRoot ? 'block' : 'none' }}>
                    {this.renderTreeMenu(storeConfig.categories.items[0])}
                </div>
            </div>
        )
    }
}

export default CateTree
