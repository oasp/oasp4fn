import { Argv, Arguments } from 'yargs';
import * as path from 'path';
import * as fs from 'fs-extra';
import * as chalk from 'chalk';
import * as inquirer from 'inquirer';
import * as _ from 'lodash';
import { ProjectType, NewProjectOptions } from '../../types/cliTypes';
import { generateNewProject } from '../../logic/newProject';

export const command: string = 'new [project-name]';
export const aliases: string[] = ['n'];
export const desc: string =  'Create a new nestjs project based on template';

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
    })
    .example('$0 nestjs new -p ./new-project', `Create a new nestjs project at ${process.cwd()}${path.sep}new-project`)
    .version(false);

export const handler = (argv: Arguments) => {
    let template: string = argv.projectType;
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

        generateNewProject(ProjectType.Nestjs, options);
    }, (reason: any) => {
        throw reason;
    }).catch((reason: any) => {
        throw reason;
    });
};
