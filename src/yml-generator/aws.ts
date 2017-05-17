import { inflateRawSync } from 'zlib';

import { readFileSync } from 'fs';
import * as _ from 'lodash';
import * as ts from 'typescript';

const DEFAULTS = {
    http: { integration: 'lambda', cors: true, name: (name: string) => { return {method: name}; } },
    s3: { name: (name: string) => { return {event: _.get({created: 's3:ObjectCreated:*', removed: 's3:ObjectRemoved:*'}, name)}; }},
    iamRoleStatements: [
        {
            Effect: 'Allow',
            Action: [
                'dynamodb:*'
            ],
            Resource: 'arn:aws:dynamodb:*:*:*'
        },
        {
            Effect: 'Allow',
            Action: [
                's3:*'
            ],
            Resource: 'arn:aws:s3:*:*:*'
        }
    ]
};

export function tscParser (files: string[], yml: any) {
    yml.functions = {};
    _.forEachRight(files, (file) => {
         let sourceFile = ts.createSourceFile(file, readFileSync(file).toString(), ts.ScriptTarget.ES2016, false);
         let fileName = sourceFile.fileName;
         let fn_obj = {oasp4fn: {
             handler: _.trimEnd(fileName, 'ts'),
             events: {}
         }};
        searchEvent(fileName, fn_obj);
        let total = sourceFile.getChildAt(0).getChildren().length - 1;
         _.forEach( sourceFile.getChildAt(0).getChildren(), (child, i) => {
             switch (child.kind) {
                 case ts.SyntaxKind.ImportDeclaration:
                    importHelper(<ts.ImportDeclaration>child, fn_obj);
                    break;
                 case ts.SyntaxKind.ExpressionStatement:
                    expressionHelper(<ts.ExpressionStatement>child, fn_obj);
                    break;
                 case ts.SyntaxKind.FunctionDeclaration:
                     functionHelper(<ts.FunctionDeclaration>child, fn_obj);
                     break;
             }
             if (i === total) {
                addHandler(fn_obj, yml);
             }
         });
    });
    _.set(yml.provider, 'iamRoleStatements', DEFAULTS.iamRoleStatements);
    return yml;
}

let searchEvent = (path: string, obj: any) => {
    let folders = path.split('/');
    _.some(folders, (folder, i, collection) => {
        let event: any = _.get(DEFAULTS, _.toLower(folder));
        if (event) {
            obj.event = _.toLower(folder);
            event = _.omit(_.assign(event, event.name(_.toLower(collection[i + 1]))), 'name');
            _.assign(obj.oasp4fn.events,  event);
        }
        return event;
    });
};

let importHelper = (child: ts.ImportDeclaration, obj: any) => {
    let import_dirs: string[] = (<ts.Identifier>(<ts.ImportDeclaration>child).moduleSpecifier).text.split('/');
    let import_name: string;
    if (import_dirs.length < 1)
        import_name = import_dirs[0];
    else
        import_name = <string>import_dirs.pop();
    switch (import_name) {
        case 'oasp4fn':
            obj.import = (<ts.Identifier>(<ts.ImportClause>(<ts.ImportDeclaration>child).importClause).name).text;
    }
};

let expressionHelper = (child: ts.ExpressionStatement, obj: any) => {
    let expression = (<ts.CallExpression>(<ts.ExpressionStatement>child).expression);
    if ((<ts.Identifier>(<ts.PropertyAccessExpression>expression.expression).expression).text === obj.import && (<ts.Identifier>(<ts.PropertyAccessExpression>expression.expression).name).text === 'config') {
        let args = expression.arguments;
        if (args.length > 0) {
            let properties = (<ts.ObjectLiteralExpression>args.shift()).properties;
            _.assign(obj.oasp4fn.events, _.reduceRight(<any>properties, (accumulator: any, property) => {
                let key = (<ts.Identifier>(<ts.PropertyAssignment>property).name).text;
                let value = (<ts.PropertyAssignment>property).initializer;

                switch (value.kind) {
                    case ts.SyntaxKind.StringLiteral:
                        let str = (<ts.StringLiteral>value).text;
                        _.set(accumulator, key, str);
                        break;
                    case ts.SyntaxKind.FalseKeyword:
                        _.set(accumulator, key, false);
                        break;
                    case ts.SyntaxKind.TrueKeyword:
                        _.set(accumulator, key, true);
                        break;
                    case ts.SyntaxKind.FirstLiteralToken:
                        _.set(accumulator, key, +(<ts.StringLiteral>value).text);
                        break;
                    case ts.SyntaxKind.Identifier:
                        if ((<ts.Identifier>value).originalKeywordKind === ts.SyntaxKind.UndefinedKeyword)
                            _.unset(obj.oasp4fn.events, key);
                }
                return accumulator;
            }, {}));
        }
    }
};

let functionHelper = (child: ts.FunctionDeclaration, obj: any) => {
    if (child.modifiers)
        _.some(child.modifiers, (modifier) => {
            let ok = modifier.kind === ts.SyntaxKind.ExportKeyword;
            if (ok)
                obj.name = (<ts.Identifier>child.name).text;
            return ok;
        });
};

let addHandler = (obj: any, yml: any) => {
    obj.oasp4fn.handler = `${obj.oasp4fn.handler}${obj.name}`;
    obj.oasp4fn.events = [_.set({}, obj.event, obj.oasp4fn.events)];
    _.set(yml.functions, obj.name, obj.oasp4fn);
};