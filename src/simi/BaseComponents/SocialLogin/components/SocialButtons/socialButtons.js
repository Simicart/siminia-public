import React from 'react';
import { mergeClasses } from '@magento/venia-ui/lib/classify';
import { shape, string, array } from 'prop-types';

import defaultClasses from './socialButtons.module.css';
import Button from './button';
import { useSocButtons } from '../../talons/useSocButtons';
import { FormattedMessage } from 'react-intl';

const SocialButtons = props => {
  const { buttons, mode } = props;
  const {
    buttonShape,
    visibleButtons,
    handleLogin,
    isShowMoreBtn,
    handleShowMore,
    errors,
    errorRef
  } = useSocButtons({ ...props });

  if (!Array.isArray(buttons) || !buttons.length) {
    return null;
  }
  const classes = mergeClasses(defaultClasses, props.classes);

  const list = visibleButtons.map(btn => (
    <Button
      key={btn.type}
      buttonShape={buttonShape}
      {...btn}
      handleLogin={handleLogin}
    />
  ));

  const showMoreBtn = isShowMoreBtn ? (
    <button className={classes.showMore} onClick={handleShowMore}>
      <FormattedMessage
        id={'amSocialLogin.showMore'}
        defaultMessage={'Show More'}
      />
    </button>
  ) : null;

  const errorMessage =
    errors && errors.message ? (
      <span ref={errorRef} className={classes.message}>
        {errors.message}
      </span>
    ) : null;

  return (
    <div className={`${classes.root} ${classes[buttonShape]} ${classes[mode]}`}>
      <div className={classes.list}>{list}</div>
      {showMoreBtn}
      {errorMessage}
    </div>
  );
};

SocialButtons.propTypes = {
  buttons: array,
  classes: shape({
    root: string
  })
};

export default SocialButtons;
