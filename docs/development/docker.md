# Docker images

## Building locally

**Privileged image**:

```sh
 $ docker build . -t swaggerapi/swagger-ui:next
 $ docker run -d -p 8080:8080 swaggerapi/swagger-ui:next
```

Now open your browser at `http://localhost:8080/`.

**Unprivileged image**:

```sh
 $ docker build . -f Dockerfile.unprivileged -t swaggerapi/swagger-ui:next-unprivileged
 $ docker run -d -p 8080:8080 swaggerapi/swagger-ui:next-unprivileged
```

Now open your browser at `http://localhost:8080/`.
