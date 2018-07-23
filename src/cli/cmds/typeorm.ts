import { Argv, Arguments } from 'yargs';
import {SchemaSyncCommand} from 'typeorm/commands/SchemaSyncCommand';
import {SchemaDropCommand} from 'typeorm/commands/SchemaDropCommand';
import {QueryCommand} from 'typeorm/commands/QueryCommand';
import {EntityCreateCommand} from 'typeorm/commands/EntityCreateCommand';
import {MigrationCreateCommand} from 'typeorm/commands/MigrationCreateCommand';
import {MigrationRunCommand} from 'typeorm/commands/MigrationRunCommand';
import {MigrationRevertCommand} from 'typeorm/commands/MigrationRevertCommand';
import {SubscriberCreateCommand} from 'typeorm/commands/SubscriberCreateCommand';
import {SchemaLogCommand} from 'typeorm/commands/SchemaLogCommand';
import {MigrationGenerateCommand} from 'typeorm/commands/MigrationGenerateCommand';
import {VersionCommand} from 'typeorm/commands/VersionCommand';
import {InitCommand} from 'typeorm/commands/InitCommand';
import {CacheClearCommand} from 'typeorm/commands/CacheClearCommand';

export const command: string = 'typeorm <command>';
export const desc: string = 'Typeorm CLI';

export const builder = (yargs: Argv) =>
    yargs.usage('Usage: $0 typeorm <command> [Options]')
        .command(new SchemaSyncCommand())
        .command(new SchemaLogCommand())
        .command(new SchemaDropCommand())
        .command(new QueryCommand())
        .command(new EntityCreateCommand())
        .command(new SubscriberCreateCommand())
        .command(new MigrationCreateCommand())
        .command(new MigrationGenerateCommand())
        .command(new MigrationRunCommand())
        .command(new MigrationRevertCommand())
        .command(new VersionCommand())
        .command(new CacheClearCommand())
        .command(new InitCommand())
        .strict()
        .demandCommand(1)
        .version(false);