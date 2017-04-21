#! /bin/sh

set -e

INDEX_FILE=/usr/share/nginx/html/index.html

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

replace_in_index myApiKeyXXXX123456789 $API_KEY
replace_or_delete_in_index your-client-id $OAUTH_CLIENT_ID
replace_or_delete_in_index your-client-secret-if-required $OAUTH_CLIENT_SECRET
replace_or_delete_in_index your-realms $OAUTH_REALM
replace_or_delete_in_index your-app-name $OAUTH_APP_NAME
if [ "$OAUTH_ADDITIONAL_PARAMS" != "**None**" ]; then
    replace_in_index "additionalQueryStringParams: {}" "additionalQueryStringParams: {$OAUTH_ADDITIONAL_PARAMS}"
fi

if [[ -f $SWAGGER_JSON ]]; then
  sed -i "s|http://petstore.swagger.io/v2/swagger.json|swagger.json|g" $INDEX_FILE
  sed -i "s|http://example.com/api|swagger.json|g" $INDEX_FILE
else
  sed -i "s|http://petstore.swagger.io/v2/swagger.json|$API_URL|g" $INDEX_FILE
  sed -i "s|http://example.com/api|$API_URL|g" $INDEX_FILE
fi

if [[ -n "$VALIDATOR_URL" ]]; then
  sed -i "s|.*validatorUrl:.*$||g" $INDEX_FILE
  TMP_VU="$VALIDATOR_URL"
  [[ "$VALIDATOR_URL" != "null" && "$VALIDATOR_URL" != "undefined" ]] && TMP_VU="\"${VALIDATOR_URL}\""
  sed -i "s|\(url: .*,\)|\1\n    validatorUrl: ${TMP_VU},|g" $INDEX_FILE
  unset TMP_VU
fi

exec nginx -g 'daemon off;'
