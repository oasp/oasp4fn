import { ProjectType, NewProjectOptions } from '../types/cliTypes';
import * as path from 'path';
import * as fs from 'fs-extra';
import { blue } from 'chalk';

export function generateNewProject(projectType: ProjectType, options: NewProjectOptions) {
    let template: string = projectType;

    if (template === ProjectType.Serverless && options.provider) {
        template = template.concat('/', options.provider);
    }

    fs.copySync(path.join(__dirname, `../../../templates/${template}/project`), options.path);
    const packagejson = require(path.resolve(options.path, 'package.json'));
    packagejson.author = {};
    packagejson.name = options.projectName;
    packagejson.author.name = options.name;
    packagejson.author.email = options.email;

    fs.writeFileSync(path.resolve(options.path, 'package.json'), JSON.stringify(packagejson, null, 2));

    console.log(`${blue(projectType + ' project')} created succesfully`);
}