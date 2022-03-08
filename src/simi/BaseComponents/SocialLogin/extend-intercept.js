const { Targetables } = require('@magento/pwa-buildpack');

module.exports = targets => {
    const targetables = Targetables.using(targets);

    // Add search pro context provider
    const ContextProvider = targetables.reactComponent(
        '@magento/venia-ui/lib/components/App/contextProvider.js'
    );
    const AmSocialLoginProvider = ContextProvider.addImport(
        "AmSocialLoginProvider from '@simicart/siminia/src/simi/BaseComponents/SocialLogin/context'"
    );

    ContextProvider.insertBeforeSource(
        'const ContextProvider = ({ children }) => {',
        `contextProviders.push(${AmSocialLoginProvider});\n`
    );

    // Add Social Login classes to Account menu
    /*
    const AccountMenuComponent = targetables.reactComponent(
        '@magento/venia-ui/lib/components/AccountMenu/accountMenu.js'
    );
    const accountMenuClasses = AccountMenuComponent.addImport(
        "accountMenuClasses from '@simicart/siminia/src/simi/BaseComponents/SocialLogin/extendStyle/accountMenu.css'"
    );

    AccountMenuComponent.insertAfterSource(
        'useStyle(defaultClasses,',
        `${accountMenuClasses}, `
    )
        .setJSXProps('SignIn', { isPopup: '{true}' })
        .addJSXClassName(
            'div ref={ref} className={contentsClass}',
            'classes[talonProps.amPositionClass]'
        );

    */

    // Add Social Login component to Sign In
    const SignInComponent = targetables.reactComponent(
        '@magento/venia-ui/lib/components/SignIn/signIn.js'
    );

    const SocialLogin = SignInComponent.addImport(
        "SocialLogin from '@simicart/siminia/src/simi/BaseComponents/SocialLogin/components/SocialAuthentication/socialAuthentication'"
    );

    SignInComponent.surroundJSX(
        'div className={classes.root}',
        'React.Fragment'
    ).insertAfterJSX(
        'div className={classes.root}',
        `<${SocialLogin} mode="popup" showCreateAccount={showCreateAccount} isPopup={props.isPopup} />`
    );

    // Add Social Login component to Create account
    /*
    const CreateAccountComponent = targetables.reactComponent(
        '@magento/venia-ui/lib/components/CreateAccount/createAccount.js'
    );

    const SocialLoginReg = CreateAccountComponent.addImport(
        "SocialLogin from '@simicart/siminia/src/simi/BaseComponents/SocialLogin/components/SocialAuthentication/socialAuthentication'"
    );

    CreateAccountComponent.surroundJSX('Form', 'React.Fragment').insertAfterJSX(
        'Form',
        `<${SocialLoginReg} mode="popup" />`
    );*/
    const CreateAccountComponent = targetables.reactComponent(
        '@simicart/siminia/src/simi/App/core/Customer/CreateAccountPage/CreateAccount.js'
    );

    const SocialLoginReg = CreateAccountComponent.addImport(
        "SocialLogin from '@simicart/siminia/src/simi/BaseComponents/SocialLogin/components/SocialAuthentication/socialAuthentication'"
    );

    CreateAccountComponent.surroundJSX('Form', 'React.Fragment').insertAfterJSX(
        'Form',
        `<${SocialLoginReg} mode="popup" />`
    );

    // Add Social Login component to Cart page
    /*
    const CartComponent = targetables.reactComponent(
        '@magento/venia-ui/lib/components/CartPage/cartPage.js'
    );

    const SocialLoginCart = CartComponent.addImport(
        "SocialLogin from '@simicart/siminia/src/simi/BaseComponents/SocialLogin/components/SocialAuthentication/socialAuthentication'"
    );

    CartComponent.appendJSX(
        'div className={classes.root}',
        `<${SocialLoginCart} mode="checkout_cart" />`
    );
    */
};
