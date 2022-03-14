import { gql } from '@apollo/client';

export const GET_STORE_CONFIG = gql`
  query getStoreConfigs {
    storeConfig {
      id
      amsociallogin_general_enabled
      amsociallogin_general_login_position
      amsociallogin_general_button_shape
      amsociallogin_general_popup_enabled
      amsociallogin_general_button_position
      amsociallogin_general_redirect_type
      amsociallogin_general_custom_url
    }
  }
`;

export const GET_SOC_BUTTONS_CONFIG = gql`
  query amSocialLoginButtonConfig {
    amSocialLoginButtonConfig {
      type
      label
      url
    }
  }
`;

export const GET_SOC_ACCOUNT_DATA = gql`
  query amSocialLoginAccountData {
    amSocialLoginAccountData {
      type
      name
    }
  }
`;

export const UNLINK_ACCOUNT = gql`
  mutation amSocialLoginUnlinkAccount($type: String!) {
    amSocialLoginUnlinkAccount(type: $type) {
      isSuccess
      message
    }
  }
`;

export const LINK_ACCOUNT = gql`
  mutation amSocialLoginLinkAccount($type: String!) {
    amSocialLoginLinkAccount(type: $type) {
      isSuccess
      message
    }
  }
`;

export default {
  getStoreConfigQuery: GET_STORE_CONFIG,
  getSocButtonsConfigsQuery: GET_SOC_BUTTONS_CONFIG,
  getSocAccountDataQuery: GET_SOC_ACCOUNT_DATA,
  unlinkAccountMutation: UNLINK_ACCOUNT,
  linkAccountMutation: LINK_ACCOUNT
};
