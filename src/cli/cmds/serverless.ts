import { Argv, Arguments } from 'yargs';

export const command: string = 'serverless <command>';
export const aliases: string[] = ['sls'];
export const desc: string = 'Create or generate new serverless resources';

export const builder = (yargs: Argv) =>
    yargs.usage('Usage: $0 serverless <command> [Options]')
        .commandDir('serverless')
        .demandCommand()
        .version(false);
