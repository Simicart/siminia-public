import React, { useCallback } from 'react';
import { mergeClasses } from '@magento/venia-ui/lib/classify';
import { number, shape, string } from 'prop-types';
import defaultClasses from './menuItem.module.css';
import MenuLink from './menuLink';
import SubMenuContent from './SubMenuContent';
import { useAmMegaMenuContext } from '../../context';
import { isEnableMenuItem } from '../../utils';

const PATCH_TO_IMG = '/media/amasty/megamenu/submenu_background_image/';

const widthTypes = {
  0: 'fullWidth',
  1: 'autoWidth',
  2: 'customWidth'
};

const MenuItem = props => {
  const { level, width, view, id, status } = props;
  const {
    isMobile,
    isShowIcons,
    config,
    toggleAction,
    openCategoryIds
  } = useAmMegaMenuContext();
  const isMainLevel = level === 1;

  const hoverHandler = useCallback(() => {
    if (isMainLevel && view === 'topMenu') {
      toggleAction(id);
    }
  }, [isMainLevel, toggleAction, view, id]);

  if (!isEnableMenuItem(status, isMobile)) {
    return null;
  }

  const classes = mergeClasses(defaultClasses, props.classes);
  const isOpen = openCategoryIds && openCategoryIds.has(id);
  const openClass = isOpen ? classes.open : '';
  const levelClass = isMainLevel ? classes.main : classes.child;

  const widthClass = isMainLevel
    ? classes[widthTypes[width] || widthTypes[0]]
    : '';

  const rootClass = [
    classes.root,
    openClass,
    classes[view],
    levelClass,
    widthClass
  ].join(' ');

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
            view === 'topMenu' && ammegamenu_color_submenu_background_image
              ? `url("${PATCH_TO_IMG +
                  ammegamenu_color_submenu_background_image}")`
              : ammegamenu_color_submenu_background_color
        }
      : null;

  return (
    <li
      className={rootClass}
      style={amStyle}
      onMouseEnter={hoverHandler}
      onMouseLeave={hoverHandler}
      onFocus={() => void 0}
    >
      <MenuLink
        {...props}
        toggleAction={toggleAction}
        isOpen={isOpen}
        isShowIcons={isShowIcons}
      />
      <SubMenuContent
        {...props}
        isMobile={isMobile}
        isOpen={isOpen}
        isShowIcons={isShowIcons}
        classes={{
          root: classes.subContainerRoot,
          main: classes.subContainerMain
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
