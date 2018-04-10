import { Argv, Arguments } from 'yargs';
import * as path from 'path';
import * as fs from 'fs-extra';
import * as inquirer from 'inquirer';
import * as _ from 'lodash';
import { generateNewProject } from '../../logic/newProject';
import { ProjectType, NewProjectOptions } from '../../types/cliTypes';

export const command: string = 'new [project-name]';
export const aliases: string[] = ['n'];
export const desc: string =  'Create a new serverless project based on template';

export const builder =  (yargs: Argv) =>
    yargs.usage('Usage: $0 new [project-name] [Options]')
        .positional('project-name', {
        desc: 'The name of the project that you want to create',
        type: 'string',
    }).options({
        path: {
            alias: 'p',
            type: 'string',
            nargs: 1,
            desc: 'The destination path where the project will be created. If not given the actual folder will be used'
        },
        force: {
            alias: 'f',
            type: 'boolean',
            desc: 'Force to create a new project'
        },
        provider: {
            alias: 'P',
            type: 'string',
            nargs: 1,
            default: 'aws',
            choices: ['aws'],
            desc: 'The provider for which you want to generate the new project'
        }
    })
    .example('$0 serverless new -p ./new-project', `Create a new serverless project at ${process.cwd()}${path.sep}new-project`)
    .version(false);

export const handler = (argv: Arguments) => {
    const questions: inquirer.Question[] = [
        {
            name: 'projectName',
            message: 'Enter the project name',
            when: () => !argv.projectName
        }, {
            name: 'name',
            type: 'input',
            message: 'Enter the author full name',
        }, {
            name: 'email',
            type: 'input',
            message: 'Enter the author email',
        },
    ];

    if (argv.path) {
        fs.ensureDirSync(path.join(process.cwd(), argv.path));
    } else {
        argv.path = process.cwd();
    }

    if (fs.readdirSync(argv.path).length > 0 && !argv.f) {
        throw `The folder must be empty. Use -f in order to force the project creation`;
    }

    inquirer.prompt(questions).then((values: inquirer.Answers) => {
        const options: NewProjectOptions = _.assign(argv, values) as any;

        generateNewProject(ProjectType.Serverless, options);
    }, (reason: any) => {
        throw reason;
    }).catch((reason: any) => {
        throw reason;
    });
};
