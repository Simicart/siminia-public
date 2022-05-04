import gql from 'graphql-tag';
const megaMenuEnabled =
    window.SMCONFIGS &&
    window.SMCONFIGS.plugins &&
    window.SMCONFIGS.plugins.SM_ENABLE_MEGA_MENU &&
    parseInt(window.SMCONFIGS.plugins.SM_ENABLE_MEGA_MENU) === 1;

const megaMenuConfigFragment = megaMenuEnabled
    ? gql`
          fragment megaMenuConfigFragment on StoreConfig {
              store_code
              root_category_id
              ammegamenu_general_enabled
              ammegamenu_general_sticky
              ammegamenu_general_hamburger_enabled
              ammegamenu_general_mobile_template
              ammegamenu_general_show_icons
              ammegamenu_color_color_template
              ammegamenu_color_main_menu_background
              ammegamenu_color_main_menu_background_hover
              ammegamenu_color_main_menu_text
              ammegamenu_color_main_menu_text_hover
              ammegamenu_color_submenu_background_color
              ammegamenu_color_submenu_background_image
              ammegamenu_color_submenu_text
              ammegamenu_color_submenu_text_hover
              ammegamenu_color_current_category_color
              ammegamenu_color_toggle_icon_color
          }
      `
    : '';

const amMenuItemsFragment = megaMenuEnabled
    ? gql`
          fragment amMenuItemsFragment on Menu {
              items {
                  name
                  id
                  url
                  parent_id
                  width
                  column_count
                  content
                  has_active
                  is_active
                  is_category
                  is_parent_active
                  width_value
                  status
                  label
                  label_text_color
                  label_background_color
                  icon
                  submenu_type
                  subcategories_position
              }
          }
      `
    : '';

export const GET_AM_MEGAMENU_CONFIG = gql`
    query amMegaMenuConfig {
        storeConfig {
            ...megaMenuConfigFragment
        }
    }
    ${megaMenuConfigFragment}
`;

export const GET_AM_MEGAMENU_ITEMS = gql`
    query amMegaMenuAll {
        amMegaMenuAll {
            ...amMenuItemsFragment
        }
    }
    ${amMenuItemsFragment}
`;

export default {
    getAmMegaMenuConfig: GET_AM_MEGAMENU_CONFIG,
    getAmMegaMenuItems: GET_AM_MEGAMENU_ITEMS
};
