FROM alpine:3.4

MAINTAINER Roman Tarnavski

RUN apk add --update nginx
RUN mkdir -p /run/nginx

COPY nginx.conf /etc/nginx/
ADD ./dist/ /usr/share/nginx/html

EXPOSE 8080

CMD nginx -g 'daemon off;'
