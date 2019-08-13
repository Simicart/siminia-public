/*
type id MUST be equal to index + 1
*/
export const itemTypes = [
    {
        'type_id' : 1,
        'icon' :  'fa fa-home',
        'name' : 'Home',
        'svg_icon' : 'Homepage',
        'url' : '/',
    },
    {
        'type_id' : 2,
        'icon' :  'fa fa-shopping-cart',
        'name' : 'Cart', 
        'svg_icon' : 'Cart',
        'url' : '/cart.html',
    },
    {
        'type_id' : 3,
        'icon' :  'fa fa-user',
        'name' : 'My Account',
        'post_str' : '***',  
        'svg_icon' : 'User',
        'url' : '/account.html',
        'required_logged_in' : true
    },
    {
        'type_id' : 4,
        'icon' :  'fa fa-sign-in',
        'name' : 'Login',
        'post_str' : '***',  
        'svg_icon' : 'User',
        'url' : '/login.html',
        'required_logged_out' : true
    },
    {
        'type_id' : 5,
        'icon' :  'fa fa-sign-out',
        'name' : 'Logout',
        'post_str' : '***',  
        'svg_icon' : 'Logout',
        'url' : '/logout.html',
        'required_logged_in' : true
    },
    {
        'type_id' : 6,
        'icon' :  'fa fa-address-book',
        'name' : 'Address Book',
        'svg_icon' : 'AddressBook',
        'url' : '/customer/address',
        'required_logged_in' : true
    },
    {
        'type_id' : 7,
        'icon' :  'fa fa-shopping-bag',
        'name' : 'Order History',
        'svg_icon' : 'ClockCricle',
        'url' : '/sales/order/history',
        'required_logged_in' : true
    },
    {
        'type_id' : 8,
        'icon' :  'fa fa-heart',
        'name' : 'Wish List',
        'post_str' : '*',  
        'svg_icon' : 'Heart-shape-outline',
        'url' : '/wishlist.html',
        'required_logged_in' : true
    },
    {
        'type_id' : 9,
        'icon' :  'fa fa-bell',
        'name' : 'Notification',
        'disabled' : true,
    },
    {
        'type_id' : 10,
        'icon' :  'fa fa-star',
        'name' : 'My Rewards',
        'post_str' : '*', 
        'svg_icon' : 'Reward',
        'url' : '/rewardpoint',
        'required_logged_in' : true
    },
    {
        'type_id' : 11,
        'icon' :  'fa fa-download',
        'name' : 'Downloadable Products',
        'svg_icon' : 'Download',
        'url' : '/downloadable/customer/products',
        'required_logged_in' : true
    },
    {
        'type_id' : 12,
        'icon' :  'fa fa-list',
        'name' : 'Page Builder Pages',
        'svg_icon' : 'List',
    },
    {
        'type_id' : 13,
        'icon' :  'fa fa-tag',
        'name' : 'Category',
        'svg_icon' : 'Grid',
    },
    {
        'type_id' : 14,
        'icon' :  'fa fa-tags',
        'name' : 'Category Tree',
        'post_str' : '**',  
        'svg_icon' : 'List',
    },
    {
        'type_id' : 15,
        'icon' :  'fa fa-wechat',
        'name' : 'Contact Us',
        'post_str' : '*',  
        'url' : '/contacts',
        'svg_icon' : 'Chat',
    },
    {
        'type_id' : 16,
        'icon' :  'fa fa-qrcode',
        'name' : 'QR/Barcode Scanner',
        'post_str' : '*',  
        'url' : '/qrbarcode',
        'svg_icon' : 'Qr-code',
    },
    {
        'type_id' : 17,
        'icon' :  'fa fa-map-marker',
        'name' : 'Store Locator',
        'post_str' : '*', 
        'url' : '/storelocator', 
        'svg_icon' : 'Find-store',
    },
    {
        'type_id' : 18,
        'icon' :  'fa fa-globe',
        'name' : 'Open URL',
        'svg_icon' : 'Worldwide',
    },
    {
        'type_id' : 19,
        'icon' :  'fa fa-gift',
        'name' : 'Gift Cards',
        'url' : '/products-list/giftcard', 
        'svg_icon' : 'Gift',
    },
    {
        'type_id' : 20,
        'icon' :  'fa fa-navicon',
        'name' : 'Menu',
        'post_str' : '*****',
        'svg_icon' : 'Ellipsis',
    },
    {
        'type_id' : 21,
        'icon' :  'fa fa-gear',
        'name' : 'Settings',
    },
    {
        'type_id' : 22,
        'icon' :  'fa fa-search',
        'name' : 'Search',
        'url' : '/search.html', 
        'svg_icon' : 'Search',
    },
    {
        'type_id' : 23,
        'icon' :  'fa fa-gift',
        'name' : 'My Gift Cards',
        'url' : '/customer/my-credit', 
        'required_logged_in' : true,
        'svg_icon' : 'Gift',
    },
    {
        'type_id' : 24,
        'icon' :  'fa fa-code',
        'name' : 'Customization Page',
        'post_str' : '****',  
    },
]