import React from 'react';
import mergeOperations from '@magento/peregrine/lib/util/shallowMerge';
import { useQuery } from '@apollo/client';
import DEFAULT_OPERATIONS from '../../talons/socialLogin.ggl';
import FacebookLogin from 'react-facebook-login';

const SocialAccountsPage = props => {
  
  const isSignedIn = false
  const responseFacebook =(response) => {
    console.log(response);
  }
  const componentClicked = (data) => {
    console.warn(data)
  }

    const operations = mergeOperations(DEFAULT_OPERATIONS, props.operations);
    const { getStoreConfigQuery, getSocButtonsConfigsQuery } = operations;
    const { data: storeConfigData } = useQuery(getStoreConfigQuery, {
        fetchPolicy: 'cache-and-network',
        nextFetchPolicy: 'cache-first'
      });
    
      const { loading,data: buttonsConfigData } = useQuery(getSocButtonsConfigsQuery, {
        fetchPolicy: 'cache-and-network',
        nextFetchPolicy: 'cache-first'
      });
      if (loading) {
        return <h1>loading...</h1>
      }
      console.log("hahaha",storeConfigData, buttonsConfigData);
      const google = () => {
        
        window.open(
          `${ buttonsConfigData.amSocialLoginButtonConfig[0].url}&isAjax=true${
            !isSignedIn ? '&generateToken=true' : `&token=${token}`
          }`)
      }
    
      return <div onClick={google}  >
        {/* <FacebookLogin
    appId="1013666879224927"
    autoLoad={true}
    fields="name,email,picture"
    onClick={componentClicked}
    callback={responseFacebook} /> */}
    hieubachvan
      </div>
}
export default SocialAccountsPage