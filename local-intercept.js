const moduleOverrideWebpackPlugin = require('./src/override/moduleOverrideWebpackPlugin');
const componentOverrideMapping = require('./src/override/componentOverrideMapping');

const amSocialLoginIntercept = require('./src/simi/BaseComponents/SocialLogin/extend-intercept');
const amMegaMenuIntercept = require('./src/simi/BaseComponents/MegaMenu/extend-intercept');
const bssForceLoginIntercept = require('./src/simi/BaseComponents/ForceLogin/extend-intercept');
const bssRewardPointIntercept = require('./src/simi/BaseComponents/RewardPoint/extend-intercept');

/* eslint-disable */
/**
 * Custom interceptors for the project.
 *
 * This project has a section in its package.json:
 *    "pwa-studio": {
 *        "targets": {
 *            "intercept": "./local-intercept.js"
 *        }
 *    }
 *
 * This instructs Buildpack to invoke this file during the intercept phase,
 * as the very last intercept to run.
 *
 * A project can intercept targets from any of its dependencies. In a project
 * with many customizations, this function would tap those targets and add
 * or modify functionality from its dependencies.
 */

function localIntercept(targets) {
    targets.of('@magento/pwa-buildpack').webpackCompiler.tap(compiler => {
        new moduleOverrideWebpackPlugin(componentOverrideMapping).apply(
            compiler
        );
    });

    amSocialLoginIntercept(targets);
    amMegaMenuIntercept(targets);
    bssForceLoginIntercept(targets);
    bssRewardPointIntercept(targets);
}

module.exports = localIntercept;
