# siminia
## 0. Prepare your magento site with:

- Magento version >= 2.4.2 && PWA studio 11
- Got [SimiCart Connector extension](https://github.com/Simicart/SimiCart-Magento2.x) and [SimiCart Connector GraphQl extension](https://github.com/Simicart/SimiCart-Magento2.x-GraphQl) installed

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
git clone https://github.com/Simicart/siminia-public
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

## 5. Use your own backend magento

### Update configuration at packages/siminia/.env

```
MAGENTO_BACKEND_URL=https://your.magento.site.com/
```

## 6. Use your own tapita PageBuilder credentials:

Create your account at [Tapita](https://tapita.io/pagebuilder/)

Use integration token generated to fill in the file at: packages/siminia/src/simi/App/core/NoMatch/ResolveUrlResult.js
```
const integrationToken = 'your-token';
```
