import { useCallback, useMemo, useState } from 'react';
import { useQuery } from '@apollo/client';
import { useWindowSize } from '@magento/peregrine';
import mergeOperations from '@magento/peregrine/lib/util/shallowMerge';
import { mapConfig } from '../utils';

import DEFAULT_OPERATIONS from './amMegaMenu.ggl';

const megaMenuEnabled =
    window.SMCONFIGS &&
    window.SMCONFIGS.plugins &&
    window.SMCONFIGS.plugins.SM_ENABLE_MEGA_MENU &&
    parseInt(window.SMCONFIGS.plugins.SM_ENABLE_MEGA_MENU) === 1;

export const useMegaMenu = (props = {}) => {
    const windowSize = useWindowSize();
    const [openCategoryIds, setOpenCategoryIds] = useState(new Set([]));

    const operations = mergeOperations(DEFAULT_OPERATIONS, props.operations);
    const { getAmMegaMenuConfig, getAmMegaMenuItems } = operations;

    const { data: storeConfigData } = useQuery(getAmMegaMenuConfig, {
        fetchPolicy: 'no-cache',
        skip: !megaMenuEnabled
        // nextFetchPolicy: 'cache-first'
    });
    const { loading, error, data } = useQuery(getAmMegaMenuItems, {
        fetchPolicy: 'no-cache',
        skip: !megaMenuEnabled
        // nextFetchPolicy: 'cache-first'
    });
    const { amMegaMenuAll } = data || {};
    const { items } = amMegaMenuAll || {};

    const config = useMemo(() => {
        const { storeConfig } = storeConfigData || {};

        return storeConfig ? mapConfig({ ...storeConfig }) : {};
    }, [storeConfigData]);

    const {
        ammegamenu_general_enabled,
        ammegamenu_general_show_icons,
        ammegamenu_general_mobile_template,
        ammegamenu_color_color_template,
        ammegamenu_color_main_menu_background,
        ammegamenu_color_toggle_icon_color,
        ammegamenu_color_main_menu_text,
        ammegamenu_general_hamburger_enabled,
        ammegamenu_general_sticky,
        ammegamenu_color_current_category_color,
        ammegamenu_color_submenu_text
    } = config;

    const isMobile = windowSize.innerWidth <= 1024;
    const isEnabledMegaMenu = ammegamenu_general_enabled === true;

    const isShowIcons =
        ammegamenu_general_show_icons === 'desktopAndMobile' ||
        (!isMobile && ammegamenu_general_show_icons === 'desktop') ||
        (isMobile && ammegamenu_general_show_icons === 'mobile');

    const isShowHamburgerBtn = isMobile || ammegamenu_general_hamburger_enabled;

    const amRootStyle =
        isEnabledMegaMenu && ammegamenu_color_color_template !== 'blank'
            ? {
                  '--am-mega-menu-root-bg': ammegamenu_color_main_menu_background,
                  '--am-mega-menu-toggle-color': ammegamenu_color_toggle_icon_color,
                  '--am-mega-menu-text-color': ammegamenu_color_main_menu_text,
                  '--am-mega-menu-position': ammegamenu_general_sticky
                      ? 'sticky'
                      : 'relative',
                  '--am-mega-menu-toggle-display': !isShowHamburgerBtn
                      ? 'none'
                      : undefined,
                  '--am-mega-menu-active-color': ammegamenu_color_current_category_color,
                  '--am-mega-menu-submenu-text-color': ammegamenu_color_submenu_text
              }
            : null;

    const toggleAction = useCallback(
        catId => {
            setOpenCategoryIds(prevOpenCategoryIds => {
                const nextOpenCategoryIds = new Set(prevOpenCategoryIds);
                const rootItems =
                    items &&
                    items
                        .filter(({ parent_id }) => !parent_id)
                        .map(({ id }) => id);

                if (!prevOpenCategoryIds.has(catId)) {
                    if (!isMobile || rootItems.includes(catId)) {
                        nextOpenCategoryIds.clear();
                    }

                    nextOpenCategoryIds.add(catId);
                } else {
                    nextOpenCategoryIds.delete(catId);
                }

                return nextOpenCategoryIds;
            });
        },
        [setOpenCategoryIds, isMobile, items]
    );

    const toggleActionMobile = useCallback(
        catId => {
            setOpenCategoryIds(prevOpenCategoryIds => {
                const nextOpenCategoryIds = new Set(prevOpenCategoryIds);
                // const rootItems =
                //     items &&
                //     items
                //         .filter(({ parent_id }) => !parent_id)
                //         .map(({ id }) => id);

                if (!prevOpenCategoryIds.has(catId)) {
                    nextOpenCategoryIds.add(catId);
                } else {
                    nextOpenCategoryIds.delete(catId);
                }

                return nextOpenCategoryIds;
            });
        },
        []
    )

    return {
        loading,
        error,
        isEnabledMegaMenu,
        isMobile,
        hamburgerView: ammegamenu_general_mobile_template,
        isShowIcons,
        config,
        allItems: items,
        amRootStyle,
        openCategoryIds,
        toggleAction,
        toggleActionMobile
    };
};
