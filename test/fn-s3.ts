
import { expect } from 'chai';
import fn from '../src/index';
import s3 from '../src/adapters/fn-s3';
import * as AWS from 'aws-sdk';

let aws_s3 = new AWS.S3();

fn.setStorage(s3);

before(async function () {
    let create: Promise<void | AWS.S3.CreateBucketOutput>;
    this.timeout(0);

    try {
        await aws_s3.headBucket({ Bucket: 'oasp4fn' }).promise();
        create = Promise.resolve();
    } catch (err) {
        if (err.code === 'NotFound') {
            let params = {
                Bucket: 'oasp4fn',
                ACL: 'public-read-write',
                CreateBucketConfiguration: {
                    LocationConstraint: 'us-west-2'
                }
            };
            create = aws_s3.createBucket(params).promise();
        }
        else
            return Promise.reject(err);
    }

    try {
        await create;
    } catch (err) {
        return Promise.reject(err);
    }
});

describe('upload', function () {
    this.timeout(0);
     it('The function should return a reference to the self object', () => {
         expect(fn.upload('oasp4fn', 'test.txt', new Buffer('someBuffer'))).to.be.an('object');
     });
     it('If the upload is succesfull, the resolution should be the location of the object', (done: Function) => {
        fn.upload('oasp4fn', 'test.txt', new Buffer('test'))
            .then((res: string) => {
            try {
                expect(res).to.be.a('string');
                done();
            }
            catch (err) {
                done(err);
            }
         }, (err: Error) => {
             try {
                expect(err).to.be.undefined;
                done();
             }
             catch (err) {
                done(err);
             }
         });
     });
     it('If the bucket doesn\'t exist, the resolution promise should return an Error', (done: Function) => {
         fn.upload('some_bucket', 'test.txt', new Buffer('test'))
             .then((res: string) => {
            try {
                expect(res).to.be.undefined;
                done();
             }
             catch (err) {
                 done(err);
             }
            }, (err: Error) => {
             try {
                expect(err).to.not.be.null;
                done();
             }
             catch (err) {
                 done(err);
             }
         });
     });
});

describe('bucket', function () {
     this.timeout(0);
     it('The function should return a reference to the self object', () => {
         expect(fn.bucket('oasp4fn')).to.be.an('object');
     });
     it('If the operation is succesfull, the resolution should be an array with the keys of the objects in the bucket', (done: Function) => {
        fn.bucket('oasp4fn')
            .then((res: string[]) => {
            try {
                expect(res).to.be.a('array');
                expect(res).to.include('test.txt');
                done();
            }
            catch (err) {
                done(err);
            }
         }, (err: Error) => {
             try {
                expect(err).to.be.undefined;
                done();
             }
             catch (err) {
                done(err);
             }
         });
     });
     it('If an object key is especified, the function should return the especified object, as binary data', (done: Function) => {
        fn.bucket('oasp4fn', 'test.txt')
            .then((res: Buffer) => {
            try {
                expect(Buffer.isBuffer(res)).to.be.true;
                done();
            }
            catch (err) {
                done(err);
            }
         }, (err: Error) => {
             try {
                expect(err).to.be.undefined;
                done();
             }
             catch (err) {
                done(err);
             }
         });
     });
     it('If the bucket doesn\'t exist, the resolution promise should return an Error', (done: Function) => {
         fn.bucket('some_bucket').then((res: string[]) => {
            try {
                expect(res).to.be.undefined;
                done();
             }
             catch (err) {
                 done(err);
             }
            }, (err: Error) => {
             try {
                expect(err).to.not.be.null;
                done();
             }
             catch (err) {
                 done(err);
             }
         });
     });
});

describe('deleteObject', function () {
    this.timeout(0);
     before((done: Function) => {
        let promises: Promise<object>[] = [];
        promises.push(<Promise<object>>fn.upload('oasp4fn', 'test1.txt', new Buffer('test')).promise());
        promises.push(<Promise<object>>fn.upload('oasp4fn', 'test2.txt', new Buffer('test')).promise());
        promises.push(<Promise<object>>fn.upload('oasp4fn', 'test3.txt', new Buffer('test')).promise());
        Promise.all(promises)
            .then((res: any) => {
                done();
            }, (err: Error) => {
                done(err);
            });
     });
     it('The function should return a reference to the self object', () => {
         expect(fn.deleteObject('oasp4fn', 'test1.txt')).to.be.an('object');
     });
     it('If the operation is succesfull, the resolution should be the key or keys of deleted object/s', (done: Function) => {
        fn.deleteObject('oasp4fn', 'test.txt')
            .then((res: string) => {
            try {
                expect(res).to.be.a('string');
                expect(res).to.be.equal('test.txt');
            }
            catch (err) {
                done(err);
            }
         }, (err: Error) => {
             try {
                expect(err).to.be.undefined;
             }
             catch (err) {
                done(err);
             }
         });
         fn.deleteObject('oasp4fn', ['test2.txt', 'test3.txt'])
            .then((res: string[]) => {
            try {
                expect(res).to.be.an('array');
                expect(res).to.include.members(['test2.txt', 'test3.txt']);
                done();
            }
            catch (err) {
                done(err);
            }
         }, (err: Error) => {
             try {
                expect(err).to.be.undefined;
                done();
             }
             catch (err) {
                done(err);
             }
         });
     });
     it('If the bucket doesn\'t exist, the resolution promise should return an Error', (done: Function) => {
         fn.deleteObject('some_bucket', 'test')
             .then((res: string) => {
            try {
                expect(res).to.be.undefined;
                done();
             }
             catch (err) {
                 done(err);
             }
            }, (err: Error) => {
             try {
                expect(err).to.not.be.null;
                done();
             }
             catch (err) {
                 done(err);
             }
         });
     });
});