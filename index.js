const AWS = require('aws-sdk');
const cognito = new AWS.CognitoIdentityServiceProvider();

const USER_POOL_ID = process.env.USER_POOL_ID;
const CLIENT_ID = process.env.CLIENT_ID;

exports.handler = async (event) => {
    const headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type,Authorization',
        'Access-Control-Allow-Methods': 'POST,OPTIONS',
        'Content-Type': 'application/json'
    };

    // Handle preflight OPTIONS request
    if (event.httpMethod === 'OPTIONS') {
        return {
            statusCode: 200,
            headers,
            body: ''
        };
    }

    try {
        const { cpf } = JSON.parse(event.body);

        if (!cpf) {
            return {
                statusCode: 400,
                headers,
                body: JSON.stringify({ message: 'CPF é obrigatório' })
            };
        }

        // Autenticar usando CPF como username E senha
        const authResult = await cognito.adminInitiateAuth({
            UserPoolId: USER_POOL_ID,
            ClientId: CLIENT_ID,
            AuthFlow: 'ADMIN_NO_SRP_AUTH',
            AuthParameters: {
                USERNAME: cpf,
                PASSWORD: cpf
            }
        }).promise();

        return {
            statusCode: 200,
            headers,
            body: JSON.stringify({
                message: 'Autenticação bem-sucedida',
                idToken: authResult.AuthenticationResult.IdToken,
                accessToken: authResult.AuthenticationResult.AccessToken,
                refreshToken: authResult.AuthenticationResult.RefreshToken,
                expiresIn: authResult.AuthenticationResult.ExpiresIn
            })
        };

    } catch (error) {
        console.error('Erro:', error);
        
        let message = 'Erro ao autenticar';
        let statusCode = 401;
        
        if (error.code === 'UserNotFoundException') {
            message = 'CPF não encontrado';
            statusCode = 404;
        } else if (error.code === 'NotAuthorizedException') {
            message = 'CPF inválido';
            statusCode = 401;
        } else if (error.code === 'UserNotConfirmedException') {
            message = 'Usuário não confirmado';
            statusCode = 403;
        } else {
            statusCode = 500;
            message = 'Erro interno ao autenticar';
        }
        
        return {
            statusCode,
            headers,
            body: JSON.stringify({ 
                message, 
                error: error.message 
            })
        };
    }
};