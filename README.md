# Siminia - Magento 2 PWA Studio Theme by SimiCart

Based on PWA Studio, our open-source PWA theme for Magento 2 is an easy way to transform your store into a headless storefront that is fast, engaging, and mobile-friendly.

![Siminia Theme](https://tapita.io/pb/pub/media/spb/usr/19/oti/1640680526209/siminia.png 'Siminia Theme')

## Installation

### Requirements

- Magento version >= 2.4.3
- PWA Studio 12

### 1. Clone pwa-studio

```
git clone https://github.com/magento/pwa-studio/
cd pwa-studio
git checkout release/12.6
```

### 2. Modify `package.json` at PWA Studio root folder

workspaces:

```

  "workspaces": [
...
    "packages/siminia"
  ],

```

scripts (modify the build script and add Siminia scripts):

```
  "scripts": {
    "build": "yarn run build:siminia",
    "build:siminia": "yarn workspace @simicart/siminia run build",
    "watch:siminia": "yarn workspace @simicart/siminia run watch",
    "stage:siminia": "yarn workspace @simicart/siminia run start",
    ...
  },
```

### 3. Clone Siminia

```
cd  packages
git clone https://github.com/Simicart/siminia-public siminia
cd siminia
cd ../..
yarn install
yarn run build
```

### 4. Run watch/stage

To run watch

```
yarn run watch:siminia
```

To run production

```
NODE_ENV=production PORT=8080 yarn run stage:siminia
```

### 5. Use your own Magento backend

Update configuration at `packages/siminia/.env`

```
MAGENTO_BACKEND_URL=https://your.magento.site.com/
```

### 6. (Optional) Connect your frontend with Tapita Page Builder

Create your free account at [Tapita](https://tapita.io/pagebuilder/register)

When you first login, select Magento as backend and PWA Studio as frontend.

Go to **Integration** tab and click **Generate Token**. Then, copy the generated _Integration Token_ to use in the next step.

Open the file `packages/siminia/template.html` and change the value at this line to the Integration Token you got in previous step

```
var tapitaIntegrationToken = 'your-token';
```

## Learn more

Demo: https://magento.pwa-commerce.com/

YouTube guide: https://www.youtube.com/watch?v=4NBSq908zfw

Magento PWA Development Service: https://www.simicart.com/magento-pwa-development/
