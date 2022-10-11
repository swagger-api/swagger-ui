# Looking for information on environment variables?
# We don't declare them here — take a look at our docs.
# https://github.com/swagger-api/swagger-ui/blob/master/docs/usage/configuration.md

FROM nginx:1.23.1-alpine

RUN apk update && apk add --no-cache "nodejs>=16.17.1-r0"

LABEL maintainer="fehguy"

ENV API_KEY "**None**"
ENV SWAGGER_JSON "/app/swagger.json"
ENV PORT 8080
ENV BASE_URL ""
ENV SWAGGER_JSON_URL ""

COPY --chown=nginx:nginx --chmod=0666 ./docker/nginx.conf ./docker/cors.conf /etc/nginx/

# copy swagger files to the `/js` folder
COPY --chmod=0666 ./dist/* /usr/share/nginx/html/
COPY --chmod=0555 ./docker/docker-entrypoint.d/ /docker-entrypoint.d/
COPY --chmod=0666 ./docker/configurator /usr/share/nginx/configurator

RUN chmod 777 /usr/share/nginx/html/ /etc/nginx/ /var/cache/nginx/ /var/run/

EXPOSE 8080
