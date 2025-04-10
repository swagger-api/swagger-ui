# Looking for information on environment variables?
# We don't declare them here — take a look at our docs.
# https://github.com/swagger-api/swagger-ui/blob/master/docs/usage/configuration.md

FROM nginx:1.27.4-alpine

LABEL maintainer="vladimir.gorej@gmail.com" \
      org.opencontainers.image.authors="vladimir.gorej@gmail.com" \
      org.opencontainers.image.url="docker.swagger.io/swaggerapi/swagger-ui" \
      org.opencontainers.image.source="https://github.com/swagger-api/swagger-ui" \
      org.opencontainers.image.description="SwaggerUI Docker image" \
      org.opencontainers.image.licenses="Apache-2.0"

RUN apk add --update-cache --no-cache "nodejs" "libxml2>=2.13.4-r5" "libexpat>=2.7.0-r0" "libxslt>=1.1.42-r2" "xz-libs>=5.6.3-r1" "c-ares>=1.34.5-r0"

LABEL maintainer="char0n"

ENV API_KEY="**None**" \
    SWAGGER_JSON="/app/swagger.json" \
    PORT="8080" \
    PORT_IPV6="" \
    BASE_URL="/" \
    SWAGGER_JSON_URL="" \
    CORS="true" \
    EMBEDDING="false"

COPY --chown=nginx:nginx --chmod=0666 ./docker/default.conf.template ./docker/cors.conf ./docker/embedding.conf /etc/nginx/templates/

COPY --chmod=0666 ./dist/* /usr/share/nginx/html/
COPY --chmod=0555 ./docker/docker-entrypoint.d/ /docker-entrypoint.d/
COPY --chmod=0666 ./docker/configurator /usr/share/nginx/configurator

# Simulates running NGINX as a non root; in future we want to use nginxinc/nginx-unprivileged.
# In future we will have separate unpriviledged images tagged as v5.1.2-unprivileged.
RUN chmod 777 /usr/share/nginx/html/ /etc/nginx/conf.d/ /etc/nginx/conf.d/default.conf /var/cache/nginx/ /var/run/

EXPOSE 8080
