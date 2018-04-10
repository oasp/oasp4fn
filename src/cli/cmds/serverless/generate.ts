import { Argv } from 'yargs';

export const command: string = 'generate';
export const aliases: string[] = ['g', 'gen'];
export const desc: string = 'Generate a new serverless resource based on template';

export const builder = (yargs: Argv) =>
    yargs.usage('Usage: $0 serverless generate <command> [Options]')
        .commandDir('generate')
        .demandCommand()
        .version(false);
