import GET_PRODUCT_WIDGET from '../queries/getProductWidget.graphql';
import { useQuery } from '@apollo/client';

export const useProductWidget = props => {
  const { widgetId } = props;

  const { loading, error, data } = useQuery(GET_PRODUCT_WIDGET, {
    variables: {
      widgetId
    }
  });

  const { amMegaMenuWidget } = data || {};

  return {
    ...amMegaMenuWidget,
    loading,
    error
  };
};
