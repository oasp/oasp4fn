import { Argv, Arguments } from 'yargs';
import * as inquirer from 'inquirer';
import * as _ from 'lodash';
import * as mustache from 'mustache';
import * as fs from 'fs-extra';
import * as path from 'path';
import * as chalk from 'chalk';

export const command: string = 'handler <provider>';
export const desc: string =  'Create a new handler based on template';

const providerChoices: string[] = ['aws'];
const handlerFileEnding = '-handler.ts';

export const builder =  (yargs: Argv) =>
    yargs.usage('Usage: $0 new handler <provider> [Options]')
        .positional('provider', {
            default: 'aws',
            type: 'string',
            choices: providerChoices,
            desc: 'The provider for which you want to generate the new handler',
        })
        .option({
            event: {
                alias: 'e',
                type: 'string',
                nargs: 1,
                desc: 'The type of event that you want to listen',
            },
            trigger: {
                alias: 't',
                type: 'string',
                desc: 'The type of trigger that will activate the handler',
                nargs: 1,
            },
            'handler-name': {
                alias: 'n',
                type: 'string',
                desc: 'The name of the handler',
                nargs: 1,
            },
            path: {
                alias: 'p',
                type: 'string',
                desc: 'The URL path where the handler will be listening',
                nargs: 1,
            },
            bucket: {
                alias: 'b',
                type: 'string',
                desc: 'The S3 bucket that you will use',
                nargs: 1,
            },
        })
        .example('$0 new handler aws --event Http --trigger get --handler-name myHandler --path /mypath', `Create a new AWS handler at /handlers/Http/get/myHandler.ts`)
        .version(false);


export const handler = (argv: Arguments) => {
    const questions: inquirer.Question[] = [
        {
            type: 'input',
            name: 'event',
            message: 'Enter the event that you want generate',
            when: () => !argv.event,
        }, {
            name: 'trigger',
            type: 'input',
            message: 'Enter the trigger that will activate the handler',
            when: () => !argv.trigger
        }, {
            name: 'handler-name',
            message: 'Enter the handler name',
            when: () => !argv['handler-name']
        }, {
            name: 'path',
            message: 'Enter the URL path',
            when: (values) => !argv.path && !(argv.event.toLowerCase() === 's3' || values.event.toLowerCase() === 's3'),

        }, {
            name: 'bucket',
            message: 'Enter the bucket name',
            when: (values) => !argv.bucket && !(argv.event.toLowerCase() === 's3' || values.event.toLowerCase() === 's3'),
        }
    ];

    inquirer.prompt(questions).then((values: inquirer.Answers) => {
        const result = _.assign(argv, values);
        const destinationPath = path.join(process.cwd(), `handlers/${result.event}/${result.trigger}`);

        if (result.path && !result.path.startsWith('/')) {
            result.path = `/${result.path}`;
        }

        let template: Buffer = fs.readFileSync(path.join(__dirname, `../../../../templates/serverless/${argv.provider}/handler/${argv.event.toLowerCase()}Handler.mst`));

        fs.ensureDirSync(destinationPath);
        fs.writeFileSync(path.join(destinationPath, result['handler-name'] + handlerFileEnding), mustache.render(template.toString('utf8'), result));

        console.log(`${chalk.blue(result['handler-name'] + handlerFileEnding)} created succesfully`);
    }, (reason: any) => {
        throw reason;
    });
};
