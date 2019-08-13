import Identify from 'src/simi/Helper/Identify'

const simicartConfig = Identify.getAppDashboardConfigs();
const config = simicartConfig ? simicartConfig['app-configs'][0] : null;

export const configColor = {
    key_color: config ? config['theme']['key_color'] : window.DEFAULT_COLORS.key_color,
    top_menu_icon_color: config ? config['theme']['top_menu_icon_color'] : window.DEFAULT_COLORS.top_menu_icon_color,
    button_background: config ? config['theme']['button_background'] : window.DEFAULT_COLORS.button_background,
    button_text_color: config ? config['theme']['button_text_color'] : window.DEFAULT_COLORS.button_text_color,
    menu_background: config ? config['theme']['menu_background'] : window.DEFAULT_COLORS.menu_background,
    menu_text_color: config ? config['theme']['menu_text_color'] : window.DEFAULT_COLORS.menu_text_color,
    menu_line_color: config ? config['theme']['menu_line_color'] : window.DEFAULT_COLORS.menu_line_color,
    menu_icon_color: config ? config['theme']['menu_icon_color'] : window.DEFAULT_COLORS.menu_icon_color,
    search_box_background: config ? config['theme']['search_box_background'] : window.DEFAULT_COLORS.search_box_background,
    search_text_color: config ? config['theme']['search_text_color'] : window.DEFAULT_COLORS.search_text_color,
    app_background: config ? config['theme']['app_background'] : window.DEFAULT_COLORS.app_background,
    content_color: config ? config['theme']['content_color'] : window.DEFAULT_COLORS.content_color,
    image_border_color: config ? config['theme']['image_border_color'] : window.DEFAULT_COLORS.image_border_color,
    line_color: config ? config['theme']['line_color'] : window.DEFAULT_COLORS.line_color,
    price_color: config ? config['theme']['price_color'] : window.DEFAULT_COLORS.price_color,
    special_price_color: config ? config['theme']['special_price_color'] : window.DEFAULT_COLORS.special_price_color,
    icon_color: config ? config['theme']['icon_color'] : window.DEFAULT_COLORS.icon_color,
    section_color: config ? config['theme']['section_color'] : window.DEFAULT_COLORS.section_color,
    status_bar_background: config ? config['theme']['status_bar_background'] : window.DEFAULT_COLORS.status_bar_background,
    status_bar_text: config ? config['theme']['status_bar_text'] : window.DEFAULT_COLORS.status_bar_text,
    loading_color: config ? config['theme']['loading_color'] : window.DEFAULT_COLORS.loading_color,
    splash_screen_color : window.DEFAULT_COLORS.splash_screen_color ? window.DEFAULT_COLORS.splash_screen_color : '#fff',
    loading_splash_screen_color : window.DEFAULT_COLORS.loading_splash_screen_color ? window.DEFAULT_COLORS.loading_splash_screen_color : '#000',
};
