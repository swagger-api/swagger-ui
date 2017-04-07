FROM alpine:3.4

MAINTAINER fehguy

RUN apk add --update nginx
RUN mkdir -p /run/nginx

COPY nginx.conf /etc/nginx/

# copy swagger files to the `/js` folder
ADD ./dist/* /usr/share/nginx/html/

EXPOSE 8080

CMD exec nginx -g 'daemon off;'
