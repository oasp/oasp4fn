import { Argv, Arguments } from 'yargs';
import * as inquirer from 'inquirer';
import * as _ from 'lodash';
import * as mustache from 'mustache';
import * as fs from 'fs-extra';

export const command: string = 'handler <provider>';
export const desc: string =  'Create a new handler based on template';

export const builder =  (yargs: Argv) =>
    yargs.usage('Usage: $0 new handler <provider> [Options]')
        .positional('provider', {
            default: 'aws',
            type: 'string',
            choices: ['aws'],
            desc: 'The provider for which you want to generate the new handler',
        })
        .option({
            event: {
                alias: 'e',
                choices: ['Http', 'S3'],
                type: 'string',
                nargs: 1,
                desc: '',
            },
            trigger: {
                alias: 't',
                type: 'string',
                desc: '',
                nargs: 1,
            },
            'handler-name': {
                alias: 'n',
                type: 'string',
                desc: '',
                nargs: 1,
            },
            path: {
                alias: 'p',
                type: 'string',
                desc: '',
                nargs: 1,
            },
            bucket: {
                alias: 'b',
                type: 'string',
                desc: '',
                nargs: 1,
            },
        })
        .example('$0 new handler aws --event Http --trigger get --handler-name myHandler --path /mypath', `Create a new AWS handler at /handlers/Http/get/myHandler.ts`)
        .version(false);


export const handler = (argv: Arguments) => {
    const questions: inquirer.Question[] = [
        {
            type: 'list',
            name: 'event',
            choices: ['Http', 'S3'],
            message: 'event message',
            when: () => !argv.event,
        }, {
            name: 'trigger',
            message: 'trigger message',
            when: () => !argv.trigger
        }, {
            name: 'handler-name',
            message: 'handler-name message',
            when: () => !argv['handler-name']
        }, {
            name: 'path',
            message: 'path message',
            when: (values) => !argv.path && (argv.event === 'Http' || values.event === 'Http')

        }, {
            name: 'bucket',
            message: 'bucket message',
            when: (values) => !argv.bucket && (argv.event === 'S3' || values.event === 'S3')
        }
    ];

    inquirer.prompt(questions).then((values: inquirer.Answers) => {
        const result = _.assign(argv, values);

        console.log(result);
        let template: Buffer = fs.readFileSync(`../../../../templates/serverless/${argv.provider}/handler/${argv.event.toLowerCase()}Handler.mst`);
        console.log(mustache.render(template.toString('utf8'), result));
    }, (reason: any) => {
        console.log(reason);

    });
};