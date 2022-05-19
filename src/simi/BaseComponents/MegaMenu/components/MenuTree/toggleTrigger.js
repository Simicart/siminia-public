import React from 'react';
import { mergeClasses } from '@magento/venia-ui/lib/classify';
import { shape, string } from 'prop-types';

import defaultClasses from './menuLink.module.css';
import Trigger from '@magento/venia-ui/lib/components/Trigger';
import Icon from '@magento/venia-ui/lib/components/Icon';
import { ChevronRight as ArrowIcon } from 'react-feather';

const ToggleTrigger = props => {
  const { action, isOpen } = props;

  const classes = mergeClasses(defaultClasses, props.classes);
  const rootClass = isOpen ? classes.toggle_open : classes.toggle;

  return (
    <div className={rootClass}>
      <Trigger action={action}>
        <Icon src={ArrowIcon} />
      </Trigger>
    </div>
  );
};

ToggleTrigger.propTypes = {
  classes: shape({
    root: string
  })
};

ToggleTrigger.defaultProps = {};

export default ToggleTrigger;
