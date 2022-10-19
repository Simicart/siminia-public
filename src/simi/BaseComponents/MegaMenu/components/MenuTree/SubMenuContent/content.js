import React from 'react';
import { mergeClasses } from '@magento/venia-ui/lib/classify';
import { shape, string, number } from 'prop-types';
import Identify from 'src/simi/Helper/Identify';
import defaultClasses from './content.module.css';
import RichContent from '@magento/venia-ui/lib/components/RichContent';
import MenuLink from '../menuLink';

const widthTypes = {
    0: 'fullWidth',
    1: 'autoWidth',
    2: 'customWidth'
};

const Content = props => {
    const {
        hideIcon,
        hideChildCategories,
        subCategories,
        level,
        column_count,
        width,
        width_value,
        submenu_type,
        subcategories_position,
        isShowIcons,
        elementRef,
        elementStyle,
        onNavigation,
        menuItemId
    } = props;

    // const { onHover, activeId } = useSubMenuContent({ id });

    const classes = mergeClasses(defaultClasses, props.classes);

    let isShowSubCategories =
        Array.isArray(subCategories) &&
        subCategories.length &&
        !hideChildCategories;

    const links = isShowSubCategories
        ? subCategories.map(item => (
              <li key={item.id} className={classes.categoriesItem}>
                  <MenuLink
                      {...item}
                      level={level}
                      isShowIcons={isShowIcons}
                      hideIcon={hideIcon}
                      onNavigate={onNavigation}
                      isTitle={level === 1 ? true : false}
                  />
                  <Content
                      key={item.id}
                      level={level + 1}
                      {...item}
                      onNavigation={onNavigation}
                      hideChildCategories={level === 1 && submenu_type === 1}
                      isShowIcons={isShowIcons}
                  />
              </li>
          ))
        : null;

    let isContentAvailable = true;
    let content = props.content;
    if (!content) {
        isContentAvailable = false;
    } else if (content === '{{child_categories_content}}') {
        isContentAvailable = false;
    } else {
        let newContent = [];
        let parser = new DOMParser();
        let parsedHtml = parser.parseFromString(content, 'text/html');
        let divTags = parsedHtml.getElementsByTagName('div');
        if (typeof divTags === 'object' && divTags.length > 0) {
            for (let i in divTags) {
                const divTag = divTags[i];
                if (divTag && divTag.textContent) {
                    const word = divTag.textContent.trim();
                    if (word && word !== '{{child_categories_content}}') {
                        newContent.push(divTag.outerHTML);
                    }
                }
            }
        }
        if (newContent.length > 0) {
            newContent.join('');
            content = newContent;
        } else {
            isContentAvailable = false;
        }
    }

    const itemContent = isContentAvailable ? (
        <div
            className={classes.block}
            // style={{ display: id === activeId ? 'block' : 'none' }}
        >
            <RichContent html={content} hideCategories />
        </div>
    ) : null;

    if (!links && !itemContent) {
        return null;
    }

    const fullClass = [
        classes.root,
        level === 1 ? classes.main : classes.child,
        level === 1 ? classes[widthTypes[width] || widthTypes[0]] : '',
        Identify.isRtl() ? classes.rtl : ''
        // submenu_type === 0 && level === 1 ? classes.megaMenu : ''
    ].join(' ');

    const style = props.style ? props.style : {};
    if (width === 2 && width_value > 0) {
        style.width = width_value;
    }
    
    const categoriesStyle = {};
    let categoriesClass = classes.categoriesChild;
    if (level === 1 && subCategories) {
        categoriesClass = classes.categoriesMain + ' ';
        if (submenu_type === 0) {
            categoriesClass += classes.columnView;
            let columnCount = column_count || 4;
            if (columnCount <= 0) {
                columnCount = subCategories.length;
            } else if (columnCount >= 10) {
                columnCount = 10;
            }

            categoriesStyle.gridTemplateColumns = `repeat(${columnCount}, ${(1 /
                columnCount) *
                100}%)`;
        } else {
            if (subcategories_position === 1) {
                categoriesClass += classes.vertical;
            } else {
                categoriesClass += classes.horizontal;
                categoriesStyle.gridTemplateColumns = `repeat(${
                    subCategories.length
                }, ${(1 / subCategories.length) * 100}%)`;
            }
        }
    }

    // const positionClass = positions[subcategories_position];

    return (
        <div
            style={{ ...elementStyle, ...style }}
            ref={elementRef}
            className={fullClass}
        >
            <div id={'menu-item-container-' + menuItemId} className={classes.container}>
                {links && (
                    <ul style={categoriesStyle} className={categoriesClass}>
                        {links}
                    </ul>
                )}
                {itemContent ? (
                    <div className={classes.sidebar}>{itemContent}</div>
                ) : null}
            </div>
        </div>
    );
};

Content.propTypes = {
    subcategories_position: number,
    content: string,
    id: string,
    level: number,
    classes: shape({
        root: string
    })
};

Content.defaultProps = {
    subcategories_position: 1,
    level: 1,
    hideIcon: false
};

export default Content;
