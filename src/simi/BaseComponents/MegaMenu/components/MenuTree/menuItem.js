import React, { useCallback, useEffect, useState } from 'react';
import { mergeClasses } from '@magento/venia-ui/lib/classify';
import { number, shape, string } from 'prop-types';
import defaultClasses from './menuItem.module.css';
import MenuLink from './menuLink';
import SubMenuContent from './SubMenuContent';
import { useAmMegaMenuContext } from '../../context';
import { isEnableMenuItem } from '../../utils';
import { useAppContext } from '@magento/peregrine/lib/context/app';

const PATCH_TO_IMG = '/media/amasty/megamenu/submenu_background_image/';

const MenuItem = props => {
    const { level, width, view, id, status } = props;
    const {
        isMobile,
        isShowIcons,
        config,
        toggleAction,
        toggleActionMobile,
        openCategoryIds
    } = useAmMegaMenuContext();

    const [, { closeDrawer }] = useAppContext();

    const [changePage, setChangePage] = useState(false);

    const isMainLevel = level === 1;

    const hoverHandler = useCallback(
        e => {
            if (isMainLevel && view === 'topMenu' && !changePage && !isMobile) {
                toggleAction(id);
            }
        },
        [isMainLevel, toggleAction, view, id, changePage, isMobile]
    );

    const clickHandler = useCallback(
        e => {
            if (isMainLevel && view === 'topMenu' && isMobile) {
                toggleActionMobile(id);
            }
        },
        [isMainLevel, toggleAction, view, id, changePage, isMobile]
    );

    const onNavigation = useCallback(() => {
        setChangePage(true);
        toggleAction(id);
        isMobile && closeDrawer();
    }, [id, isMobile]);

    useEffect(() => {
        if (changePage) {
            setTimeout(() => {
                setChangePage(false);
            }, 1000);
        }
    }, [changePage]);

    if (!isEnableMenuItem(status, isMobile)) {
        return null;
    }

    const classes = mergeClasses(defaultClasses, props.classes);
    const isOpen = openCategoryIds && openCategoryIds.has(id);
    const openClass = isOpen ? classes.open : '';
    const levelClass = isMainLevel ? classes.main : classes.child;

    // const widthClass = isMainLevel
    //   ? classes[widthTypes[width] || widthTypes[0]]
    //   : '';

    const rootClass = [classes.root, openClass, classes[view], levelClass].join(
        ' '
    );

    const {
        ammegamenu_color_submenu_text,
        ammegamenu_color_submenu_background_color,
        ammegamenu_color_color_template,
        ammegamenu_color_submenu_background_image,
        ammegamenu_color_main_menu_text_hover,
        ammegamenu_color_submenu_text_hover,
        ammegamenu_color_main_menu_background_hover
    } = config;

    const amStyle =
        isMainLevel && ammegamenu_color_color_template !== 'blank'
            ? {
                  '--am-mega-menu-submenu-text-color': ammegamenu_color_submenu_text,
                  '--am-mega-menu-submenu-text-hover-color': ammegamenu_color_submenu_text_hover,
                  '--am-mega-menu-submenu-bg-color': ammegamenu_color_submenu_background_color,
                  '--am-mega-menu-text-hover-color': ammegamenu_color_main_menu_text_hover,
                  '--am-mega-menu-item-bg-hover': ammegamenu_color_main_menu_background_hover,
                  '--am-mega-menu-submenu-bg-image':
                      view === 'topMenu' &&
                      ammegamenu_color_submenu_background_image
                          ? `url("${PATCH_TO_IMG +
                                ammegamenu_color_submenu_background_image}")`
                          : ammegamenu_color_submenu_background_color
              }
            : null;

    const menuItemNode = document.getElementById('menu-item-' + id);
    const menuItemContainerNode = document.getElementById(
        'menu-item-container-' + id
    );
    const menuTreeNode = document.getElementById('menu-tree');
    const style = { pointerEvents: 'none' };
    let subContainerMainClass = classes.subContainerMain;
    if (isOpen) {
        if (!isMobile) {
            if (amStyle && menuItemNode && menuTreeNode) {
                const menuTreeHeight = menuTreeNode.clientHeight;
                const offsetTop = menuItemNode.offsetTop;
                const positionMenuItem = offsetTop + menuItemNode.clientHeight;
                const percent = positionMenuItem / menuTreeHeight;
                if (percent > 0) {
                    style.top = `calc(${100 * percent}% - 2px)`;
                }
            }
        } else {
            if (menuItemContainerNode) {
                const menuHeight = menuItemContainerNode.lastChild.clientHeight;
                style.height = menuHeight;
            }
        }
        style.pointerEvents = 'all';
        subContainerMainClass = classes.subContainerMainOpen;
    }

    return (
        <li
            id={'menu-item-' + id}
            className={rootClass}
            style={amStyle}
            onMouseEnter={hoverHandler}
            onMouseLeave={hoverHandler}
            onClick={clickHandler}
            onFocus={() => void 0}
        >
            <MenuLink
                {...props}
                toggleAction={toggleAction}
                isOpen={isOpen}
                onNavigate={onNavigation}
                isShowIcons={isShowIcons}
                isMainTitle={true}
            />
            <SubMenuContent
                {...props}
                menuItemId={id}
                isMobile={isMobile}
                isOpen={isOpen}
                isShowIcons={isShowIcons}
                hideIcon={true}
                style={style}
                onNavigation={onNavigation}
                classes={{
                    root: classes.subContainerRoot,
                    main: subContainerMainClass
                }}
            />
        </li>
    );
};

MenuItem.propTypes = {
    id: string,
    view: string,
    width: number,
    level: number,
    classes: shape({
        root: string
    })
};

MenuItem.defaultProps = {
    level: 1
};

export default MenuItem;
