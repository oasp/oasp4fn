import { expect } from 'chai';
import * as fs from 'fs-extra';
import * as _ from 'lodash';
import { sep, join} from 'path';
import { NewProjectOptions, ProjectType, NewHandlerOptions } from '../../src/cli/types/cliTypes';
import { generateNewProject } from '../../src/cli/logic/newProject';
import { generateNewHandler } from '../../src/cli/logic/serverless/newHandler';

const tmpDir = (process.env.TMP || '/tmp') + sep + 'oasp4fn';

before(function() {
    fs.ensureDirSync(tmpDir);
    fs.emptyDirSync(tmpDir);
});

after(function() {
    fs.emptyDirSync(tmpDir);
});

describe('CLI: oasp4fn', function () {
    describe('serverless', function() {
        describe('new', function() {
            let options: NewProjectOptions;

            before(function() {
                options = {
                    projectName: 'test-project',
                    path: tmpDir + '/test-project-serverless',
                    provider: 'aws',
                    name: 'oasp',
                    email: 'oasp@capgemini.com'
                };

                generateNewProject(ProjectType.Serverless, options);
            });

            it('Shold copy all files into destination path', function() {
                const template = fs.readdirSync(join(__dirname, '../../templates/serverless/aws/project'));
                const dest = fs.readdirSync(options.path);

                expect(_.difference(template, dest)).is.empty;
            });

            it('Should write the project name, author name and author email in the package.json', function() {
                const pack = require(options.path + sep + 'package.json');

                expect(pack.name).is.equals(options.projectName, 'Project name is not set properly');
                expect(pack.author).is.not.null;
                expect(pack.author.name).is.equals(options.name, 'Author name is not set properly');
                expect(pack.author.email).is.equals(options.email, 'Author email is not set properly');
            });
        });

        describe('generate', function() {
            describe('handler', function() {
                let options: NewHandlerOptions;
                let handlerPath: string;

                before(function() {
                    options = {
                        event: 'Http',
                        provider: 'aws',
                        trigger: 'GET',
                        'handler-name': 'test',
                        path: '/path',
                    };
                    handlerPath = join(tmpDir, 'test-project-serverless/handlers', options.event, options.trigger, options['handler-name'] + '-handler.ts');

                    generateNewHandler(options, join(tmpDir, '/test-project-serverless'));
                });

                it('Should create a new handler at test-project-serverless/handlers/Http/GET', function() {
                    expect(fs.pathExistsSync(handlerPath)).is.true;
                });

                it('The handler file should contain a function with the handler name', function() {
                    const handlerFile: string = fs.readFileSync(handlerPath).toString();

                    expect(handlerFile).includes(`export async function ${options['handler-name']}`);
                    expect(handlerFile).includes(`oasp4fn.config({path: '${options.path}'});`);
                });
            });
        });
    });

    describe('nestjs', function() {
        describe('new', function() {
            let options: NewProjectOptions;

            before(function() {
                options = {
                    projectName: 'test-project',
                    path: tmpDir + '/test-project-nestjs',
                    name: 'oasp',
                    email: 'oasp@capgemini.com'
                };

                generateNewProject(ProjectType.Nestjs, options);
            });

            it('Shold copy all files into destination path', function() {
                const template = fs.readdirSync(join(__dirname, '../../templates/nestjs/project'));
                const dest = fs.readdirSync(options.path);

                expect(_.difference(template, dest)).is.empty;
            });

            it('Should write the project name, author name and author email in the package.json', function() {
                const pack = require(options.path + sep + 'package.json');

                expect(pack.name).is.equals(options.projectName, 'Project name is not set properly');
                expect(pack.author).is.not.null;
                expect(pack.author.name).is.equals(options.name, 'Author name is not set properly');
                expect(pack.author.email).is.equals(options.email, 'Author email is not set properly');
            });
        });
    });
});
