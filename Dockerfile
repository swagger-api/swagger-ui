###
# swagger-ui-builder - https://github.com/swagger-api/swagger-ui/
# Container for building the swagger-ui static site
#
# Build: docker build -t swagger-ui-builder .
# Run:   docker run -v $PWD/dist:/build/dist swagger-ui-builder
#
###

FROM vmware/node:4.2.4

WORKDIR /build

COPY . /build

RUN npm install

EXPOSE 8080

CMD /build/node_modules/gulp/bin/gulp.js serve