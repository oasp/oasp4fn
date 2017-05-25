
import * as AWS from 'aws-sdk';
import * as _ from 'lodash';

let cognito: AWS.CognitoIdentityServiceProvider;
const DEFAULT_OPTS = { region: 'us-west-2' };

export default {
    instance: function (options: object = {}) {
        cognito = new AWS.CognitoIdentityServiceProvider(_.assign(DEFAULT_OPTS, options));
    },
    authenticateUser: async (user: string, password: string, pool: {clientId: string, userPoolId: string}) => {
        let authparams = {
            AuthFlow: 'ADMIN_NO_SRP_AUTH',
            AuthParameters: {
                USERNAME: user,
                PASSWORD: password
            },
            ClientId: pool.clientId,
            UserPoolId: pool.userPoolId
        };

        try {
            let data_auth = <InitiateAuth>await cognito.adminInitiateAuth(authparams).promise();
            if (data_auth.ChallengeName === 'NEW_PASSWORD_REQUIRED') {
                let challengeparams = {
                    ChallengeName: data_auth.ChallengeName,
                    ClientId: pool.clientId,
                    UserPoolId: pool.userPoolId,
                    ChallengeResponses: {
                        NEW_PASSWORD: password,
                        USERNAME: user
                    },
                    Session: data_auth.Session
                };
                let data_challenge = <AuthenticationResult>await cognito.adminRespondToAuthChallenge(challengeparams).promise();
                return { IdToken: data_challenge.AuthenticationResult.IdToken, AccessToken: data_challenge.AuthenticationResult.AccessToken, RefreshToken: data_challenge.AuthenticationResult.RefreshToken };
            }
            else
                return { IdToken: data_auth.AuthenticationResult.IdToken, AccessToken: data_auth.AuthenticationResult.AccessToken, RefreshToken: data_auth.AuthenticationResult.RefreshToken };
        }
        catch (err) {
            return Promise.reject(err);
        }
    },
    refreshToken: async (refresh_token: string, pool: {clientId: string, userPoolId: string}) => {
        let params = {
            AuthFlow: 'REFRESH_TOKEN_AUTH',
            ClientId: pool.clientId,
            UserPoolId: pool.userPoolId,
            AuthParameters: {
                REFRESH_TOKEN: refresh_token
            }
        };
        try {
            let data = <AuthenticationResult>await cognito.adminInitiateAuth(params).promise();
            return { IdToken: data.AuthenticationResult.IdToken, AccessToken: data.AuthenticationResult.AccessToken };
        }
        catch (err) {
           return Promise.reject(err);
        }
    }
};

interface AuthenticationResult {
    AuthenticationResult: {
        IdToken: string;
        AccessToken: string;
        RefreshToken: string;
    };
}

interface InitiateAuth extends AuthenticationResult {
    ChallengeName: string;
    Session: string;
}