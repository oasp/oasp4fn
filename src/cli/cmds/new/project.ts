import { Argv, Arguments } from "yargs";
import * as path from 'path';
import * as fs from 'fs-extra';


export const command: string = 'project <project-type>';
export const desc: string =  'Create a new project based on template';

export const builder =  (yargs: Argv) =>
    yargs.usage('Usage: $0 new project <project-type> [Options]')
        .positional('project-type', {
        desc: 'The type of project that you want to create',
        choices: ['serverless', 'nestjs'],
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
        }
    })
    .example('$0 new project nestjs -p ./new-project', `Create a new nestjs project at ${process.cwd()}${path.sep}new-project`)
    .version(false);

export const handler = (argv: Arguments) => {
    if (argv.path) {
        fs.ensureDirSync(path.join(process.cwd(), argv.path));
    }
    else {
        argv.path = process.cwd();
    }
    if (!fs.emptyDirSync(argv.path) && !argv.f) {
        throw `The folder must be empty. Use -f in order to force the project creation`;
    }
    // fs.copySync(`../../../../templates/${argv.projectType}`, argv.path);
};