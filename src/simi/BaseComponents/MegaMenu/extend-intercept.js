const { Targetables } = require('@magento/pwa-buildpack');

module.exports = targets => {
  const targetables = Targetables.using(targets);

  // add mega menu context provider
  const ContextProvider = targetables.reactComponent(
    '@magento/venia-ui/lib/components/App/contextProvider.js'
  );
  const AmMegaMenuProvider = ContextProvider.addImport(
    "AmMegaMenuProvider from '@simicart/siminia/src/simi/BaseComponents/MegaMenu/context'"
  );

  ContextProvider.insertBeforeSource(
    'const ContextProvider = ({ children }) => {',
    `contextProviders.push(${AmMegaMenuProvider});\n`
  );

  // extend MegaMenu
  const MegaMenuComponent = targetables.module(
    '@magento/venia-ui/lib/components/MegaMenu/index.js'
  );

  MegaMenuComponent.insertAfterSource(
    'export { default } from ',
    '"@simicart/siminia/src/simi/BaseComponents/MegaMenu/components/TopMenu"',
    { remove: 25 }
  );

  // extend Header
  const HeaderComponent = targetables.reactComponent(
    '@magento/venia-ui/lib/components/Header/header.js'
  );

  const useAmHeaderContext = HeaderComponent.addImport(
    "{useAmMegaMenuContext} from '@simicart/siminia/src/simi/BaseComponents/MegaMenu/context'"
  );
  const headerClasses = HeaderComponent.addImport(
    "headerClasses from '@simicart/siminia/src/simi/BaseComponents/MegaMenu/extendStyle/header.css'"
  );

  HeaderComponent.insertAfterSource(
    'useHeader();',
    `\n const { amRootStyle, isEnabledMegaMenu } = ${useAmHeaderContext}();\n`
  )
    .insertAfterSource(
      'useStyle(defaultClasses,',
      `isEnabledMegaMenu ? ${headerClasses} : undefined,`
    )
    .setJSXProps('header', { style: '{ amRootStyle }' })
    .setJSXProps('PageLoadingIndicator', {
      classes: '{{ root: classes.indicator }}'
    });

  // extend CategoryTreeIndex
  const CategoryTreeIndex = targetables.module(
    '@magento/venia-ui/lib/components/CategoryTree/index.js'
  );

  CategoryTreeIndex.insertAfterSource(
    'export { default } from ',
    '"@simicart/siminia/src/simi/BaseComponents/MegaMenu/components/CategoryTree"',
    { remove: 25 }
  );

  // extend Navigation
  const NavigationComponent = targetables.reactComponent(
    '@magento/venia-ui/lib/components/Navigation/navigation.js'
  );
  const useAmNavigationContext = NavigationComponent.addImport(
    "{useAmMegaMenuContext} from '@simicart/siminia/src/simi/BaseComponents/MegaMenu/context'"
  );
  const navigationClasses = NavigationComponent.addImport(
    "navigationClasses from '@simicart/siminia/src/simi/BaseComponents/MegaMenu/extendStyle/navigation.css'"
  );

  NavigationComponent.insertAfterSource(
    'useNavigation();',
    `\nconst { amRootStyle, isEnabledMegaMenu } = ${useAmNavigationContext}();\n`
  )
    .setJSXProps('aside', { style: '{ amRootStyle }' })
    .insertAfterSource(
      'useStyle(defaultClasses,',
      `isEnabledMegaMenu ? ${navigationClasses} : undefined,`
    )
    .setJSXProps('AuthBar', { classes: '{{ root: classes.authBar }}' });

  // PageBuilder
  targetables
    .reactComponent('@magento/pagebuilder/lib/pagebuilder.js')
    .insertAfterSource('function PageBuilder({ html, classes', ', ...restProps')
    .setJSXProps('ContentTypeFactory', { customProps: '{restProps}' });

  // ContentTypeFactory
  targetables
    .reactComponent('@magento/pagebuilder/lib/factory.js')
    .insertAfterSource('const ContentTypeFactory = ({ data', ', customProps')
    .insertAfterSource(
      'renderContentType(contentTypeConfig.component, ',
      '{ ...props, customProps }',
      { remove: 5 }
    )
    .setJSXProps('ContentTypeFactory key={i}', {
      customProps: '{data.customProps}'
    });
};
