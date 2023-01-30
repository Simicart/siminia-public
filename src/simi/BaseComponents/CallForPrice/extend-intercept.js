const { Targetables } = require('@magento/pwa-buildpack');

module.exports = targets => {
  const targetables = Targetables.using(targets);

  // add mega menu context provider
  const ContextProvider = targetables.reactComponent(
    '@magento/venia-ui/lib/components/App/contextProvider.js'
  );
  const CallForPriceProvider = ContextProvider.addImport(
    "CallForPriceProvider from '@simicart/siminia/src/simi/BaseComponents/CallForPrice/context'"
  );

  ContextProvider.insertBeforeSource(
    'const ContextProvider = ({ children }) => {',
    `contextProviders.push(${CallForPriceProvider});\n`
  );
};
