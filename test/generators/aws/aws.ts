
import { expect } from 'chai';
import { run } from '../../../src/generators/index';
import { tscParser } from '../../../src/generators/aws';
import * as fs from 'fs';

let DEFAULTCONFIG = {
    path: 'handlers',
    provider: { name: 'aws', runtime: 'nodejs6.10', region: 'us-west-2' },
    plugins: ['serverless-webpack', 'serverless-offline']
}

describe('run', () => {

    it('If the path doesn\'t exist, an error should raise', () => {
        try {
            run();
        } catch (err) {
            expect(err).to.exist;
        }
    });

    it('If the provider specified doesn\'t exist the function should raise an error', () => {
        try {
            run({provider: 'awx'});
        } catch (err) {
            expect(err).to.exist;
        }
    });

    it('If a correct path is specified with no more options, the function generates de files for aws with the default options', () => {
        run({path: './test/generators/aws/handlers'});
    });

    after(() => {
        fs.unlinkSync('webpack.config.js');
        fs.unlinkSync('serverless.yml');
    });

});

describe('tscParser', () => {

    it('If no files are provided, the function return an empty yaml', () => {
        const res = tscParser([], DEFAULTCONFIG);
        expect(res).to.be.an('object');
        expect(res.imports).to.be.empty;
        expect(res.routes).to.be.empty;
        expect(res.functions).to.be.empty;
        expect(res.provider).to.not.be.empty;
    });

    it('If valid handler files are provided, the yaml should have the handlers data', () => {
        const files = [
            './test/generators/aws/handlers/Http/GET/get-handler.ts',
            './test/generators/aws/handlers/Http/POST/post-handler.ts',
            './test/generators/aws/handlers/Http/DELETE/delete-handler.ts',
            './test/generators/aws/handlers/Http/PUT/put-handler.ts',
            './test/generators/aws/handlers/S3/Created/create-handler.ts',
            './test/generators/aws/handlers/S3/Removed/remove-handler.ts',
        ]
        const res = tscParser(files, DEFAULTCONFIG);
        expect(res).to.be.an('object');
        expect(res.imports).to.be.empty;
        expect(res.routes).to.be.empty;
        expect(res.functions).to.contains.all.keys(['removeTemplate', 'createTemplate', 'putTemplate', 'deleteTemplate', 'postTemplate', 'getTemplate']);
        expect(res.provider).to.not.be.empty;
    });

});