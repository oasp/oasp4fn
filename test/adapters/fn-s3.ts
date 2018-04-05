
import { expect } from 'chai';
import fn from '../../src/index';
import s3 from '../../src/adapters/fn-s3';
import * as AWS from 'aws-sdk';

let endpoint = process.env.ENDPOINT || 'http://localhost:4572/';
let region = process.env.DEFAULT_REGION || 'us-east-1';
let aws_s3 = new AWS.S3({ endpoint: endpoint, region: region, s3ForcePathStyle: true });

fn.setStorage(s3, { endpoint: endpoint, region: region, s3ForcePathStyle: true });

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
                    LocationConstraint: region
                }
            };
            create = aws_s3.createBucket(params).promise();
        }
        else
            return Promise.reject(err);
    }

    await create;
});

describe('upload', function () {
    this.timeout(0);

     it('The function should return a reference to the self object', () => {
         expect(fn.upload('oasp4fn', 'test.txt', new Buffer('someBuffer'))).to.be.an('object');
     });

     it('If the upload is succesfull, the resolution should be the location of the object', async () => {
        const res = await fn.upload('oasp4fn', 'test.txt', new Buffer('test')).promise();
        expect(res).to.be.a('string');
     });

     it('If the bucket doesn\'t exist, the resolution promise should return an Error',  () => {
        return fn.upload('some_bucket', 'test.txt', new Buffer('test'))
            .then((res: string) => {
                expect(res).to.be.undefined;
            }, (err: Error) => {
                expect(err).to.not.be.null;
         });
     });
});

describe('bucket', function () {
     this.timeout(0);

     it('The function should return a reference to the self object', () => {
         expect(fn.bucket('oasp4fn')).to.be.an('object');
     });

     it('If the operation is succesfull, the resolution should be an array with the keys of the objects in the bucket', async () => {
        const res = await fn.bucket('oasp4fn').promise();
        expect(res).to.be.a('array');
        expect(res).to.include('test.txt');
     });

     it('If an object key is especified, the function should return the especified object, as binary data', async () => {
        const res = await fn.bucket('oasp4fn', 'test.txt').promise();
        expect(Buffer.isBuffer(res)).to.be.true;
     });

     it('If the bucket doesn\'t exist, the resolution promise should return an Error', () => {
        return fn.bucket('some_bucket')
            .then((res: string[]) => {
                expect(res).to.be.undefined;
            }, (err: Error) => {
                expect(err).to.not.be.null;
         });
     });
});

describe('deleteObject', function () {
    this.timeout(0);

     before(() => {
        let promises: Promise<object>[] = [];
        promises.push(<Promise<object>>fn.upload('oasp4fn', 'test1.txt', new Buffer('test')).promise());
        promises.push(<Promise<object>>fn.upload('oasp4fn', 'test2.txt', new Buffer('test')).promise());
        promises.push(<Promise<object>>fn.upload('oasp4fn', 'test3.txt', new Buffer('test')).promise());
        promises.push(<Promise<object>>fn.upload('oasp4fn', 'test4.txt', new Buffer('test')).promise());
        promises.push(<Promise<object>>fn.upload('oasp4fn', 'test5.txt', new Buffer('test')).promise());
        return Promise.all(promises);
     });

     it('The function should return a reference to the self object', () => {
         expect(fn.deleteObject('oasp4fn', 'test1.txt')).to.be.an('object');
     });

     it('If the operation is performed over a single object key, the resolution should be the key of the deleted object', async () => {
        const res = await fn.deleteObject('oasp4fn', 'test.txt').promise();
        expect(res).to.be.a('string');
        expect(res).to.be.equal('test.txt');
     });

     it('If the operation is over an array of object keys, the resolution should be the keys of deleted objects', async () => {
        const res = await fn.deleteObject('oasp4fn', ['test2.txt', 'test3.txt']).promise();
        expect(res).to.be.an('array');
        expect(res).to.have.lengthOf(2);
        expect(res).to.have.members(['test2.txt', 'test3.txt']);
     });

     it('If the operation is not starter, the operation delete the objects on which we are operating', async () => {
        const res = await fn.bucket('oasp4fn').deleteObject().promise();
        expect(res).to.be.an('array');
     });

     it('If the bucket doesn\'t exist, the resolution promise should return an Error', () => {
        return fn.deleteObject('some_bucket', 'test')
             .then((res: string) => {
                expect(res).to.be.undefined;
            }, (err: Error) => {
                expect(err).to.not.be.null;
         });
     });
});