import { Argv, Arguments } from 'yargs';
import * as _ from 'lodash';
import * as winston from 'winston';

export const command: string = 'new [name] [description] [version] [author]';
export const aliases: string[] = ['n'];
export const desc: string =  'Create a new nestjs project based on schematic';

export const builder =  (yargs: Argv) =>
    yargs.usage('Usage: $0 nestjs new [name] [description] [version] [author] [Options]')
        .positional('name', {
            desc: 'The NestJS application name.',
            type: 'string',
        }).positional('description', {
            desc: 'The NestJS application description.',
            type: 'string',
        }).positional('version', {
            desc: 'The NesJS application version.',
            type: 'string',
        }).positional('author', {
            desc: 'The NestJS application author.',
            type: 'string',
        }).options({
            'dry-run': {
                type: 'boolean',
                desc: 'allow to test changes before execute command.'
            },
        })
        .example('$0 nestjs new new-project none 1.0.0 oasp', 'Create a new nestjs project called new-project, with none description, with version 1.0.0 and author oasp')
        .version(false);

export const handler = (argv: Arguments) => {
    // TODO: when nestjs cli migrate to TS we should change this require:
    const action = require('@nestjs/cli/actions/new');
    // TODO: actually dry-run is bug at @nestjs/cli, we must change it when they publish the patch
    action(_.pick(argv, ['name', 'description', 'version', 'author']), /*_.pick(argv, ['dry-run'])*/ {}, new (winston.Logger)({
        level: 'info',
        format: 'json',
        transports: [
            new winston.transports.Console({
                format: 'json',
            }),
        ]
    }));
};
