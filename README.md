# <img src="https://raw.githubusercontent.com/swagger-api/swagger.io/wordpress/images/assets/SWU-logo-clr.png" width="300">

[![NPM version](https://badge.fury.io/js/swagger-ui.svg)](http://badge.fury.io/js/swagger-ui)
[![Build Status](https://jenkins.swagger.io/view/OSS%20-%20JavaScript/job/oss-swagger-ui-master/badge/icon?subject=jenkins%20build)](https://jenkins.swagger.io/view/OSS%20-%20JavaScript/job/oss-swagger-ui-master/)
[![npm audit](https://jenkins.swagger.io/buildStatus/icon?job=oss-swagger-ui-security-audit&subject=npm%20audit)](https://jenkins.swagger.io/job/oss-swagger-ui-security-audit/lastBuild/console)
![total GitHub contributors](https://img.shields.io/github/contributors-anon/swagger-api/swagger-ui.svg)

![monthly npm installs](https://img.shields.io/npm/dm/swagger-ui.svg?label=npm%20downloads)
![total docker pulls](https://img.shields.io/docker/pulls/swaggerapi/swagger-ui.svg)
![monthly packagist installs](https://img.shields.io/packagist/dm/swagger-api/swagger-ui.svg?label=packagist%20installs)
![gzip size](https://img.shields.io/bundlephobia/minzip/swagger-ui.svg?label=gzip%20size)

* Read this file in portuguese-BR [here](README.md/Portuguese-BR)

**👉🏼 Want to score an easy open-source contribution?** Check out our [Good first issue](https://github.com/swagger-api/swagger-ui/issues?q=is%3Aissue+is%3Aopen+label%3A%22Good+first+issue%22) label.

**🕰️ Looking for the older version of Swagger UI?** Refer to the [*2.x* branch](https://github.com/swagger-api/swagger-ui/tree/2.x).


This repository publishes three different NPM modules:

* [swagger-ui](https://www.npmjs.com/package/swagger-ui) is a traditional npm module intended for use in single-page applications that are capable of resolving dependencies (via Webpack, Browserify, etc).
* [swagger-ui-dist](https://www.npmjs.com/package/swagger-ui-dist) is a dependency-free module that includes everything you need to serve Swagger UI in a server-side project, or a single-page application that can't resolve npm module dependencies.
* [swagger-ui-react](https://www.npmjs.com/package/swagger-ui-react) is Swagger UI packaged as a React component for use in React applications.

We strongly suggest that you use `swagger-ui` instead of `swagger-ui-dist` if you're building a single-page application, since `swagger-ui-dist` is significantly larger.


## Compatibility
The OpenAPI Specification has undergone 5 revisions since initial creation in 2010.  Compatibility between Swagger UI and the OpenAPI Specification is as follows:

Swagger UI Version | Release Date | OpenAPI Spec compatibility | Notes
------------------ | ------------ | -------------------------- | -----
3.18.3 | 2018-08-03 | 2.0, 3.0 | [tag v3.18.3](https://github.com/swagger-api/swagger-ui/tree/v3.18.3)
3.0.21 | 2017-07-26 | 2.0 | [tag v3.0.21](https://github.com/swagger-api/swagger-ui/tree/v3.0.21)
2.2.10 | 2017-01-04 | 1.1, 1.2, 2.0 | [tag v2.2.10](https://github.com/swagger-api/swagger-ui/tree/v2.2.10)
2.1.5 | 2016-07-20 | 1.1, 1.2, 2.0 | [tag v2.1.5](https://github.com/swagger-api/swagger-ui/tree/v2.1.5)
2.0.24 | 2014-09-12 | 1.1, 1.2 | [tag v2.0.24](https://github.com/swagger-api/swagger-ui/tree/v2.0.24)
1.0.13 | 2013-03-08 | 1.1, 1.2 | [tag v1.0.13](https://github.com/swagger-api/swagger-ui/tree/v1.0.13)
1.0.1 | 2011-10-11 | 1.0, 1.1 | [tag v1.0.1](https://github.com/swagger-api/swagger-ui/tree/v1.0.1)

## Documentation

#### Usage
- [Installation](docs/usage/installation.md)
- [Configuration](docs/usage/configuration.md)
- [CORS](docs/usage/cors.md)
- [OAuth2](docs/usage/oauth2.md)
- [Deep Linking](docs/usage/deep-linking.md)
- [Limitations](docs/usage/limitations.md)
- [Version detection](docs/usage/version-detection.md)

#### Customization
- [Overview](docs/customization/overview.md)
- [Plugin API](docs/customization/plugin-api.md)
- [Custom layout](docs/customization/custom-layout.md)

#### Development
- [Setting up](docs/development/setting-up.md)
- [Scripts](docs/development/scripts.md)

##### Integration Tests

You will need JDK of version 7 or higher as instructed here
https://nightwatchjs.org/gettingstarted/#selenium-server-setup

Integration tests can be run locally with `npm run e2e` - be sure you aren't running a dev server when testing!

### Browser support
Swagger UI works in the latest versions of Chrome, Safari, Firefox, and Edge.

### Known Issues

To help with the migration, here are the currently known issues with 3.X. This list will update regularly, and will not include features that were not implemented in previous versions.

- Only part of the parameters previously supported are available.
- The JSON Form Editor is not implemented.
- Support for `collectionFormat` is partial.
- l10n (translations) is not implemented.
- Relative path support for external files is not implemented.

## Security contact

Please disclose any security-related issues or vulnerabilities by emailing [security@swagger.io](mailto:security@swagger.io), instead of using the public issue tracker.




## Portuguese-BR

**👉🏼 Quer conseguir uma contribuição open-source fácil?** Dê uma olha na nossa [Bom primeiro issue](https://github.com/swagger-api/swagger-ui/issues?q=is%3Aissue+is%3Aopen+label%3A%22Good+first+issue%22) etiqueta.

**🕰️ Procurando pela versão mais antiga do Swagger UI?** Refira-se para a [*2.x* branch](https://github.com/swagger-api/swagger-ui/tree/2.x).

Esse repositório publica três módulos NPM diferentes:

* [swagger-ui](https://www.npmjs.com/package/swagger-ui) é um módulo NPM tradicional para uso em aplicações de página única que são capazes de resolver dependências (via Webpack, Browserify, etc).
* [swagger-ui-dist](https://www.npmjs.com/package/swagger-ui-dist) é um módulo livre de dependência que inclui tudo que você precisa para usar Swagger UI em um projeto server-side, ou uma aplicação de página única que não consegue resolver dependências de módulos NPM.
* [swagger-ui-react](https://www.npmjs.com/package/swagger-ui-react) É o Swagger UI empacotado como um componente de React para uso em aplicações React.

Nós fortemente sugerimos que você use `swagger-ui` ao invés de `swagger-ui-dist` se você está construindo uma aplicação de página única, pois `swagger-ui-dist` é um pouco mais extenso.


## Compatibilidade
A OpenAPI Specification passou por 5 revisões desde sua criação em 2010. Compatibilidade entre Swagger UI e a OpenAPI Specification é a seguinte:

Versão do Swagger UI | Data de lançamento | OpenAPI Spec compatibilidade | Notas
------------------ | ------------ | -------------------------- | -----
3.18.3 | 2018-08-03 | 2.0, 3.0 | [tag v3.18.3](https://github.com/swagger-api/swagger-ui/tree/v3.18.3)
3.0.21 | 2017-07-26 | 2.0 | [tag v3.0.21](https://github.com/swagger-api/swagger-ui/tree/v3.0.21)
2.2.10 | 2017-01-04 | 1.1, 1.2, 2.0 | [tag v2.2.10](https://github.com/swagger-api/swagger-ui/tree/v2.2.10)
2.1.5 | 2016-07-20 | 1.1, 1.2, 2.0 | [tag v2.1.5](https://github.com/swagger-api/swagger-ui/tree/v2.1.5)
2.0.24 | 2014-09-12 | 1.1, 1.2 | [tag v2.0.24](https://github.com/swagger-api/swagger-ui/tree/v2.0.24)
1.0.13 | 2013-03-08 | 1.1, 1.2 | [tag v1.0.13](https://github.com/swagger-api/swagger-ui/tree/v1.0.13)
1.0.1 | 2011-10-11 | 1.0, 1.1 | [tag v1.0.1](https://github.com/swagger-api/swagger-ui/tree/v1.0.1)


## Documentation

#### Uso
- [Instalação](docs/usage/installation.md)
- [Configuração](docs/usage/configuration.md)
- [CORS](docs/usage/cors.md)
- [OAuth2](docs/usage/oauth2.md)
- [Deep Linking](docs/usage/deep-linking.md)
- [Limitações](docs/usage/limitations.md)
- [Detecção de versão](docs/usage/version-detection.md)

#### Customização
- [Visão geral](docs/customization/overview.md)
- [Plugin API](docs/customization/plugin-api.md)
- [Layout customizado](docs/customization/custom-layout.md)

#### Desenvolvimento
- [Começando](docs/development/setting-up.md)
- [Scripts](docs/development/scripts.md)

##### Testes de integração

Será preciso o JDK na versão 7 ou maior, como mostra aqui
https://nightwatchjs.org/gettingstarted/#selenium-server-setup

Testes de integração podem ser executados localmente com `npm run e2e` - se certifique que não está rodando um servidor dev quando for testar!

### Suporte de navegador
Swagger UI funciona nas últimas versões do Chrome, Safari, Firefox e Edge.

### Problemas conhecidos

Para ajudar com a migração, aqui estão os atuais problemas com 3.X. Essa lista vai ser atualizada regularmente, e não vai incluir recursos que não foram implementados em versões anteriores.

- Apenas parte dos parâmetros previamente suportados estão disponíveis.
- O JSON Form Editor (Editor de formulário JSON) não está implementado.
- Suporte para `collectionFormat` é parcial.
- l10n (traduções) não está implementado.
- Suporte para caminho relativo para arquivos externos não está implementado.

## Contato de segurança

Por favor compartilhe qualquer problema ou vulnerabilidade relacionada à segurança mandando um email para [security@swagger.io](mailto:security@swagger.io), ao invés de usar o rastreador público de problemas.