import { Argv } from 'yargs';

export const command: string = 'new';
export const desc: string = 'Create a new resource based on template';

export const builder = (yargs: Argv) =>
    yargs.usage('Usage: $0 new <command> [Options]')
        .commandDir('new')
        .demandCommand()
        .version(false);
