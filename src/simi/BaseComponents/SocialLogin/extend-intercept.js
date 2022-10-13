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
    const NativeInnerSignInComponentNew = targetables.reactComponent(
        '@simicart/siminia/src/simi/App/nativeInner/Customer/Login/SignIn/signIn.js'
    );
    
    const InnerSocialLoginNew = NativeInnerSignInComponentNew.addImport(
        "SocialLogin from '@simicart/siminia/src/simi/BaseComponents/SocialLogin/components/SocialAuthentication/socialAuthentication'"
    );

    NativeInnerSignInComponentNew.insertAfterSource(
        '</Form>',
        `<${InnerSocialLoginNew} mode="popup" showCreateAccount={showCreateAccount} isPopup={props.isPopup} />`
    );

    const CreateAccountComponent = targetables.reactComponent(
        '@simicart/siminia/src/simi/App/core/Customer/CreateAccountPage/CreateAccount.js'
    );

    const SocialLoginReg = CreateAccountComponent.addImport(
        "SocialLogin from '@simicart/siminia/src/simi/BaseComponents/SocialLogin/components/SocialAuthentication/socialAuthentication'"
    );

    CreateAccountComponent.insertAfterSource(
        '</Form>',
        `<${SocialLoginReg} mode="popup" />`
    );


    // Add Social login to native inner create account
    const NativeInnerCreateAccountComponent = targetables.reactComponent(
        '@simicart/siminia/src/simi/App/nativeInner/Customer/CreateAccountPage/CreateAccount.js'
    );

    const InnerSocialLoginReg = NativeInnerCreateAccountComponent.addImport(
        "SocialLogin from '@simicart/siminia/src/simi/BaseComponents/SocialLogin/components/SocialAuthentication/socialAuthentication'"
    );

    NativeInnerCreateAccountComponent.insertAfterSource(
        '</Form>',
        `<${InnerSocialLoginReg} mode="popup" />`
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
