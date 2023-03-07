#! /bin/sh

set -e
BASE_URL=${BASE_URL:-/}
NGINX_ROOT=/usr/share/nginx/html
INITIALIZER_SCRIPT=$NGINX_ROOT/swagger-initializer.js
NGINX_CONF=/etc/nginx/nginx.conf

node /usr/share/nginx/configurator $INITIALIZER_SCRIPT


if [[ "${BASE_URL}" != "/" ]]; then
  sed -i "s|location / {|location $BASE_URL {|g" $NGINX_CONF
fi

if [ "$SWAGGER_JSON_URL" ]; then
  sed -i "s|https://petstore.swagger.io/v2/swagger.json|$SWAGGER_JSON_URL|g" $INITIALIZER_SCRIPT
  sed -i "s|http://example.com/api|$SWAGGER_JSON_URL|g" $INITIALIZER_SCRIPT
fi

if [[ -f "$SWAGGER_JSON" ]]; then
  cp -s "$SWAGGER_JSON" "$NGINX_ROOT"
  REL_PATH="./$(basename $SWAGGER_JSON)"

  if [[ -z "$SWAGGER_ROOT" ]]; then
    SWAGGER_ROOT="$(dirname $SWAGGER_JSON)"
  fi

  if [[ "$BASE_URL" != "/" ]]
  then
    BASE_URL=$(echo $BASE_URL | sed 's/\/$//')
    sed -i \
      "s|#SWAGGER_ROOT|rewrite ^$BASE_URL(/.*)$ \$1 break;\n        #SWAGGER_ROOT|" \
      $NGINX_CONF
  fi
  sed -i "s|#SWAGGER_ROOT|root $SWAGGER_ROOT/;|g" $NGINX_CONF

  sed -i "s|https://petstore.swagger.io/v2/swagger.json|$REL_PATH|g" $INITIALIZER_SCRIPT
  sed -i "s|http://example.com/api|$REL_PATH|g" $INITIALIZER_SCRIPT
fi

# enable/disable the address and port for IPv6 addresses that nginx listens on
if [[ -n "${PORT_IPV6}" ]]; then
    sed -i "s|8080;|8080;\n    listen            [::]:${PORT_IPV6};|g" $NGINX_CONF
fi

# replace the PORT that nginx listens on if PORT is supplied
if [[ -n "${PORT}" ]]; then
    sed -i "s|8080|${PORT}|g" $NGINX_CONF
fi

find $NGINX_ROOT -type f -regex ".*\.\(html\|js\|css\)" -exec sh -c "gzip < {} > {}.gz" \;
