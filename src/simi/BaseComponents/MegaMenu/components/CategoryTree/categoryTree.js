import React from 'react';
import { useAmMegaMenuContext } from '../../context';
import DefaultTemplate from '@magento/venia-ui/lib/components/CategoryTree/categoryTree';
import DrillDownTemplate from './drillDownTemplate';
import AccordionTemplate from './accordionTemplate';

const CategoryTree = props => {
  const { hamburgerView, isEnabledMegaMenu, isMobile } = useAmMegaMenuContext();

  if (!isEnabledMegaMenu) {
    return <DefaultTemplate {...props} />;
  } else if (isMobile && hamburgerView === 'drill') {
    return <DrillDownTemplate {...props} />;
  }

  return <AccordionTemplate {...props} />;
};

export default CategoryTree;
