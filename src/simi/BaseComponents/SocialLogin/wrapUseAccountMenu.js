import { useSocialLoginContext } from '../src/context';

const wrapUseAccountMenu = original => props => {
  const defaultReturnData = original(props);
  const { isEnabled, buttonPosition, enabledModes } = useSocialLoginContext();

  const { view } = defaultReturnData;
  const amPositionClass =
    isEnabled && enabledModes.includes('popup') && view === 'SIGNIN'
      ? buttonPosition
      : 'default';

  return {
    ...defaultReturnData,
    amPositionClass
  };
};

export default wrapUseAccountMenu;
