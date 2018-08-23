#! /bin/sh

set -e

BASE_URL=${BASE_URL:-/}
NGINX_ROOT=/usr/share/nginx/html
INDEX_FILE=$NGINX_ROOT/index.html

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

if [ "${BASE_URL}" ]; then
  sed -i "s|location .* {|location $BASE_URL {|g" /etc/nginx/nginx.conf
fi

replace_in_index myApiKeyXXXX123456789 $API_KEY
replace_or_delete_in_index your-client-id $OAUTH_CLIENT_ID
replace_or_delete_in_index your-client-secret-if-required $OAUTH_CLIENT_SECRET
replace_or_delete_in_index your-realms $OAUTH_REALM
replace_or_delete_in_index your-app-name $OAUTH_APP_NAME
if [ "$OAUTH_ADDITIONAL_PARAMS" != "**None**" ]; then
    replace_in_index "additionalQueryStringParams: {}" "additionalQueryStringParams: {$OAUTH_ADDITIONAL_PARAMS}"
fi

if [[ -f $SWAGGER_JSON ]]; then
  cp -s $SWAGGER_JSON $NGINX_ROOT
  REL_PATH="./$(basename $SWAGGER_JSON)"
  sed -i "s|https://petstore.swagger.io/v2/swagger.json|$REL_PATH|g" $INDEX_FILE
  sed -i "s|http://example.com/api|$REL_PATH|g" $INDEX_FILE
else
  sed -i "s|https://petstore.swagger.io/v2/swagger.json|$API_URL|g" $INDEX_FILE
  sed -i "s|http://example.com/api|$API_URL|g" $INDEX_FILE
fi

if [[ -n "$VALIDATOR_URL" ]]; then
  sed -i "s|.*validatorUrl:.*$||g" $INDEX_FILE
  TMP_VU="$VALIDATOR_URL"
  [[ "$VALIDATOR_URL" != "null" && "$VALIDATOR_URL" != "undefined" ]] && TMP_VU="\"${VALIDATOR_URL}\""
  sed -i "s|\(url: .*,\)|\1\n    validatorUrl: ${TMP_VU},|g" $INDEX_FILE
  unset TMP_VU
fi

# replace `url` with `urls` option if API_URLS is set
if [[ -n "$API_URLS" ]]; then
    sed -i "s|^\(\s*\)url: .*,|\1urls: $API_URLS,|g" $INDEX_FILE
fi

# replace the PORT that nginx listens on if PORT is supplied
if [[ -n "${PORT}" ]]; then
    sed -i "s|8080|${PORT}|g" /etc/nginx/nginx.conf
fi

exec nginx -g 'daemon off;'
