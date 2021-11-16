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

### Prepare your magento site with:

- Magento version >= 2.4.2
- Got [SimiCart Connector extension](https://github.com/Simicart/SimiCart-Magento2.x) and [SimiCart Connector GraphQl extension](https://github.com/Simicart/SimiCart-Magento2.x-GraphQl) installed

### Update configuration at packages/siminia/.env

```
MAGENTO_BACKEND_URL=https://your.magento.site.com/
```