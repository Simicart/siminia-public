import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useSocialLoginContext } from '../context';
import { useUserContext } from '@magento/peregrine/lib/context/user';

const VISIBLE_BUTTONS_COUNT = 3;

const getPopupParams = () => {
  const bottomPadding = 22;

  const screenX = window.screenX || window.screenLeft;
  const screenY = window.screenY || window.screenTop;
  const outerWidth = window.outerWidth || document.body.clientWidth;
  const outerHeight =
    window.outerHeight || document.body.clientHeight - bottomPadding;

  const width = 500;
  const height = 420;

  const leftDivider = 2;
  const topDivider = 2.5;

  const left = parseInt(screenX + (outerWidth - width) / leftDivider, 10);
  const top = parseInt(screenY + (outerHeight - height) / topDivider, 10);

  return `width=${width},height=${height},left=${left},top=${top}`;
};

export const useSocButtons = (props = {}) => {
  const { buttons, mode, showCreateAccount } = props;
  const isShowMoreBtn =
    mode === 'popup' && buttons.length > VISIBLE_BUTTONS_COUNT;
  const [showAll, setShowAll] = useState(!isShowMoreBtn);
  const { buttonShape, errors, handleErrors } = useSocialLoginContext();
  const [{ isSignedIn, token }] = useUserContext();
  const errorRef = useRef(null);

  const visibleButtons = useMemo(
    () => (showAll ? buttons : buttons.slice(0, VISIBLE_BUTTONS_COUNT)),
    [showAll, buttons]
  );

  const handleLogin = useCallback(
    button => {
      const { type, url } = button;

      handleErrors(null);

      window.open(
        `${url}&isAjax=true${
          !isSignedIn ? '&generateToken=true' : `&token=${token}`
        }`,
        type,
        getPopupParams()
      );
    },
    [isSignedIn, handleErrors, token]
  );

  const handleShowMore = useCallback(() => setShowAll(true), [setShowAll]);

  useEffect(() => {
    const el = errorRef && errorRef.current;

    if (errors) {
      const { redirectWithError } = errors;

      if (redirectWithError && showCreateAccount) {
        handleErrors({
          ...errors,
          redirectWithError: 0
        });

        showCreateAccount();
      }

      if (el && mode === 'popup') {
        el.scrollIntoView();
      }
    }

    return () => {
      if (errors && !errors.redirectWithError) {
        handleErrors(null);
      }
    };
  }, [errors, errorRef, showCreateAccount, handleErrors, mode]);

  return {
    handleLogin,
    visibleButtons,
    isShowMoreBtn: isShowMoreBtn && !showAll,
    handleShowMore,
    buttonShape,
    errors,
    errorRef
  };
};
