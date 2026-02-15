## Tech Challenge 2


Rodando o projeto: 
- Docker
    # Construir a imagem
    docker build -t tech-challenge .

    # Executar o container
    docker run -p 3000:3000 tech-challenge

- Sem docker

    npm i
    npm run dev


### Importando collection no postman
- Neste projeto possui o arquivo tech-challenge-2.postman_collection que é uma collection do postman, você tendo o postman pode clicar no botão de import e selecionar esse arquivo lá na caixa de drop,
após realizar a importação você terá todo os Requests desse projeto.

![alt text](image.png)

![alt text](image-1.png)


### Swagger

para acessar o Swagger basta você entrar na rota /docs
as rotas que necessitam de Autenticação você pode colar o Bearer token no cadeado

### Autenticando 

#### Criando usuário
    "http:localhost:3000/user"
    body:
        {
            "username": "Aluno Carequinha",
            "email": "teste@gmail.com",
            "password": "testes"
        }  

    cURL
    ``` 
        curl --location 'localhost:3000/user' \
        --header 'Content-Type: application/json' \
        --data-raw '{
            "username": "Aluno Carequinha",
            "email": "teste@gmail.com",
            "password": "testes"
        }'
    ```

    returno:

    ```
    {
        "message": "usuário criado com sucesso",
        "result": {
            "username": "Aluno Carequinha",
            "email": "teste@gmail.com",
            "password": "testes",
            "id": "67607133f840bb97892eb657"
        }
    }
    ```

#### Autenticando
    "localhost:3000/user/auth"
    Body: 
        {
            "email": "teste@gmail.com",
            "password": "testes"
        }
    cURL
    ```
        curl --location 'localhost:3000/user/auth' \
        --header 'Content-Type: application/json' \
        --data-raw '{
            "email": "teste@gmail.com",
            "password": "testes"
        }'
    ```

    retorno
    ```
        {
            "message": "Usuário autenticado com sucesso",
            "result": {
                "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6IklzcmFlbCAyIiwiZW1haWwiOiJ0ZXN0ZUBnbWFpbC5jb20iLCJwYXNzd29yZCI6InRlc3RlcyIsImlkIjoiNjc2MDcxMzNmODQwYmI5Nzg5MmViNjU3IiwiaWF0IjoxNzM0MzczNjg4LCJleHAiOjE3MzQ0MTY4ODh9.jtaRKSifN_j7rFWn1KkH5fykecwhXFW0G4wLqj24I-k"
            }
        }
    ```

    Esse Token deve user usado para realizar as chamadas das outras apis

### Conta

#### Buscando conta
    "localhost:3000/account"

    Authorization: Bearer {{Token}}

    cURL
    ```
        curl --location 'localhost:3000/account' \
        --header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6IklzcmFlbCAyIiwiZW1haWwiOiJ0ZXN0ZUBnbWFpbC5jb20iLCJwYXNzd29yZCI6InRlc3RlcyIsImlkIjoiNjc2MDcxMzNmODQwYmI5Nzg5MmViNjU3IiwiaWF0IjoxNzM0MzczNjg4LCJleHAiOjE3MzQ0MTY4ODh9.jtaRKSifN_j7rFWn1KkH5fykecwhXFW0G4wLqj24I-k'
    ```
    Retorno
    ```
        {
            "message": "Conta encontrada carregado com sucesso",
            "result": {
                "account": [
                    {
                        "id": "67607133f840bb97892eb659",
                        "type": "Debit",
                        "userId": "67607133f840bb97892eb657"
                    }
                ],
                "transactions": [
                    {
                        "id": "67607174f840bb97892eb669",
                        "accountId": "67607133f840bb97892eb659",
                        "type": "Debit",
                        "value": -200,
                        "date": "2024-12-16T18:29:08.734Z"
                    },
                    {
                        "id": "67607174f840bb97892eb669",
                        "accountId": "67607133f840bb97892eb659",
                        "type": "Credit",
                        "value": 200,
                        "from": "text",
                        "to": "text",
                        "anexo": "text",
                        "date": "2024-12-16T18:29:08.734Z"
                    }
                ],
                "cards": [
                    {
                        "id": "67607133f840bb97892eb65b",
                        "accountId": "67607133f840bb97892eb659",
                        "type": "Debit",
                        "is_blocked": false,
                        "number": "13748712374891010",
                        "dueDate": "2027-01-07T00:00:00.000Z",
                        "functions": "Debit",
                        "cvc": "505",
                        "paymentDate": null,
                        "name": "Carequinha"
                    }
                ]
            }
        }
    ```

#### Criando Transação
    "localhost:3000/account/transaction"

    Body

        {
            "accountId": "67607133f840bb97892eb659",
            "type": "Credit", // Credit | Debit
            "value": 200,
            "from": "text", // String
            "to": "text", // String
            "anexo": "text", // String
        }

    cURL
    ```
        curl --location 'localhost:3000/account/transaction' \
        --header 'Content-Type: application/json' \
        --header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6IklzcmFlbCAyIiwiZW1haWwiOiJ0ZXN0ZUBnbWFpbC5jb20iLCJwYXNzd29yZCI6InRlc3RlcyIsImlkIjoiNjc2MDcxMzNmODQwYmI5Nzg5MmViNjU3IiwiaWF0IjoxNzM0MzczNjg4LCJleHAiOjE3MzQ0MTY4ODh9.jtaRKSifN_j7rFWn1KkH5fykecwhXFW0G4wLqj24I-k' \
        --data '{
            "accountId": "67607133f840bb97892eb659",
            "value": 200,
            "type": "Debit"
        }'
    ```

    Retorno
        {
            "id": "67607174f840bb97892eb669",
            "accountId": "67607133f840bb97892eb659",
            "type": "Debit",
            "value": -200,
            "date": "2024-12-16T18:29:08.734Z"
        }

#### Buscando extrato
    localhost:3000/account/{{accountId}}/statement

    Authorization Bearer {{Token}}
    Param:
        accountId

    ```
        curl --location 'localhost:3000/account/67607133f840bb97892eb659/statement' \
        --header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6IklzcmFlbCAyIiwiZW1haWwiOiJ0ZXN0ZUBnbWFpbC5jb20iLCJwYXNzd29yZCI6InRlc3RlcyIsImlkIjoiNjc2MDcxMzNmODQwYmI5Nzg5MmViNjU3IiwiaWF0IjoxNzM0MzczNjg4LCJleHAiOjE3MzQ0MTY4ODh9.jtaRKSifN_j7rFWn1KkH5fykecwhXFW0G4wLqj24I-k'
    ```

    Retorno
        {
            "message": "Transação criada com sucesso",
            "result": {
                "transactions": [
                    {
                        "id": "67607171f840bb97892eb665",
                        "accountId": "67607133f840bb97892eb659",
                        "type": "Credit",
                        "value": 200,
                        "date": "2024-12-16T18:29:05.170Z"
                    },
                    {
                        "id": "67607172f840bb97892eb667",
                        "accountId": "67607133f840bb97892eb659",
                        "type": "Debit",
                        "value": -200,
                        "date": "2024-12-16T18:29:06.250Z"
                    },
                    {
                        "id": "67607174f840bb97892eb669",
                        "accountId": "67607133f840bb97892eb659",
                        "type": "Debit",
                        "value": -200,
                        "date": "2024-12-16T18:29:08.734Z"
                    }
                ]
            }
        }