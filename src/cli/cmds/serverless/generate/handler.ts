import { Argv, Arguments } from 'yargs';
import * as inquirer from 'inquirer';
import * as _ from 'lodash';
import { generateNewHandler } from '../../../logic/serverless/newHandler';

export const command: string = 'handler <provider>';
export const aliases: string[] = ['h'];
export const desc: string =  'Geneate a new handler based on template';

const providerChoices: string[] = ['aws'];

export const builder =  (yargs: Argv) =>
    yargs.usage('Usage: $0 serverless generate handler <provider> [Options]')
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
        .example('$0 serverless generate handler aws --event Http --trigger get --handler-name myHandler --path /mypath', `Create a new AWS handler at /handlers/Http/get/myHandler.ts`)
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
            when: (values) => !argv.path && !((argv.event !== undefined && argv.event.toLowerCase() === 's3') || (values.event !== undefined && values.event.toLowerCase() === 's3')),

        }, {
            name: 'bucket',
            message: 'Enter the bucket name',
            when: (values) => !argv.path && ((argv.event !== undefined && argv.event.toLowerCase() === 's3') || (values.event !== undefined && values.event.toLowerCase() === 's3'))
        }
    ];

    inquirer.prompt(questions).then((values: inquirer.Answers) => {
        const result = _.assign(argv, values) as any;

        generateNewHandler(result);
    }).catch((reason: any) => {
        throw reason;
    });
};
