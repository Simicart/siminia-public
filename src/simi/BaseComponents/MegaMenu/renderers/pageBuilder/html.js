import React from 'react';
import DefaultHTMLComponent from '@magento/pagebuilder/lib/ContentTypes/Html';
import { bool } from 'prop-types';
import RichContent from '@magento/venia-ui/lib/components/RichContent';

const Html = props => {
  const { isDefaultComponent, richContent, customProps, ...rest } = props;

  if (isDefaultComponent) {
    return <DefaultHTMLComponent {...rest} />;
  }

  const {
    textAlign,
    border,
    borderColor,
    borderWidth,
    borderRadius,
    marginTop,
    marginRight,
    marginBottom,
    marginLeft,
    paddingTop,
    paddingRight,
    paddingBottom,
    paddingLeft,
    cssClasses = []
  } = rest;

  const dynamicStyles = {
    textAlign,
    border,
    borderColor,
    borderWidth,
    borderRadius,
    marginTop,
    marginRight,
    marginBottom,
    marginLeft,
    paddingTop,
    paddingRight,
    paddingBottom,
    paddingLeft
  };

  return (
    <div style={dynamicStyles} className={cssClasses.join(' ')}>
      <RichContent html={richContent} {...customProps} />
    </div>
  );
};

Html.propTypes = {
  isDefaultComponent: bool
};

export default Html;
