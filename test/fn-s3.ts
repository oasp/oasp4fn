
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

describe('upload', () => {

     it('The function should return a reference to the self object', () => {
         expect(fn.upload('oasp4fn', 'id', new Buffer('someBuffer'))).to.be.an('object');
     });
     it('If the upload is succesfull, the resolution should be the location of the object', (done: Function) => {
         console.log('upload 1');
        fn.upload('oasp4fn', 'test.txt', new Buffer('test'))
            .then((res: string) => {
            try {
                console.log('upload resolved');
                console.log(res);
                expect(res).to.be.a('string');
            }
            catch (err) {
                done(err);
            }
         }, (err: Error) => {
             try {
                console.log('upload rejected');
                console.log(err);
                expect(err).to.be.undefined;
             }
             catch (err) {
                done(err);
             }
         });
         console.log('upload 1');
         done();
     });
     it('If the bucket doesn\'t exist, the resolution promise should return an Error', (done: Function) => {
         fn.upload('some_bucket', 'test.txt', new Buffer('test')).then((res: object[]) => {
            try {
                console.log('upload resolved');
                console.log(res);
                expect(res).to.be.undefined;
             }
             catch (err) {
                 done(err);
             }
            }, (err: Error) => {
             try {
                console.log(err);
                expect(err).to.not.be.null;
             }
             catch (err) {
                 done(err);
             }
         });
         done();
     });
});

describe('bucket', () => {

     it('The function should return a reference to the self object', () => {
         expect(fn.bucket('oasp4fn')).to.be.an('object');
     });
     it('If the operation is succesfull, the resolution should be an array with the keys of the objects in the bucket', (done: Function) => {
        fn.bucket('oasp4fn')
            .then((res: string[]) => {
            try {
                console.log(res);
                expect(res).to.be.a('string');
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
         done();
     });
     it('If the bucket doesn\'t exist, the resolution promise should return an Error', (done: Function) => {
         fn.bucket('some_bucket').then((res: string[]) => {
            try {
                expect(res).to.be.undefined;
             }
             catch (err) {
                 done(err);
             }
            }, (err: Error) => {
             try {
                expect(err).to.not.be.null;
             }
             catch (err) {
                 done(err);
             }
         });
         done();
     });
});