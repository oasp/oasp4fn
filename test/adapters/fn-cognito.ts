
import { expect } from 'chai';
import fn from '../../src/index';
import cognito from '../../src/adapters/fn-cognito';
import * as AWS from 'aws-sdk';

let region = process.env.REGION || 'us-west-2';
let pool: { clientId: string, userPoolId: string};
let aws_cognito = new AWS.CognitoIdentityServiceProvider({ region: region });

fn.setAuth(cognito);

before(async function () {
    this.skip();
    let create: Promise<AWS.CognitoIdentityServiceProvider.CreateUserPoolClientResponse | AWS.CognitoIdentityServiceProvider.AdminCreateUserResponse>[] = [];

    try {
        let res = await aws_cognito.createUserPool({ PoolName: 'oasp4fn'}).promise();
        pool = { clientId: '', userPoolId: (<{UserPool: {Id: string}}>res).UserPool.Id};
        create.push(aws_cognito.createUserPoolClient({ UserPoolId: pool.userPoolId, ClientName: 'oasp4fn', ExplicitAuthFlows: ['ADMIN_NO_SRP_AUTH']}).promise());
        create.push(aws_cognito.adminCreateUser({ UserPoolId: pool.userPoolId, Username: 'user', TemporaryPassword: 'P@ssw0rd'}).promise());
        let values = await Promise.all(create);
        pool.clientId = <string>(<{UserPoolClient: {ClientId: string}}>values[0]).UserPoolClient.ClientId;
    } catch (err) {
        return Promise.reject(err);
    }
});

describe.skip('login', function () {
    this.timeout(0);

    it('The function should return a reference to the self object', () => {
        expect(fn.login('user', 'P@ssw0rd', pool)).to.be.an('object');
    });

    it('If the function is succesful, the result should be an object with the tokens provided by cognito', async () => {
        const res = await fn.login('user', 'P@ssw0rd', pool)
                            .promise();
        expect(res).to.be.an('object');
        expect(res).to.contain.all.keys(['IdToken', 'AccessToken', 'RefreshToken']);
    });

    it('If the user is incorrect the function should return an error', () => {
        return fn.login('us', 'P@ssw0rd', pool)
            .then((res: object) => {
                expect(res).to.be.undefined;
            }, (err: Error) => {
                expect(err).to.not.be.null;
            });
    });

    it('If the password is incorrect the function should return an error', () => {
        return fn.login('user', 'pass', pool)
            .then((res: object) => {
                expect(res).to.be.undefined;
            }, (err: Error) => {
                expect(err).to.not.be.null;
            });
    });
});

describe.skip('refresh', function () {
    this.timeout(0);
    let refresh_token: string;

    before( async () => {
        const res = <{ RefreshToken: string }>await fn.login('user', 'P@ssw0rd', pool)
                                                      .promise();
        refresh_token = res.RefreshToken;
    });

    it('The function should return a reference to the self object', () => {
         expect(fn.refresh(refresh_token, pool)).to.be.an('object');
    });

    it('If the function is succesful, the result should be an object with the tokens provided by cognito, except the refresh token', async () => {
        const res = await fn.refresh(refresh_token, pool)
                            .promise();
        expect(res).to.be.an('object');
        expect(res).to.contain.all.keys(['IdToken', 'AccessToken']);
    });

    it('If the refresh token is incorrect the function should return an error', () => {
        return fn.refresh('some_token', pool)
            .then((res: object) => {
                expect(res).to.be.undefined;
            }, (err: Error) => {
                expect(err).to.not.be.null;
            });
    });
});

after(async () => {
    if (pool && pool.userPoolId) {
        await aws_cognito.deleteUserPool({ UserPoolId: pool.userPoolId}).promise();
    }
});
