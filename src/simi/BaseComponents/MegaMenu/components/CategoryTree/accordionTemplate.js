import React from 'react';
import MenuTree from '../MenuTree';
import { useAccordionTemplate } from '../../talons/useAccordionTemplate';

const AccordionTemplate = () => {
  const { menuTree } = useAccordionTemplate();

  if (!menuTree) {
    return null;
  }

  return <MenuTree view="hamburger" menuTree={menuTree} />;
};

export default AccordionTemplate;
