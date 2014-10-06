# API Docs Vindi
Este repositório é usado para gerar e publicar a interface de acesso à API Vindi.

## Vagrant

Inicie a máquina virtual:

```
vagrant up
```

Efetue o acesso via SSH:

```
vagrant ssh
```

O diretório `/vagrant` contém os dados do projeto api-docs:

```
cd /vagrant
```
Execute o script build para compilar o projeto:

```
npm run-script build
```

As páginas serão geradas no diretório `dist` do projeto.

Para desligar a máquina virtual, utilize o comando abaixo:

```
vagrant halt
```

## Desenvolvimento
Você poderá editar os arquivos do projeto em sua própria máquina, porém o comando `build` deverá ser executado dentro da máquina virtual.