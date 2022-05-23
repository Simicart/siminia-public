rm -Rf dist
unzip dist.zip
cp -Rf dist/static/* ../pub/static/
cd ..
php -d memory_limit=6G bin/magento setup:static-content:deploy -f
bin/magento c:fl
#curl -v upgradeVersionUrl
