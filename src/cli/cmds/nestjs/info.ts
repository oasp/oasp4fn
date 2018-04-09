import { Argv, Arguments } from 'yargs';
import * as winston from 'winston';

export const command: string = 'info';
export const aliases: string[] = ['i'];
export const desc: string =  'Display Nest CLI information.';

export const builder =  (yargs: Argv) =>
    yargs.usage('Usage: $0 nestjs info')
    .version(false);

export const handler = (argv: Arguments) => {
    // TODO: when nestjs cli migrate to TS we should change this require:
    const action = require('@nestjs/cli/actions/info');
    action({}, {}, new (winston.Logger)({
        level: 'info',
        format: 'json',
        transports: [
            new winston.transports.Console({
                format: 'json',
            }),
        ]
    }));
};