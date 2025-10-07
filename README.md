# TCC Auth Lambda

## Descrição

Este projeto é uma função AWS Lambda que implementa um sistema de autenticação simplificado usando AWS Cognito User Pool. A função permite autenticação usando CPF brasileiro, criando automaticamente novos usuários quando necessário.

## Funcionalidades

- **Autenticação por CPF**: Utiliza o CPF como username e senha
- **Criação automática de usuários**: Se o CPF não existir no User Pool, um novo usuário é criado automaticamente
- **Integração com AWS Cognito**: Gerenciamento completo de usuários através do AWS Cognito User Pool
- **CORS habilitado**: Suporte para requisições cross-origin
- **Tratamento de erros**: Retorna mensagens de erro específicas para diferentes cenários

## Como funciona

1. **Recebe uma requisição POST** com um CPF no body da requisição
2. **Verifica se o usuário existe** no AWS Cognito User Pool
3. **Se não existir**: 
   - Cria um novo usuário com o CPF como username
   - Define o CPF também como senha permanente
4. **Autentica o usuário** usando o CPF como username e senha
5. **Retorna os tokens de autenticação** (ID Token, Access Token, Refresh Token)

## Estrutura da Requisição

### Endpoint
```
POST /
```

### Body da Requisição
```json
{
  "cpf": "12345678901"
}
```

### Resposta de Sucesso (200)
```json
{
  "message": "Autenticação bem-sucedida",
  "newUser": false,
  "idToken": "eyJhbGciOiJSUzI1NiIs...",
  "accessToken": "eyJhbGciOiJSUzI1NiIs...",
  "refreshToken": "eyJhbGciOiJSUzI1NiIs...",
  "expiresIn": 3600
}
```

### Respostas de Erro
- **400**: CPF é obrigatório
- **401**: CPF inválido
- **403**: Usuário não confirmado
- **404**: CPF não encontrado
- **500**: Erro interno

## Variáveis de Ambiente

A função Lambda requer as seguintes variáveis de ambiente:

- `USER_POOL_ID`: ID do AWS Cognito User Pool
- `CLIENT_ID`: ID do Client App configurado no User Pool

## Deployment

Esta função é executada como uma **AWS Lambda Function** e deve ser configurada com:

### Permissões IAM Necessárias
A função Lambda precisa das seguintes permissões para o AWS Cognito:
- `cognito-idp:AdminGetUser`
- `cognito-idp:AdminCreateUser`
- `cognito-idp:AdminSetUserPassword`
- `cognito-idp:AdminInitiateAuth`

### Trigger
Configure um API Gateway ou Application Load Balancer para triggered a função Lambda via HTTP.

## Dependências

- **aws-sdk**: SDK oficial da AWS para Node.js (geralmente já incluído no ambiente Lambda)

## Configuração do Cognito

Para usar esta função, você precisa configurar um AWS Cognito User Pool com:

1. **User Pool** criado
2. **App Client** configurado com:
   - Auth flows: `ADMIN_NO_SRP_AUTH` habilitado
   - Políticas de senha configuradas conforme necessário
3. **Variáveis de ambiente** configuradas na função Lambda

## Segurança

⚠️ **Aviso de Segurança**: Esta implementação usa o CPF tanto como username quanto como senha por simplicidade. Em um ambiente de produção, considere:

- Implementar políticas de senha mais robustas
- Adicionar autenticação multi-fator (MFA)
- Implementar rate limiting
- Usar HTTPS obrigatório
- Validar formato do CPF
- Implementar logs de auditoria

## Desenvolvimento

### Estrutura do Projeto
```
tcc-auth-lambda/
├── index.js          # Função principal da Lambda
├── package.json       # Dependências (se necessário)
└── README.md         # Este arquivo
```

### Logs
A função registra logs importantes no CloudWatch:
- Criação de novos usuários
- Tentativas de autenticação
- Erros de autenticação

## Suporte

Este projeto foi desenvolvido como parte de um TCC (Trabalho de Conclusão de Curso) e utiliza AWS Lambda como plataforma de execução serverless.
