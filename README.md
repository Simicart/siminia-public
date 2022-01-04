# siminia

## 1. Clone pwa-studio
```
git clone https://github.com/magento/pwa-studio/
cd pwa-studio
git checkout release/11.0
```

## 2. Modify package.json

workspaces:
```

  "workspaces": [
...
    "packages/siminia"
  ],

```

scripts (modify the build script and add siminia scripts):

```
  "scripts": {
    "build": "yarn venia run build && yarn run build:siminia",
    "build:siminia": "yarn workspace @simicart/siminia run build",
    "watch:siminia": "yarn workspace @simicart/siminia run watch",
    "stage:siminia": "yarn workspace @simicart/siminia run start",
    ...
  },
```
## 3. Clone siminia
```
cd  packages
git clone https://github.com/Simicart/siminia
cd siminia
git checkout 11.0/main
yarn install
yarn run build
cd ../..
yarn install
yarn run build
```
## 4. Run watch/stage
To run watch
```
yarn run watch:siminia
```
To run production
```
NODE_ENV=production PORT=8080 yarn run stage:siminia
```

## 5. No HTTPS magento site
In case your magento site is not https (localhost for example), you'd meet the error of:
Protocol "http:" not supported. Expected "https:"
Go and change it at: pwa-studio/packages/pwa-buildpack/lib/Utilities/graphQL.js
Switch the line
```
const { Agent: HTTPSAgent } = require('https');
```
to
```
const { Agent: HTTPSAgent } = require('http');
```
## 6. use GET method for apollo (not include mutation)
Find the file at packages/peregrine/lib/talons/Adapter/useAdapter.js
add:
```
useGETForQueries: true,
```
to apolloLink declaration, which would become
```
createHttpLink({
    fetch: customFetchToShrinkQuery,
    useGETForQueries: true,
    uri: apiBase
}),
```

Since the 8.0 version, GET requests are enabled by default.

When some requests are too long, it would cause the error on API calling, add the option below:

```
NODE_OPTIONS=--max-http-header-size=80000
```

## 7. Increase customer token expiry time  (v7.0.0 or higher)
Update `signin_token` param of function <b>setToken</b> in path:
```
packages/peregrine/lib/store/actions/user/asyncActions.js
```
## 8. Switch to Session storage for cache
Open the file at
```
packages/venia-ui/lib/drivers/adapter.js
```
Change the line
```
storage: window.localStorage,
```
to 
```
storage: window.sessionStorage,
```

## 9. Rendertron

### To use RenderTron

Go to
```
packages/pwa-buildpack/lib/Utilities/serve.js
```

add this line after the initialize of stagingServerSettings
```
...
    const stagingServerSettings = config.section('stagingServer');
    const addRendertronMiddleware = require('@simicart/siminia/addRendertronMiddleware.js');
...
```

and add this line to before 

```
...
before(app) {
    addRendertronMiddleware(app, process.env);
    addImgOptMiddleware(app, {
...
```

When run staging, add this var:
```
NODE_ENV=production PORT=8080 SIMI_RENDERTRON=true yarn  run stage:siminia
```

### To stop creating cart from rendertron and search engine bots
Edit file at:
```
packages/peregrine/lib/context/cart.js
```
Then add the import
```
import { isBot, isRendertron } from '@simicart/siminia/src/simi/Helper/BotDetect';
```
After that, add the lines below before the cartApi.getCartDetails function, to be like
```
if (!isBot() && !isRendertron())
cartApi.getCartDetails({
```

Both adding rendertron and stop creating cart automatically would require cleaning node_modules from root dir and siminia dir.
