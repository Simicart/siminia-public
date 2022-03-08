import { useSocialLoginContext } from '../src/context';

const MY_SOCIAL_ACCOUNTS_ITEM = {
  name: 'My Social Accounts',
  id: 'amSocialLogin.socialAccountsTitle',
  url: '/social-accounts'
};

const wrapUseAccountMenuItems = original => props => {
  const { isEnabled } = useSocialLoginContext();
  const defaultReturnData = original(props);

  const { menuItems } = defaultReturnData;

  return {
    ...defaultReturnData,
    menuItems: isEnabled
      ? [...menuItems, MY_SOCIAL_ACCOUNTS_ITEM]
      : [...menuItems]
  };
};

export default wrapUseAccountMenuItems;
