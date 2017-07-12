#!/bin/bash
# use this script to (re)start your local ESI Swagger UI
#
# prereqs:
# - a client ID for the datasource, be sure to enable all ESI scopes.
#   create a TQ client here -> https://developers.eveonline.com/applications
#
# - a docker server, available at $DOCKER_MACHINE_NAME, or localhost
#
# - port 8000 available on the docker server
#
# you can change settings by using the following env vars:
#
# - PORT: integer, default 8000
# - CONTAINER: string, default esi-swagger-ui-v3
# - PROTOCOL: string, default http
# - DOCKER_BUILD_ARGS: string, default empty. extra flags for docker build
#
# your client ID must be available in a file named "client_id" or
# provided via the env var CLIENT_ID, if you prefer
#
# questions? jump on tweetfleet slack and ask in the #esi channel
# not on tweetfleet slack? get an invite -> https://www.fuzzwork.co.uk/tweetfleet-slack-invites/

PORT=${PORT-8000}
CONTAINER=${CONTAINER-esi-swagger-ui-v3}
PROTOCOL=${PROTOCOL-http}

# check for client_id
if [[ "x$CLIENT_ID" == "x" ]]; then
  if [[ ! -e "client_id" ]]; then
    echo "no oauth client ID found. please either set the env var CLIENT_ID or store your client ID in a file named 'client_id'"
    exit 1
  fi
  CLIENT_ID=$(cat client_id)
fi

# ensure structure (otherwise the dockerfile will error)
mkdir -p latest legacy dev

# check for local swagger.jsons
for VERSION in latest legacy dev; do
  if [[ ! -e "$VERSION/swagger.json" ]]; then
    echo "fetching $VERSION swagger.json from ESI..."
    curl -s -H 'User-Agent: esi-swagger-ui-v3/dev' https://esi.tech.ccp.is/$VERSION/swagger.json > $VERSION/swagger.json
    if [ $? != 0 ]; then
      echo "failed to fetch $VERSION swagger.json from ESI"
      exit 1
    fi
  fi
done

# shim the UI under /ui/ for consistency with production
# maybe once this UI is stable it'll be moved up a level
BASEURL="$PROTOCOL://${DOCKER_MACHINE_NAME-localhost}:$PORT/ui/"
cat << EOF > redirect.html
<html>
 <head>
  <meta http-equiv="refresh" content="0; url=$BASEURL" />
 </head>
 <body>
  <p><a href="$BASEURL">Redirect</a></p>
 </body>
</html>
EOF

# if you need extra args, send them as DOCKER_BUILD_ARGS
docker build $DOCKER_BUILD_ARGS -t $CONTAINER .

# (re)start the container
docker kill $CONTAINER > /dev/null 2>&1
docker rm $CONTAINER > /dev/null 2>&1
docker run \
  -d \
  -p $PORT:8080 \
  --name=$CONTAINER \
  --hostname=$CONTAINER \
  --log-opt max-size=10m \
  -e OAUTH_REDIRECT_URL="$PROTOCOL://${DOCKER_MACHINE_NAME-localhost}:$PORT/ui/oauth2-redirect.html" \
  -e OAUTH_CLIENT_ID="$CLIENT_ID" \
  $CONTAINER
