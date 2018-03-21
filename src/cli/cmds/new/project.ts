import { Argv, Arguments } from 'yargs';
import * as path from 'path';
import * as fs from 'fs-extra';
import * as chalk from 'chalk';

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
    .example('$0 new project nestjs -p ./new-project', `Create a new nestjs project at ${process.cwd()}${path.sep}new-project`)
    .version(false);

export const handler = (argv: Arguments) => {
    let template: string = argv.projectType;

    if (template === 'serverless' && argv.provider) {
        template = template.concat('/', argv.provider);
    }

    if (argv.path) {
        fs.ensureDirSync(path.join(process.cwd(), argv.path));
    }

    else {
        argv.path = process.cwd();
    }

    if (fs.readdirSync(argv.path).length > 0 && !argv.f) {
        throw `The folder must be empty. Use -f in order to force the project creation`;
    }

    fs.copySync(path.join(__dirname, `../../../../templates/${template}/project`), argv.path);
    console.log(`${chalk.blue(argv.projectType + ' project')} created succesfully`);
};