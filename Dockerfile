FROM node:6

RUN apt-get update -y && \
    apt-get install -y nginx \
    python \
    python-dev \
    python-pip \
    && pip install PyYAML \
    && pip install awscli --ignore-installed six

RUN npm install -g swagger-tools

COPY nginx.conf /etc/nginx/
RUN mkdir -p /app

COPY . /app/

WORKDIR /app

RUN npm install
RUN ./node_modules/.bin/gulp

RUN rm -rf /usr/share/nginx/html && \
    cp -R /app/dist /usr/share/nginx/html && \
    rm -rf /app

WORKDIR /usr/share/nginx/html

EXPOSE 8080

CMD nginx -g 'daemon off;'
