import { Argv, Arguments } from 'yargs';

export const command: string = 'nestjs <command>';
export const desc: string = 'Create or generate new nestjs resources';

export const builder = (yargs: Argv) =>
    yargs.usage('Usage: $0 nestjs <command> [Options]')
        .commandDir('nestjs')
        .demandCommand()
        .version(false);