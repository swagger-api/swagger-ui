###
# swagger-ui - https://github.com/swagger-api/swagger-ui/
# Container for deploying the swagger-ui static site
#
# Build:
#   docker build -t swagger-ui dist/
# Run:
#
#   docker run -v `pwd`/swagger.yaml:/usr/shareginx/html/swagger.yaml:ro -p 8081:80 swagger-ui
# where there's 'doc' file in the swagger folder which could be json or yml
###
FROM nginx:1.8.1-alpine

COPY . /usr/share/nginx/html
