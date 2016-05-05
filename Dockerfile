FROM alpine:3.3

MAINTAINER Roman Tarnavski

RUN apk add --update nginx

ADD ./dist/ /usr/share/nginx/html

EXPOSE 80

CMD nginx -g 'daemon off;'