import htmlConfigAggregator from '@magento/pagebuilder/lib/ContentTypes/Html/configAggregator.js';
import detectAmMegaMenuRenderer from '../detectAmMegaMenuRenderer';

export default (node, props) => {
  const defaultReturnData = htmlConfigAggregator(node, props);

  const richContent = node.innerHTML
    ? node.innerHTML
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
        .replace(/&amp;/g, '&')
    : '';

  return {
    ...defaultReturnData,
    isDefaultComponent: !detectAmMegaMenuRenderer(richContent),
    richContent
  };
};
