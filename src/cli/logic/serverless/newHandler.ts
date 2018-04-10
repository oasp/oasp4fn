import * as path from 'path';
import * as fs from 'fs-extra';
import { blue } from 'chalk';
import * as mustache from 'mustache';
import { NewHandlerOptions } from '../../types/cliTypes';

const handlerFileEnding = '-handler.ts';

export function generateNewHandler(options: NewHandlerOptions, destFolder?: string) {
    const destinationPath = path.join((destFolder || process.cwd()), `handlers/${options.event}/${options.trigger}`);

    if (options.path && !options.path.startsWith('/')) {
        options.path = `/${options.path}`;
    }

    let template: Buffer = fs.readFileSync(path.join(__dirname, `../../../../templates/serverless/${options.provider.toLowerCase()}/handler/${options.event.toLowerCase()}Handler.mst`));

    fs.ensureDirSync(destinationPath);
    fs.writeFileSync(path.join(destinationPath, options['handler-name'] + handlerFileEnding), mustache.render(template.toString('utf8'), options));

    console.log(`${blue(options['handler-name'] + handlerFileEnding)} created succesfully`);
}