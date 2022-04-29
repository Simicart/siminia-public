import React, { useMemo, useRef } from 'react';
import { string, array, number } from 'prop-types';
import WithoutContent from './withoutContent';
import WithContent from './withContent';
import { getOutsideViewportTransformValue } from '../../../utils';

const types = {
  0: WithoutContent,
  1: WithContent
};

const SubMenuContent = props => {
  const {
    submenu_type,
    content,
    subCategories,
    isMobile,
    level,
    isOpen,
    width,
    width_value,
    view
  } = props;

  const ref = useRef();

  const elementStyle = useMemo(() => {
    if (level !== 1) {
      return null;
    }

    const result = {
      width: width === 2 && width_value
    };

    if (!isOpen || isMobile) {
      return result;
    }

    return {
      ...result,
      ...getOutsideViewportTransformValue(ref, view === 'topMenu')
    };
  }, [level, ref, width_value, width, isMobile, isOpen, view]);

  if (!content && !subCategories) {
    return null;
  }

  const Component = !isMobile
    ? types[submenu_type] || WithoutContent
    : WithoutContent;

  return <Component {...props} elementRef={ref} elementStyle={elementStyle} />;
};

SubMenuContent.propTypes = {
  submenu_type: number,
  content: string,
  subCategories: array
};

SubMenuContent.defaultProps = {
  submenu_type: 0
};

export default SubMenuContent;
