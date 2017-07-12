FROM alpine:3.5

MAINTAINER fehguy

ENV VERSION "v2.2.10"
ENV FOLDER "swagger-ui-2.2.10"
ENV API_URL "http://petstore.swagger.io/v2/swagger.json"
ENV API_KEY "**None**"
ENV OAUTH_CLIENT_ID "**None**"
ENV OAUTH_CLIENT_SECRET "**None**"
ENV OAUTH_REALM "**None**"
ENV OAUTH_APP_NAME "**None**"
ENV OAUTH_ADDITIONAL_PARAMS "**None**"
ENV SWAGGER_JSON "/app/swagger.json"
ENV PORT 80

RUN apk add --update nginx
RUN mkdir -p /run/nginx /usr/share/nginx/html/latest /usr/share/nginx/html/legacy /usr/share/nginx/html/dev

COPY nginx.conf /etc/nginx/

COPY dist/ /usr/share/nginx/html/ui/

COPY latest/ /usr/share/nginx/html/latest/
COPY legacy/ /usr/share/nginx/html/legacy/
COPY dev/ /usr/share/nginx/html/dev/

ADD redirect.html /usr/share/nginx/html/index.html
ADD docker-run.sh /usr/share/nginx/

EXPOSE 8080

CMD ["sh", "/usr/share/nginx/docker-run.sh"]
