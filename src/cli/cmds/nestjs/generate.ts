import { Argv, Arguments } from 'yargs';
import * as _ from 'lodash';
import * as winston from 'winston';

export const command: string = 'generate <schematic> <name> [path]';
export const aliases: string[] = ['g'];
export const desc: string =  'Generate a NestJS resource based on schematic.';

export const builder =  (yargs: Argv) =>
    yargs.usage('Usage: $0 nestjs generate <schematic> <name> [path] [Options]')
    .positional('schematic', {
        type: 'string',
        desc: 'Nestjs framework asset type',
    }).positional('name', {
        type: 'string',
        desc: 'Asset name or path',
    }).positional('path', {
        type: 'string',
        desc: 'Path to generate the asset',
    }).options({
        'dry-run': {
            type: 'boolean',
            desc: 'allow to test changes before execute command.',
        },
    })
    .version(false);

export const handler = (argv: Arguments) => {
    // TODO: when nestjs cli migrate to TS we should change this require:
    const action = require('@nestjs/cli/actions/generate');
    action(_.pickBy(_.pick(argv, ['schematic', 'name', 'path']), (value) => value), argv.dryRun ? { dryRun: true} : {}, new (winston.Logger)({
        level: 'info',
        format: 'json',
        transports: [
            new winston.transports.Console({
                format: 'json',
            }),
        ]
    }));
};