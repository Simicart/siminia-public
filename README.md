# siminia
## 0. Prepare your magento site with:

- Magento version >= 2.4.3 && PWA studio 12

## 1. Clone pwa-studio
```
git clone https://github.com/magento/pwa-studio/
cd pwa-studio
git checkout release/12.0
```

## 2. Modify package.json at PWA studio root folder

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
    "build": "yarn run build:siminia",
    "build:siminia": "yarn workspace @simicart/siminia run build",
    "watch:siminia": "yarn workspace @simicart/siminia run watch",
    "stage:siminia": "yarn workspace @simicart/siminia run start",
    ...
  },
```
## 3. Clone siminia
```
cd  packages
git clone https://github.com/Simicart/siminia-public siminia
cd siminia
git checkout 12.0/main
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

Use integration token generated to fill in the file at: packages/siminia/src/simi/App/core/NoMatch/index.js
```
const integrationToken = 'your-token';
```
