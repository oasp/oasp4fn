
import * as fs from 'fs';
import * as path from 'path';
import * as _ from 'lodash';
import * as yml from 'js-yaml';
import * as chalk from 'chalk';

const DEFAULTS = {
    path: 'handlers',
    app: false,
    aws: {
        provider: {name: 'aws', runtime: 'nodejs6.10', region: 'us-west-2'},
        plugins: ['serverless-webpack', 'serverless-offline']
    },
    azure: {
        provider: {name: 'azure', location: 'West US'},
        plugins: ['serverless-azure-functions']
    },
    openwhisk: {
        provider: {name: 'openwhisk', ignore_certs: true}
    },
    google: {
        provider: {name: 'google'},
        plugins: ['serverless-google-cloudfunctions']
    }
};

const WEBPACK =
`var path = require('path');
var nodeExternals = require('webpack-node-externals');

module.exports = {
    target: 'node',
    module: {
        loaders: [
            { test: /\.ts(x?)$/, loader: 'ts-loader' },
            { test: /.json$/, loaders: ['json'] }
        ]
    },
    resolve: {
        extensions: ['.ts', '.js', '.tsx', '.jsx', '']
    },
    output: {
        libraryTarget: 'commonjs',
        path: path.join(__dirname, '.webpack'),
        filename: '[name].js'
    },
    externals: [ nodeExternals() ],
    entry: {
`;

export function run(opts: any) {
    let options: any = opts ? defineOptions(opts) : _.assign({}, DEFAULTS.aws, { path: DEFAULTS.path });
    let dirs = fs.readdirSync(options.path);
    dirs = _.reduceRight(<any>dirs, (accumulator: any, value) => {
        let aux = `${options.path}${path.sep}${value}`;
        if (fs.statSync(aux).isDirectory())
            accumulator.push(aux);
        return accumulator;
    }, []);
    let files = extractFiles(dirs, []);
    let tscParser: Function;
    switch (options.provider.name) {
        case 'aws':
            tscParser = require('./aws').tscParser;
            break;
        case 'azure':
        case 'openwhisk':
        case 'google':
        default:
            throw `The service ${options.provider.name} isn't valid. Please, for more information, run "oasp4fn --help"`;
    }
    serviceName(options);
    let serverless_yml = tscParser(files, options);
    if(DEFAULTS.app)
        generateApp(serverless_yml);
    generateYaml(_.omit(serverless_yml, ['imports', 'routes']));
    generateWebpack(files);
}

let extractFiles = (paths: string[], files: string[]): string[] => {
    if (paths.length === 0)
        return files;
    else {
        let aux_dir = <string>paths.pop();
        let paths_aux = _.reduceRight(fs.readdirSync(aux_dir), (accumulator: any, value: string) => {
            let aux = `${aux_dir}${path.sep}${value}`;
            if (fs.statSync(aux).isFile())
                files.push(aux);
            else
                accumulator.push(aux);
            return accumulator;
        }, []);
        return extractFiles(_.concat(paths, paths_aux), files);
    }
};

let defineOptions = (opts: any) => {
    if (!opts.path)
        opts.path = DEFAULTS.path;
    if (opts.app) {
        DEFAULTS.app = opts.app;
        _.unset(opts, 'app');
    }
    if (opts.provider) {
        if (typeof opts.provider === 'string') {
            let providerObject = <{provider: object}>_.get(DEFAULTS, opts.provider);
            opts.provider =  providerObject.provider;
            _.assignWith(opts, providerObject, (objValue, srcValue) => {
                return _.isUndefined(objValue) ? srcValue : objValue;
            });
        }
    }
    else
        _.assignWith(opts, _.get(DEFAULTS, 'aws'), (objValue, srcValue) => {
            return _.isUndefined(objValue) ? srcValue : objValue;
        });
    return opts;
};

let serviceName = (obj: any) => {
    if (!obj.service) {
        let dirs = process.cwd().split(path.sep);
        obj.service = dirs[dirs.length - 1];
    }
};

let generateYaml = (obj: any) => {
    let dump = yml.safeDump(obj);
    fs.writeFile('serverless.yml', dump, (err) => {
        if (err)
            console.log(`  ${chalk.red('Error')} creating severless.yml`);
        else 
            console.log(`  ${chalk.blue('serverless.yml')} created succesfully`);
    });
};

let generateWebpack = (files: any) => {
    let out = _.reduceRight(files, (accumulator: string, file: string) => {
        let str = _.replace(file, /\\/g, '/');
        return `${accumulator}\t\t'${_.trimEnd(`/${str}`, '.ts')}': './${str}',\n`;
    }, WEBPACK);
    out = `${out}\t}\n};`;
    fs.writeFile('webpack.config.js', out, (err) => {
        if (err)
            console.log(`  ${chalk.red('Error')} creating webpack.config.json`);
        else
            console.log(`  ${chalk.blue('webpack.config.json')} created succesfully`);
    });
};

let generateApp = (obj: any) => {
    let app =
`
import * as express from 'express';
import * as cors from 'cors';
import * as bodyParser from 'body-parser';
import * as _ from 'lodash';
${_.trim(obj.imports)}

let app = express();
app.set('port', process.env.PORT || 3000);

app.use(cors());
app.options('*', cors());
app.use(bodyParser.json());

const getContext = (opts: {name: string, memory: number, timeout: number}, done: Function) => {
    let endTime = new Date().getTime() + opts.timeout;
    return {
        done: done,
        succed: (res: object) => done(null, res),
        fail: (err: Error) => done(err, null),
        getRemainigTimeInMillis: () => endTime - new Date().getTime(),
        functionName: name,
        memoryLimitInMB: opts.memory,
        functionVersion: \`oasp4fn_functionVersion_for_\${name}\`,
        invokedFunctionArn: \`oasp4fn_invokedFunctionArn_for_\${name}\`,
        awsRequestId: \`oasp4fn_awsRequestId_\${Math.random().toString(10).slice(2)}\`,
        logGroupName: \`oasp4fn_logGroupName_for_\${name}\`,
        logStreamName: \`oasp4fn_logStreamName_for_\${name}\`,
        identity: {},
        clientContext: {}
    }
}

const getEvent = (req: express.Request) => {
    return {
        method: req.method,
        headers: _.mapKeys(req.headers, (value, key) => {
            if (key === 'authorization')
                return _.upperFirst(key);
            return key;
        }),
        query: req.query,
        path: <any>_.reduceRight(req.params, (accum: object, param: string, key: string) => _.set(accum, key, _.trim(param,'"')), {}),
        body: req.body
    }
}

${_.trim(obj.routes)}

app.listen(app.get('port'), () => {
    console.log('Conveyor server listening on port ' + app.get('port'));
});
`;

    fs.writeFile(`${DEFAULTS.path}/app.ts`, app, (err) => {
        if (err)
            console.log(`  ${chalk.red('Error')} creating app.ts`);
        else 
            console.log(`  ${chalk.blue('app.ts')} created succesfully`);
    });
};