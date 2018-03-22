import { Arguments, Argv } from 'yargs';
import { run } from '../../generators/index';
import * as fs from 'fs';
import * as path from 'path';
import * as _ from 'lodash';
import * as chalk from 'chalk';

export const command: string = 'generate [provider]';
export const desc: string = 'Generate serverless.yml and webpack.js based on your project';

export const builder = (yargs: Argv) =>
    yargs.usage('Usage: $0 generate [provider] [Options]')
        .positional('provider', {
            describe: 'Serverless provider',
            choices: ['aws', 'azure', 'google', 'openwhisk'],
            default: 'aws'
        }).options({
            'opts': {
                alias: 'o',
                type: 'string',
                nargs: 1,
                describe: 'file with the options for the yml generation' },
            'path': {
                alias: 'p',
                type: 'string',
                nargs: 1,
                describe: 'directory where the handlers are stored'},
            'express': {
                alias: 'e',
                type: 'boolean',
                desc: 'generates an express app.ts file'}
        }).example('$0 generate aws', 'Generate files for aws provider')
        .version(false);

export const handler = (argv: Arguments) => {
    let opts: any = {app: argv.e};

    if (argv.opts) opts.config = argv.opts;
    if (argv.path) opts.path = argv.path;

    if (opts.config) {
        if (fs.existsSync(opts.config)) {
            _.assign(opts, require(`${process.cwd()}${path.sep}${opts.config}`));
            opts = _.omit(opts, 'config');
        } else
            console.log(`${chalk.red('Error!')}\nThe options file "${opts.config}" doesn't exist.`);
    } else if (fs.existsSync('oasp4fn.config.js')) {
        _.assign(opts, require(`${process.cwd()}${path.sep}oasp4fn.config.js`));
    }

    _.isEmpty(opts) ? run() : run(opts);
};
