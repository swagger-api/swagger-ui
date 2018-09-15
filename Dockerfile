FROM nginx:1.15-alpine

LABEL maintainer="fehguy"

ENV VERSION "v2.2.10"
ENV FOLDER "swagger-ui-2.2.10"
ENV API_URL "https://petstore.swagger.io/v2/swagger.json"
ENV API_URLS ""
ENV API_KEY "**None**"
ENV OAUTH_CLIENT_ID "**None**"
ENV OAUTH_CLIENT_SECRET "**None**"
ENV OAUTH_REALM "**None**"
ENV OAUTH_APP_NAME "**None**"
ENV OAUTH_ADDITIONAL_PARAMS "**None**"
ENV SWAGGER_JSON "/app/swagger.json"
ENV PORT 8080
ENV BASE_URL ""
ENV CONFIG_URL ""

COPY nginx.conf /etc/nginx/

# copy swagger files to the `/js` folder
COPY ./dist/* /usr/share/nginx/html/
COPY ./docker-run.sh /usr/share/nginx/

RUN chmod +x /usr/share/nginx/docker-run.sh

EXPOSE 8080

CMD ["sh", "/usr/share/nginx/docker-run.sh"]
