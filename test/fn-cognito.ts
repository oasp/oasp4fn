
import { expect } from 'chai';
import fn from '../src/index';
import cognito from '../src/adapters/fn-cognito';
import * as AWS from 'aws-sdk';

let region = process.env.REGION || 'us-west-2';
let pool: { clientId: string, userPoolId: string};
let aws_cognito = new AWS.CognitoIdentityServiceProvider({ region: region });

fn.setAuth(cognito);

before(async function () {
    let create: Promise<AWS.CognitoIdentityServiceProvider.CreateUserPoolClientResponse | AWS.CognitoIdentityServiceProvider.AdminCreateUserResponse>[] = [];
    this.skip();

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
    it('The function should return a reference to the self object', (done: Function) => {
         try {
             expect(fn.login('user', 'P@ssw0rd', pool)).to.be.an('object');
             done();
         }
         catch (err) {
             done(err);
         }
    });
    it('If the function is succesful, the result should be an object with the tokens provided by cognito', (done: Function) => {
        fn.login('user', 'P@ssw0rd', pool)
            .then((res: object) => {
                    try {
                        expect(res).to.be.an('object');
                        expect(res).to.contain.all.keys(['IdToken', 'AccessToken', 'RefreshToken']);
                        done();
                    } catch (error) {
                        done(error);
                    }
            }, (err: Error) => {
                    try {
                        expect(err).to.be.undefined;
                        done();
                    } catch (error) {
                        done(error);
                    }
            });
    });
    it('If some of the parameters are incorrect the function should return an error', (done: Function) => {
            fn.login('us', 'P@ssw0rd', pool)
            .then((res: object) => {
                    try {
                        expect(res).to.be.undefined;
                    } catch (error) {
                        done(error);
                    }
            }, (err: Error) => {
                    try {
                        expect(err).to.not.be.null;
                    } catch (error) {
                        done(error);
                    }
            });
                fn.login('user', 'pass', pool)
                .then((res: object) => {
                    try {
                        expect(res).to.be.undefined;
                        done();
                    } catch (error) {
                        done(error);
                    }
                }, (err: Error) => {
                    try {
                        expect(err).to.not.be.null;
                        done();
                    } catch (error) {
                        done(error);
                    }
                });
        });
});

describe.skip('refresh', function () {
    this.timeout(0);
    let refresh_token: string;
    before((done: Function) => {
        fn.login('user', 'P@ssw0rd', pool)
            .then((res: {RefreshToken: string}) => {
                refresh_token = res.RefreshToken;
                done();
            }, (err: Error) => done(err));
    });
    it('The function should return a reference to the self object', () => {
         expect(fn.refresh(refresh_token, pool)).to.be.an('object');
    });
    it('If the function is succesful, the result should be an object with the tokens provided by cognito, except the refresh token', (done: Function) => {
        fn.refresh(refresh_token, pool)
            .then((res: object) => {
                try {
                    expect(res).to.be.an('object');
                    expect(res).to.contain.all.keys(['IdToken', 'AccessToken']);
                    done();
                } catch (error) {
                    done(error);
                }
            }, (err: Error) => {
                try {
                    expect(err).to.be.undefined;
                    done();
                } catch (error) {
                    done(error);
                }
            });
    });
    it('If the refresh token is incorrect the function should return an error', (done: Function) => {
        fn.refresh('some_token', pool)
            .then((res: object) => {
                try {
                    expect(res).to.be.undefined;
                    done();
                } catch (error) {
                    done(error);
                }
            }, (err: Error) => {
                try {
                    expect(err).to.not.be.null;
                    done();
                } catch (error) {
                    done(error);
                }
            });
    });
});

// after(async () => {
//     try {
//         await aws_cognito.deleteUserPool({ UserPoolId: pool.userPoolId}).promise();
//     }catch (err) {
//         return Promise.reject(err);
//     }
// });
