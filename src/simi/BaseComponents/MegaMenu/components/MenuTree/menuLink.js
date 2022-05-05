import React, { useCallback } from 'react';
import { mergeClasses } from '@magento/venia-ui/lib/classify';
import { number, shape, string } from 'prop-types';
import ToggleTrigger from './toggleTrigger';
import defaultClasses from './menuLink.module.css';
import { useLocation, Link } from 'react-router-dom';
import { useAppContext } from '@magento/peregrine/lib/context/app';

const LinkComponent = props => {
  const { to, children } = props;

  if (to && to.startsWith('http')) {
    return (
      <a {...props} href={to}>
        {children}
      </a>
    );
  }

  return (
    <Link {...props} to={`/${to}`}>
      {children}
    </Link>
  );
};

const MenuLink = props => {
  const {
    id,
    url,
    name,
    label,
    label_text_color,
    label_background_color,
    icon,
    subCategories,
    toggleAction,
    view,
    level,
    isOpen,
    isShowIcons,
    onNavigate
  } = props;

  const { pathname } = useLocation();
  const [, { closeDrawer }] = useAppContext();

  const handleNavigate = useCallback(() => {
    if (onNavigate) {
      return onNavigate();
    }

    return closeDrawer();
  }, [closeDrawer, onNavigate]);

  const classes = mergeClasses(defaultClasses, props.classes);

  const labelContent = label ? (
    <span
      style={{
        '--am-mega-menu-label-color': label_text_color,
        '--am-mega-menu-label-bg': label_background_color
      }}
      className={classes.label}
    >
      {label}
    </span>
  ) : null;

  const iconContent =
    icon && isShowIcons ? (
      <figure
        className={classes.icon}
        style={{
          WebkitMaskImage: `url("${icon}")`,
          maskImage: `url("${icon}")`,
          backgroundImage: icon.includes('jpg') ? `url("${icon}")` : undefined
        }}
      />
    ) : null;

  const toggleBtn =
    Array.isArray(subCategories) && subCategories.length ? (
      <ToggleTrigger
        classes={props.classes}
        action={() => toggleAction(id)}
        isOpen={isOpen}
      />
    ) : null;

  const levelClass = classes[`level${level}`];
  const activeClass =
    url && pathname.replace('.html', '').includes(url.replace('.html', ''))
      ? classes.active
      : '';
  const rootClass = [classes.root, levelClass, classes[view], activeClass].join(
    ' '
  );

  return (
    <div className={rootClass}>
      <LinkComponent
        className={classes.menuLink}
        onClick={handleNavigate}
        to={url}
      >
        {iconContent}

        <span className={classes.title}>{name}</span>

        {labelContent}
      </LinkComponent>

      {toggleBtn}
    </div>
  );
};

MenuLink.propTypes = {
  classes: shape({
    root: string
  }),
  url: string,
  name: string,
  label: string,
  label_text_color: string,
  label_background_color: string,
  icon: string,
  level: number
};

MenuLink.defaultProps = {
  level: 1
};

export default MenuLink;
