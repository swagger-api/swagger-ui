# API Docs Vindi
Este repositório é usado para gerar e publicar a interface web da API Vindi.

URL pública temporária: [https://vindi.github.io/api-docs/dist](https://vindi.github.io/api-docs/dist/)

## Instalação

1. Instale o [nvm](https://github.com/nvm-sh/nvm).
2. Instale a versão necessária do Node.js (definida no arquivo `.nvmrc`:
   ```
   nvm install
   ```

## Desenvolvimento
Todas as alterações devem ser realizadas no diretório `src` e compiladas com o comando `build`:

```
npm run-script build
```
As páginas e assets serão gerados no diretório `dist` do projeto e deverão ser enviadas ao controle de versão.
