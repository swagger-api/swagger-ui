#! /bin/sh

set -e
BASE_URL=${BASE_URL:-/}
NGINX_ROOT=/usr/share/nginx/html
INDEX_FILE=$NGINX_ROOT/index.html
NGINX_CONF=/etc/nginx/nginx.conf

node /usr/share/nginx/configurator $INDEX_FILE

replace_in_index () {
  if [ "$1" != "**None**" ]; then
    sed -i "s|/\*||g" $INDEX_FILE
    sed -i "s|\*/||g" $INDEX_FILE
    sed -i "s|$1|$2|g" $INDEX_FILE
  fi
}

replace_or_delete_in_index () {
  if [ -z "$2" ]; then
    sed -i "/$1/d" $INDEX_FILE
  else
    replace_in_index $1 $2
  fi
}

if [[ "${BASE_URL}" != "/" ]]; then
  sed -i "s|location / {|location $BASE_URL {|g" $NGINX_CONF
fi

replace_in_index myApiKeyXXXX123456789 $API_KEY

if [ "$SWAGGER_JSON_URL" ]; then
  sed -i "s|https://petstore.swagger.io/v2/swagger.json|$SWAGGER_JSON_URL|g" $INDEX_FILE
  sed -i "s|http://example.com/api|$SWAGGER_JSON_URL|g" $INDEX_FILE
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

  sed -i "s|https://petstore.swagger.io/v2/swagger.json|$REL_PATH|g" $INDEX_FILE
  sed -i "s|http://example.com/api|$REL_PATH|g" $INDEX_FILE
fi

# replace the PORT that nginx listens on if PORT is supplied
if [[ -n "${PORT}" ]]; then
    sed -i "s|8080|${PORT}|g" $NGINX_CONF
fi

find $NGINX_ROOT -type f -regex ".*\.\(html\|js\|css\)" -exec sh -c "gzip < {} > {}.gz" \;

exec nginx -g 'daemon off;'
