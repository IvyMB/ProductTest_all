# Product Manager

Este é um projeto Django que utiliza Docker Compose para facilitar o ambiente de desenvolvimento.

## Pré-requisitos

Certifique-se de ter o Docker e o Docker Compose instalados no seu sistema.

- [Docker](https://docs.docker.com/get-docker/)
- [Docker Compose](https://docs.docker.com/compose/install/)

## Configuração

1. Clone este repositório:
   git clone https://github.com/seu-usuario/seu-projeto.git

2. Inicie os serviços com o docker compose:
    docker-compose up --build

3. guarde até que a aplicação esteja pronta para aceitar conexões.

3. Abra seu navegador e acesse http://localhost:8000.

4. Para interromper a execução da aplicação, pressione Ctrl+C no terminal onde o Docker Compose está sendo executado.

## Autenticação
- Somente usuários autenticados podem criar, editar e deletar produtos.
- Usuários não autenticados podem visualizar a lista de produtos e ver detalhes de algum producto.

## Logging
- A API guarda informações sempre que algum registro foi modificado por algum usuário autenticado.
